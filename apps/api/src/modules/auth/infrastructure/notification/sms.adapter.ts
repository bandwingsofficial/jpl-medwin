import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { NotificationPort } from '@/application/ports/notification.port';

@Injectable()
export class BandWingsSmsAdapter implements NotificationPort {
  private readonly logger = new Logger(
    BandWingsSmsAdapter.name,
  );

  private readonly apiUrl =
    process.env.SMS_API_URL ??
    'https://sms.bandwings.in/api/sendmsg.php';

  private readonly username =
    process.env.SMS_USERNAME ?? '';

  private readonly password =
    process.env.SMS_PASSWORD ?? '';

  private readonly sender =
    process.env.SMS_SENDER ?? 'JPLMRK';

  private readonly priority =
    process.env.SMS_PRIORITY ?? 'ndnd';

  private readonly stype =
    process.env.SMS_STYPE ?? 'normal';

  private readonly enabled =
    process.env.SMS_ENABLED === 'true';

  async sendSms(
    phone: string,
    message: string,
  ): Promise<void> {
    if (!this.enabled) {
      this.logger.warn(
        `SMS is disabled. OTP SMS not sent to ${phone}`,
      );

      return;
    }

    if (!this.username || !this.password) {
      this.logger.error(
        'SMS credentials are not configured',
      );

      throw new InternalServerErrorException(
        'SMS service is not configured',
      );
    }

    const params = new URLSearchParams({
      user: this.username,
      pass: this.password,
      sender: this.sender,
      phone,
      text: message,
      priority: this.priority,
      stype: this.stype,
    });

    const url = `${this.apiUrl}?${params.toString()}`;

    try {
      this.logger.log(
        `Sending OTP SMS to ${phone}`,
      );

      const response = await fetch(url, {
        method: 'GET',
      });

      const responseText =
        await response.text();

      if (!response.ok) {
        this.logger.error(
          `SMS gateway failed: HTTP ${response.status}`,
        );

        this.logger.error(
          `SMS gateway response: ${responseText}`,
        );

        throw new InternalServerErrorException(
          'Failed to send OTP SMS',
        );
      }

      this.logger.log(
        `OTP SMS gateway response: ${responseText}`,
      );
    } catch (error) {
      if (
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      this.logger.error(
        'SMS gateway request failed',
        error instanceof Error
          ? error.stack
          : String(error),
      );

      throw new InternalServerErrorException(
        'Failed to send OTP SMS',
      );
    }
  }

  async sendEmail(
    email: string,
    subject: string,
    body: string,
  ): Promise<void> {
    this.logger.warn(
      `Email notification is not configured for ${email}`,
    );
  }
}