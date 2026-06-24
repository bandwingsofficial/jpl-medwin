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
      orderId: string;

      provider: PaymentProvider;
    },
  ) {
    const data = await this.createPaymentUseCase.execute({
      orderId: body.orderId,

      provider: body.provider,
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
    });
  }
}
