import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { BrevoClient } from '@getbrevo/brevo';

export interface SendEmailInput {
  to: {
    email: string;
    name?: string;
  }[];

  subject: string;

  htmlContent: string;

  textContent?: string;
}

@Injectable()
export class BrevoService {
  private readonly logger = new Logger(BrevoService.name);

  private readonly client: BrevoClient;

  private readonly senderEmail: string;

  private readonly senderName: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const apiKey =
      this.configService.get<string>(
        'BREVO_API_KEY_ORDER',
      );

    this.senderEmail =
      this.configService.get<string>(
        'BREVO_SENDER_EMAIL_ORDER',
      ) ?? '';

    this.senderName =
      this.configService.get<string>(
        'BREVO_SENDER_NAME_ORDER',
      ) ?? 'JPL Medwin ADMIN';

    if (!apiKey) {
      throw new Error(
        'BREVO_API_KEY is not configured',
      );
    }

    if (!this.senderEmail) {
      throw new Error(
        'BREVO_SENDER_EMAIL is not configured',
      );
    }

    this.client = new BrevoClient({
      apiKey,

      timeoutInSeconds: 10,

      maxRetries: 2,
    });
  }

  async sendEmail(
    input: SendEmailInput,
  ): Promise<string | undefined> {
    try {
      const response =
        await this.client.transactionalEmails.sendTransacEmail(
          {
            sender: {
              email: this.senderEmail,

              name: this.senderName,
            },

            to: input.to,

            subject: input.subject,

            htmlContent:
              input.htmlContent,

            ...(input.textContent
              ? {
                  textContent:
                    input.textContent,
                }
              : {}),
          },
        );

      this.logger.log(
        `Brevo email sent successfully. Message ID: ${response.messageId ?? 'N/A'}`,
      );

      return response.messageId;
    } catch (error) {
      this.logger.error(
        'Failed to send Brevo email',
        error instanceof Error
          ? error.stack
          : String(error),
      );

      throw new InternalServerErrorException(
        'Failed to send email',
      );
    }
  }
}