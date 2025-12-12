import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseService {
  public firestore: admin.firestore.Firestore;
  public auth: admin.auth.Auth;

  constructor(private readonly configService: ConfigService) {
    let app: admin.app.App;

    if (!admin.apps.length) {
      const serviceAccount: ServiceAccount = {
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: this.configService
          .get<string>('FIREBASE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
      };

      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      app = admin.app();
    }

    this.firestore = app.firestore();
    this.auth = app.auth();
  }
}
