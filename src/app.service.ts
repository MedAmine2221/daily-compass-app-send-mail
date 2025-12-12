import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class AppService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    } as SMTPTransport.Options);
  }
  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `"Daily Compass App" <${this.configService.get<string>('EMAIL_USER')}>`,
      to,
      subject,
      html,
    });
  }
}
