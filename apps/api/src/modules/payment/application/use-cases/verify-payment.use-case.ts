// src/modules/payment/application/use-cases/verify-payment.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TOKENS } from '@/common/constants/tokens';

import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentDomainService } from '../../domain/services/payment-domain.service';
import { PaymentNotFoundException } from '../../domain/exceptions/payment-not-found.exception';
import { PaymentFailedException } from '../../domain/exceptions/payment-failed.exception';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { RazorpayService } from '../services/razorpay.service';
import { FinalizeSuccessfulPaymentUseCase } from './finalize-successful-payment.use-case';

@Injectable()
export class VerifyPaymentUseCase {
  constructor(
    @Inject(TOKENS.PAYMENT_REPO)
    private readonly paymentRepo: PaymentRepository,

    private readonly paymentDomainService: PaymentDomainService,

    private readonly razorpayService: RazorpayService,

    private readonly configService: ConfigService,

    private readonly finalizeSuccessfulPaymentUseCase: FinalizeSuccessfulPaymentUseCase,
  ) {}

  async execute(input: {
    paymentId: string;
    providerPaymentId: string;
    providerSignature?: string;
    userId?: string;
  }) {
    // =======================
    // 🔍 FIND PAYMENT
    // =======================

    const payment = await this.paymentRepo.findById(input.paymentId);

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!payment) {
      throw new PaymentNotFoundException({
        paymentId: input.paymentId,
      });
    }

    // =======================
    // 🔄 IDEMPOTENCY CHECK
    // =======================
    if (payment.status === PaymentStatus.SUCCESS && payment.orderId) {
      return this.finalizeSuccessfulPaymentUseCase.execute({
        paymentId: payment.id,
        providerPaymentId: input.providerPaymentId,
        providerSignature: input.providerSignature,
        userId: input.userId,
      });
    }

    // =======================
    // 🛡 VALIDATE
    // =======================

    this.paymentDomainService.ensurePaymentUsable(payment);

    // =======================
    // 🔐 VERIFY SIGNATURE
    // =======================

    let verified = false;

    // =======================
    // 🟦 RAZORPAY
    // =======================

    if (payment.provider === PaymentProvider.RAZORPAY) {
      const secret =
        this.configService.get<string>('RAZORPAY_KEY_SECRET') ||
        process.env.RAZORPAY_KEY_SECRET ||
        '';

      if (!secret) {
        throw new PaymentFailedException({
          paymentId: payment.id,
          provider: payment.provider,
          reason: 'Razorpay secret key is not configured on the server',
        });
      }

      verified = this.razorpayService.verifySignature({
        orderId: payment.providerOrderId ?? '',
        paymentId: input.providerPaymentId,
        signature: input.providerSignature ?? '',
        secret,
      });
    }

    // =======================
    // 🟪 STRIPE
    // =======================
    else if (payment.provider === PaymentProvider.STRIPE) {
      verified = true;
    }

    // =======================
    // ❌ INVALID SIGNATURE
    // =======================

    if (!verified) {
      payment.fail({
        code: 'INVALID_SIGNATURE',
        reason: 'Payment signature verification failed',
      });

      await this.paymentRepo.update(payment);

      throw new PaymentFailedException({
        paymentId: payment.id,
        provider: payment.provider,
        reason: 'Invalid payment signature',
      });
    }

    // =======================
    // ✅ FINALIZE PAYMENT & CREATE ORDER (IDEMPOTENT)
    // =======================

    return this.finalizeSuccessfulPaymentUseCase.execute({
      paymentId: payment.id,
      providerPaymentId: input.providerPaymentId,
      providerSignature: input.providerSignature,
      userId: input.userId,
    });
  }
}

