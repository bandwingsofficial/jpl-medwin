// src/modules/order/presentation/controllers/admin-order.controller.ts

import { Body, Controller, Param, Post, UseGuards, Get, Query ,Res} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';

import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';
import { OrderStatus } from '../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';

import { GetOrdersUseCase } from '../../application/use-cases/get-admin-order.use-case';
import { ExportOrdersUseCase } from '../../application/use-cases/export-orders.use-case';
import { GetOrderByIdUseCase } from '../../application/use-cases/get-admin-order-by-id.use-case';

import { MarkOrderPaidUseCase } from '../../application/use-cases/mark-order-paid.use-case';

import { ConfirmOrderUseCase } from '../../application/use-cases/confirm-order.use-case';

import { ProcessOrderUseCase } from '../../application/use-cases/process-order.use-case';

import { ShipOrderUseCase } from '../../application/use-cases/ship-order.use-case';

import { DeliverOrderUseCase } from '../../application/use-cases/deliver-order.use-case';

import { RefundOrderUseCase } from '../../application/use-cases/refund-order.use-case';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminOrderController {
  constructor(
    private readonly markOrderPaidUseCase: MarkOrderPaidUseCase,

    private readonly confirmOrderUseCase: ConfirmOrderUseCase,

    private readonly processOrderUseCase: ProcessOrderUseCase,

    private readonly shipOrderUseCase: ShipOrderUseCase,

    private readonly deliverOrderUseCase: DeliverOrderUseCase,

    private readonly refundOrderUseCase: RefundOrderUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly exportOrdersUseCase: ExportOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
  ) {}

   // =======================
// 📁 EXPORT ORDERS
// =======================

@Get('export')
async exportOrders(
  @Query()
  query: {
    from?: string;

    to?: string;

    status?: OrderStatus;

    paymentStatus?: PaymentStatus;

    search?: string;
  },

  @Res()
  res: Response,
) {
  const result = await this.exportOrdersUseCase.execute({
    from: query.from ? new Date(query.from) : undefined,

    to: query.to ? new Date(query.to) : undefined,

    status: query.status,

    paymentStatus: query.paymentStatus,

    search: query.search,
  });

  res.setHeader(
    'Content-Type',
    result.file.mimeType,
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${result.file.name}"`,
  );

  return res.end(result.buffer);
}


  //============================
  // GET ORDERS
  //==========================
  @Get()
  async getOrders(@Query() query: any) {
    const data = await this.getOrdersUseCase.execute(query);

    return {
      message: 'Orders fetched successfully',

      ...data,
    };
  }

  @Get(':orderId')
  async getOrder(
    @Param('orderId')
    orderId: string,
  ) {
    const data = await this.getOrderByIdUseCase.execute({
      orderId,
    });

    return {
      message: 'Order fetched successfully',

      ...data,
    };
  }

 
  // =======================
  // 💳 MARK ORDER PAID
  // =======================

  @Post(':orderId/paid')
  async markPaid(
    @Param('orderId')
    orderId: string,
  ) {
    const data = await this.markOrderPaidUseCase.execute({
      orderId,
    });

    return {
      message: 'Order marked as paid successfully',

      ...data,
    };
  }

  // =======================
  // ✅ CONFIRM ORDER
  // =======================

  @Post(':orderId/confirm')
  async confirm(
    @Param('orderId')
    orderId: string,
  ) {
    const data = await this.confirmOrderUseCase.execute({
      orderId,
    });

    return {
      message: 'Order confirmed successfully',

      ...data,
    };
  }

  // =======================
  // ⚙️ PROCESS ORDER
  // =======================

  @Post(':orderId/process')
  async process(
    @Param('orderId')
    orderId: string,
  ) {
    const data = await this.processOrderUseCase.execute({
      orderId,
    });

    return {
      message: 'Order moved to processing successfully',

      ...data,
    };
  }

  // =======================
  // 🚚 SHIP ORDER
  // =======================

  @Post(':orderId/ship')
  async ship(
    @Param('orderId')
    orderId: string,

    @Body()
    body: {
      trackingId?: string;

      courierName?: string;
    },
  ) {
    const data = await this.shipOrderUseCase.execute({
      orderId,

      trackingId: body.trackingId,

      courierName: body.courierName,
    });

    return {
      message: 'Order shipped successfully',

      ...data,
    };
  }

  // =======================
  // 📦 DELIVER ORDER
  // =======================

  @Post(':orderId/deliver')
  async deliver(
    @Param('orderId')
    orderId: string,
  ) {
    const data = await this.deliverOrderUseCase.execute({
      orderId,
    });

    return {
      message: 'Order delivered successfully',

      ...data,
    };
  }

  // =======================
  // 💸 REFUND ORDER
  // =======================

  @Post(':orderId/refund')
  async refund(
    @Param('orderId')
    orderId: string,

    @Body()
    body: {
      reason?: string;

      refundReferenceId?: string;
    },
  ) {
    const data = await this.refundOrderUseCase.execute({
      orderId,

      reason: body.reason,

      refundReferenceId: body.refundReferenceId,
    });

    return {
      message: 'Order refunded successfully',

      ...data,
    };
  }
}
