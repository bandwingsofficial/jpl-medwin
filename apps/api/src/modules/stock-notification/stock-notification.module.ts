import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { StockNotificationController } from './stock-notification.controller';
import { StockNotificationService } from './stock-notification.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [StockNotificationController],
  providers: [StockNotificationService],
  exports: [StockNotificationService],
})
export class StockNotificationModule {}
