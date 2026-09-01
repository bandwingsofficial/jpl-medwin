// src/modules/payment/presentation/controllers/payment.controller.ts

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { AuthRequest } from '@/modules/auth/types/auth-request.type';

import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

import { CreatePaymentUseCase } from '../../application/use-cases/create-payment.use-case';

import { VerifyPaymentUseCase } from '../../application/use-cases/verify-payment.use-case';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly verifyPaymentUseCase: VerifyPaymentUseCase,
  ) {}

  // =======================
  // 💳 CREATE PAYMENT
  // =======================

  @Post('create')
  async create(
    @Req() req: AuthRequest,

    @Body()
    body: {
      checkoutSessionId?: string;

      orderId?: string;

      provider: PaymentProvider;

      shippingAddressId?: string;

      billingAddressId?: string;

      isBillingSameAsShipping?: boolean;

      customerNote?: string;

      gstNumber?: string;
    },
  ) {
    const data = await this.createPaymentUseCase.execute({
      checkoutSessionId: body.checkoutSessionId,

      orderId: body.orderId,

      userId: req.user.userId,

      provider: body.provider,

      shippingAddressId: body.shippingAddressId,

      billingAddressId: body.billingAddressId,

      isBillingSameAsShipping: body.isBillingSameAsShipping,

      customerNote: body.customerNote,

      gstNumber: body.gstNumber,
    });

    return {
      message: 'Payment created successfully',

      ...data,
    };
  }

  // =======================
  // ✅ VERIFY PAYMENT
  // =======================

  @Post('verify')
  async verify(
    @Req() req: AuthRequest,

    @Body()
    body: {
      paymentId: string;

      providerPaymentId: string;

      providerSignature?: string;
    },
  ) {
    return this.verifyPaymentUseCase.execute({
      paymentId: body.paymentId,

      providerPaymentId: body.providerPaymentId,

      providerSignature: body.providerSignature,

      userId: req.user.userId,
    });
  }
}
