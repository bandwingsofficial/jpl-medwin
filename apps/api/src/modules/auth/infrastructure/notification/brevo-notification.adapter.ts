import { Injectable, Logger } from '@nestjs/common';
import { BrevoClient } from '@getbrevo/brevo';

import { NotificationPort } from '@/application/ports/notification.port';

@Injectable()
export class BrevoNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(BrevoNotificationAdapter.name);

  private readonly brevo: BrevoClient;
  private readonly senderEmail: string;
  private readonly senderName: string;

  constructor() {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME;

    if (!apiKey) {
      throw new Error('BREVO_API_KEY is not configured');
    }

    if (!senderEmail) {
      throw new Error('BREVO_SENDER_EMAIL is not configured');
    }

    if (!senderName) {
      throw new Error('BREVO_SENDER_NAME is not configured');
    }

    this.brevo = new BrevoClient({
      apiKey,
      timeoutInSeconds: 10,
      maxRetries: 2,
    });

    this.senderEmail = senderEmail;
    this.senderName = senderName;
  }

  async sendSms(phone: string, message: string): Promise<void> {
    this.logger.log(
      `[SMS] SMS provider not configured | ${phone} | ${message}`,
    );
  }

  async sendEmail(
    email: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const htmlContent = this.buildHtmlEmail(body);

    try {
      const response = await this.brevo.transactionalEmails.sendTransacEmail({
        sender: {
          email: this.senderEmail,
          name: this.senderName,
        },
        to: [
          {
            email,
          },
        ],
        subject,
        htmlContent,
        textContent: body,
      });

      this.logger.log(
        `Transactional email sent successfully to ${email}. Message ID: ${response.messageId}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown Brevo error';

      this.logger.error(
        `Failed to send transactional email to ${email}: ${errorMessage}`,
      );

      throw new Error('Failed to send email');
    }
  }

  private buildHtmlEmail(body: string): string {
    const escapedBody = this.escapeHtml(body);

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>JPL Medwin OTP</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f4f7f9;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div
            style="
              max-width: 520px;
              margin: 40px auto;
              padding: 0 20px;
            "
          >
            <div
              style="
                background-color: #ffffff;
                border-radius: 12px;
                padding: 32px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
              "
            >
              <div
                style="
                  text-align: center;
                  margin-bottom: 24px;
                "
              >
                <h1
                  style="
                    margin: 0;
                    font-size: 24px;
                    color: #0f766e;
                  "
                >
                  JPL Medwin
                </h1>
              </div>

              <h2
                style="
                  margin: 0 0 16px;
                  font-size: 20px;
                  color: #111827;
                  text-align: center;
                "
              >
                Your Verification Code
              </h2>

              <div
                style="
                  background-color: #f0fdfa;
                  border-radius: 10px;
                  padding: 20px;
                  margin: 24px 0;
                  text-align: center;
                "
              >
                <p
                  style="
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                    letter-spacing: 6px;
                    color: #0f766e;
                  "
                >
                  ${this.extractOtp(escapedBody)}
                </p>
              </div>

              <p
                style="
                  margin: 0 0 12px;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #4b5563;
                  text-align: center;
                "
              >
                ${this.buildReadableMessage(escapedBody)}
              </p>

              <p
                style="
                  margin: 24px 0 0;
                  font-size: 12px;
                  line-height: 1.5;
                  color: #9ca3af;
                  text-align: center;
                "
              >
                If you did not request this code, you can safely ignore this
                email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private extractOtp(message: string): string {
    const otpMatch = message.match(/\b\d{6}\b/);

    return otpMatch?.[0] ?? '------';
  }

  private buildReadableMessage(message: string): string {
    return message.replace(/\b\d{6}\b/, '').trim();
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}