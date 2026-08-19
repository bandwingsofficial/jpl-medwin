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
    'http://sms.bandwings.in/api/sendmsg.php';

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
    // SMS disabled.
    // Do not print OTP or phone number.
    if (!this.enabled) {
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

    const formattedPhone = this.formatPhone(phone);

    const params = new URLSearchParams({
      user: this.username,
      pass: this.password,
      sender: this.sender,
      phone: formattedPhone,
      text: message,
      priority: this.priority,
      stype: this.stype,
    });

    const url = `${this.apiUrl}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
      });

      const result = (await response.text()).trim();

      if (!response.ok) {
        this.logger.error(
          `SMS gateway HTTP error: ${response.status}`,
        );

        throw new Error('SMS_GATEWAY_HTTP_ERROR');
      }

      /**
       * BandWings success responses:
       *
       * 123456
       * S.123456
       */
      const successRegex = /^(S\.)?\d+$/;

      if (!successRegex.test(result)) {
        this.logger.error(
          'SMS gateway rejected the message',
        );

        throw new Error('SMS_GATEWAY_REJECTED');
      }

      const messageId = result.startsWith('S.')
        ? result.substring(2)
        : result;

      this.logger.log(
        `OTP SMS submitted successfully. MessageId: ${messageId}`,
      );
    } catch (error) {
      if (
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      this.logger.error(
        'Failed to send OTP SMS',
        error instanceof Error
          ? error.message
          : String(error),
      );

      throw new InternalServerErrorException(
        'Failed to send OTP SMS',
      );
    }
  }

  private formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (
      cleaned.startsWith('91') &&
      cleaned.length === 12
    ) {
      return cleaned.substring(2);
    }

    return cleaned;
  }

  async sendEmail(
    email: string,
    subject: string,
    body: string,
  ): Promise<void> {
    // Email not configured.
  }
}