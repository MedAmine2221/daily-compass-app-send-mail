import { Injectable, Logger } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { FirebaseService } from 'src/firebase-admin.init';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private appService: AppService,
    private firebaseService: FirebaseService, // inject FirebaseService
  ) {}

  async checkTasksAndSendEmails() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const tasksRef = this.firebaseService.firestore.collection('tasks');
    const snapshot = await tasksRef.get();

    for (const doc of snapshot.docs) {
      const task = doc.data();
      const start = new Date(task.startDate.replace(' ', 'T'));
      const end = new Date(task.endDate.replace(' ', 'T'));
      start.setHours(start.getHours() + 1);
      end.setHours(end.getHours() + 1);
      const isActive = now >= start && now <= end;
      const notNotified = task.emailNotification === false;
      if (isActive && notNotified) {
        try {
          // Fetch user email from Firebase Auth via FirebaseService
          const user = await this.firebaseService.auth.getUser(task.userId);
          const email = user.email;
          const userDoc = await this.firebaseService.firestore
            .collection('users')
            .doc(user?.uid) // uid
            .get();
          if (userDoc?.data()?.emailNotification === false) {
            this.logger.warn(
              `This user ${user.uid} has not enabled email notifications`,
            );
            continue;
          }
          if (!email) {
            this.logger.warn(`User ${task.userId} has no email`);
            continue;
          }
          // Send email
          await this.appService.sendEmail(
            email,
            `Notification: ${task.title}`,
            `
              <!DOCTYPE html>
              <html lang="fr">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Daily Compass - Notification de Tâche</title>
              </head>
              <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0f4f8;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f0f4f8;">
                      <tr>
                          <td style="padding: 40px 20px;">
                              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                                  <!-- Header avec logo et brand -->
                                  <tr>
                                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 40px; text-align: center; position: relative;">
                                          <!-- Compass Icon -->
                                          <div style="margin: 0 auto 16px; width: 80px; height: 80px;">
                                              <img src="https://lh3.googleusercontent.com/d/1cgBHo3FiSoHXae3JAHFCLAS_m_SuQvX_" alt="Daily Compass Logo" style="width: 80px; height: 80px; display: block; margin: 0 auto; border-radius: 50%; background-color: rgba(255,255,255,0.2); padding: 8px;">
                                          </div>
                                          <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: -0.5px; text-align: center;">Your Daily Compass</h1>
                                          <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 15px; text-align: center;">Votre assistant de productivité</p>
                                      </td>
                                  </tr>
                                  <!-- Notification Badge -->
                                  <tr>
                                      <td style="padding: 0;">
                                          <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); padding: 16px 40px; text-align: center;">
                                              <table role="presentation" style="margin: 0 auto;">
                                                  <tr>
                                                      <td style="padding-right: 12px; vertical-align: middle;">
                                                          <span style="font-size: 28px;">✓</span>
                                                      </td>
                                                      <td style="vertical-align: middle;">
                                                          <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: bold;">Tâche Commencée</p>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </div>
                                      </td>
                                  </tr>
                                  <!-- Main Content -->
                                  <tr>
                                      <td style="padding: 40px;">
                                          <h2 style="margin: 0 0 24px 0; color: #1f2937; font-size: 24px; font-weight: bold; text-align: center;">Une nouvelle tâche a été lancée 🚀</h2>
                                          <!-- Task Card -->
                                          <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #667eea;">
                                              <table role="presentation" style="width: 100%;">
                                                  <tr>
                                                      <td style="padding-bottom: 16px;">
                                                          <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Nom de la Tâche</p>
                                                          <p style="margin: 0; color: #1f2937; font-size: 20px; font-weight: bold;">${task.title}</p>
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="padding-bottom: 12px;">
                                                          <table role="presentation" style="width: 100%;">
                                                              <tr>
                                                                  <td style="width: 50%; padding-right: 8px;">
                                                                      <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600;">📅 Date de début</p>
                                                                      <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 500;">${task.startDate}</p>
                                                                  </td>
                                                                  <td style="width: 50%; padding-left: 8px;">
                                                                      <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600;">⏰ Date de fin</p>
                                                                      <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 500;">${task.endDate}</p>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td>
                                                          <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600;">🎯 Priorité</p>
                                                          <span style="display: inline-block; background-color: #ef4444; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold;">${task?.priority}</span>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </div>
                                          <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.6; text-align: center;">
                                              Cette tâche a été lancée avec succès. Vous pouvez suivre sa progression dans l'application Daily Compass.
                                          </p>
                                      </td>
                                  </tr>
                                  <!-- Footer -->
                                  <tr>
                                      <td style="background-color: #f9fafb; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                                          <p style="margin: 0 0 16px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                                              Daily Compass - Organisez votre journée avec efficacité
                                          </p>
                                          <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                                              Vous recevez cet email car vous avez activé les notifications pour vos tâches.<br>
                                              Gérez vos préférences dans les paramètres de l'application.
                                          </p>
                                          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                              © 2025 Daily Compass. Tous droits réservés.
                                          </p>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </body>
              </html>
            `,
          );
          // Update the task notification flag
          await doc.ref.update({ emailNotification: true });

          this.logger.log(`Email sent to ${email} for task ${task.title}`);
        } catch (err) {
          this.logger.error(`Error sending email for ${task.title}`, err);
        }
      }
    }
  }
}
