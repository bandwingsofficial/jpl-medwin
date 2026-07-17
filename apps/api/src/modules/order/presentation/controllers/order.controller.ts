// src/modules/order/presentation/controllers/order.controller.ts

import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { AuthRequest } from '@/modules/auth/types/auth-request.type';

import { CreateOrderFromCheckoutUseCase } from '../../application/use-cases/create-order-from-checkout.use-case';

import { GetOrderUseCase } from '../../application/use-cases/get-order.use-case';

import { GetMyOrdersUseCase } from '../../application/use-cases/get-my-orders.use-case';

import { CancelOrderUseCase } from '../../application/use-cases/cancel-order.use-case';

import { CreateOrderDto } from '../dto/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly createOrderFromCheckoutUseCase: CreateOrderFromCheckoutUseCase,

    private readonly getOrderUseCase: GetOrderUseCase,

    private readonly getMyOrdersUseCase: GetMyOrdersUseCase,

    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  // =======================
  // 🧾 CREATE ORDER
  // =======================

  @Post()
  async create(
    @Req() req: AuthRequest,

    @Body()
    body: CreateOrderDto,
  ) {
    const data = await this.createOrderFromCheckoutUseCase.execute({
      ...body,

      userId: req.user.userId,
    });

    return {
      message: 'Order created successfully',

      ...data,
    };
  }

  // =======================
  // 🔍 GET ORDER
  // =======================

  @Get(':orderId')
  async getOrder(
    @Req() req: AuthRequest,

    @Param('orderId')
    orderId: string,
  ) {
    const data = await this.getOrderUseCase.execute({
      orderId,

      userId: req.user.userId,
    });

    return {
      message: 'Order fetched successfully',

      ...data,
    };
  }

  // =======================
  // 📦 GET MY ORDERS
  // =======================

  @Get()
  async getMyOrders(@Req() req: AuthRequest) {
    const data = await this.getMyOrdersUseCase.execute({
      userId: req.user.userId,
    });

    return {
      message: 'Orders fetched successfully',

      ...data,
    };
  }

  // =======================
  // ❌ CANCEL ORDER
  // =======================

  @Post(':orderId/cancel')
  async cancel(
    @Req() req: AuthRequest,

    @Param('orderId')
    orderId: string,

    @Body()
    body: {
      reason?: string;
    },
  ) {
    const data = await this.cancelOrderUseCase.execute({
      orderId,

      userId: req.user.userId,

      reason: body.reason,
    });

    return {
      message: 'Order cancelled successfully',

      ...data,
    };
  }
}
