import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { StockNotificationService } from './stock-notification.service';
import { SubscribeStockNotificationDto } from './dto/subscribe-stock-notification.dto';

@Controller('stock-notifications')
export class StockNotificationController {
  constructor(
    private readonly stockNotificationService: StockNotificationService,
  ) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body() dto: SubscribeStockNotificationDto) {
    return this.stockNotificationService.subscribe(dto);
  }
}
