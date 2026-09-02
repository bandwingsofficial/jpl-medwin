import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './../../infrastructure/prisma/prisma.service';

import { BrevoService } from './brevo.service';

import { OrderNotificationService } from './order-notification.service';

import { CustomerOrderNotificationService } from './customer-order-notification.service';

import { OrderDetailsPdfService } from './order-details-pdf.service';

@Module({
  imports: [
    ConfigModule,
  ],

  providers: [
    PrismaService,

    BrevoService,

    OrderDetailsPdfService,

    OrderNotificationService,

    CustomerOrderNotificationService,
  ],

  exports: [
    BrevoService,

    OrderDetailsPdfService,

    OrderNotificationService,

    CustomerOrderNotificationService,
  ],
})
export class NotificationsModule {}