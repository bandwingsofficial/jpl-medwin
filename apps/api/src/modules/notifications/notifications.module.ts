import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './../../infrastructure/prisma/prisma.service';

import { BrevoService } from './brevo.service';

import { OrderNotificationService } from './order-notification.service';

@Module({
  imports: [
    ConfigModule,
  ],

  providers: [
    PrismaService,

    BrevoService,

    OrderNotificationService,
  ],

  exports: [
    BrevoService,

    OrderNotificationService,
  ],
})
export class NotificationsModule {}