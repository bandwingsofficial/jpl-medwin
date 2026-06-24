import { Injectable, Logger } from '@nestjs/common';
import { NotificationPort } from '@/application/ports/notification.port';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(ConsoleNotificationAdapter.name);

  async sendSms(phone: string, message: string): Promise<void> {
    this.logger.log(`[SMS] → ${phone}: ${message}`);
  }

  async sendEmail(email: string, subject: string, body: string): Promise<void> {
    this.logger.log(`[EMAIL] → ${email} | ${subject} | ${body}`);
  }
}
