import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private sesClient: SES | null = null;
  private emailProvider: string;
  private emailFrom: string;

  constructor(private readonly configService: ConfigService) {
    this.emailProvider = this.configService.get('EMAIL_PROVIDER', 'smtp');
    this.emailFrom = this.configService.get('EMAIL_FROM', 'noreply@imotion.com');
    
    this.initializeProvider();
  }

  private initializeProvider() {
    if (this.emailProvider === 'smtp') {
      this.initializeSMTP();
    } else if (this.emailProvider === 'ses') {
      this.initializeSES();
    } else {
      this.logger.warn(`Unknown email provider: ${this.emailProvider}. Email sending disabled.`);
    }
  }

  private initializeSMTP() {
    const smtpHost = this.configService.get('SMTP_HOST');
    const smtpPort = this.configService.get('SMTP_PORT', 587);
    const smtpUser = this.configService.get('SMTP_USER');
    const smtpPassword = this.configService.get('SMTP_PASSWORD');

    if (!smtpHost || !smtpUser || !smtpPassword) {
      this.logger.warn('SMTP configuration incomplete. Email sending disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    this.logger.log(`SMTP email service initialized (${smtpHost}:${smtpPort})`);
  }

  private initializeSES() {
    const sesRegion = this.configService.get('AWS_SES_REGION');
    const sesAccessKey = this.configService.get('AWS_SES_ACCESS_KEY');
    const sesSecretKey = this.configService.get('AWS_SES_SECRET_KEY');

    if (!sesRegion || !sesAccessKey || !sesSecretKey) {
      this.logger.warn('AWS SES configuration incomplete. Email sending disabled.');
      return;
    }

    this.sesClient = new SES({
      region: sesRegion,
      accessKeyId: sesAccessKey,
      secretAccessKey: sesSecretKey,
    });

    this.logger.log(`AWS SES email service initialized (${sesRegion})`);
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (this.emailProvider === 'smtp' && this.transporter) {
        return await this.sendViaSMTP(options);
      } else if (this.emailProvider === 'ses' && this.sesClient) {
        return await this.sendViaSES(options);
      } else {
        this.logger.warn('Email service not configured. Skipping email send.');
        return false;
      }
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      return false;
    }
  }

  private async sendViaSMTP(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      throw new Error('SMTP transporter not initialized');
    }

    const recipients = Array.isArray(options.to) ? options.to.join(', ') : options.to;

    const info = await this.transporter.sendMail({
      from: this.emailFrom,
      to: recipients,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    this.logger.log(`Email sent via SMTP: ${info.messageId}`);
    return true;
  }

  private async sendViaSES(options: EmailOptions): Promise<boolean> {
    if (!this.sesClient) {
      throw new Error('SES client not initialized');
    }

    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    const params: SES.SendEmailRequest = {
      Source: this.emailFrom,
      Destination: {
        ToAddresses: recipients,
      },
      Message: {
        Subject: {
          Data: options.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: options.html,
            Charset: 'UTF-8',
          },
          Text: options.text
            ? {
                Data: options.text,
                Charset: 'UTF-8',
              }
            : undefined,
        },
      },
    };

    const result = await this.sesClient.sendEmail(params).promise();
    this.logger.log(`Email sent via SES: ${result.MessageId}`);
    return true;
  }
}
