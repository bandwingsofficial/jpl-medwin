// src/modules/payment/application/use-cases/handle-payment-success.use-case.ts

import { Injectable } from '@nestjs/common';
import { FinalizeSuccessfulPaymentUseCase } from './finalize-successful-payment.use-case';

@Injectable()
export class HandlePaymentSuccessUseCase {
  constructor(
    private readonly finalizeSuccessfulPaymentUseCase: FinalizeSuccessfulPaymentUseCase,
  ) {}

  async execute(input: {
    paymentId?: string;
    providerPaymentId?: string;
    providerOrderId?: string;
    providerSignature?: string;
    webhookEvent?: string;
    webhookPayload?: Record<string, any>;
  }) {
    return this.finalizeSuccessfulPaymentUseCase.execute(input);
  }
}

