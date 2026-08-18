import { Injectable } from '@nestjs/common';

import { NotificationPort } from '@/application/ports/notification.port';

import { BandWingsSmsAdapter } from './sms.adapter';
import { BrevoNotificationAdapter } from './brevo-notification.adapter';

@Injectable()
export class NotificationAdapter
  implements NotificationPort
{
  constructor(
    private readonly smsAdapter: BandWingsSmsAdapter,
    private readonly emailAdapter: BrevoNotificationAdapter,
  ) {}

  async sendSms(
    phone: string,
    message: string,
  ): Promise<void> {
    await this.smsAdapter.sendSms(
      phone,
      message,
    );
  }

  async sendEmail(
    email: string,
    subject: string,
    body: string,
  ): Promise<void> {
    await this.emailAdapter.sendEmail(
      email,
      subject,
      body,
    );
  }
}