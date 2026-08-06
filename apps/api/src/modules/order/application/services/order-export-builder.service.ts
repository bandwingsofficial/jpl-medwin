// src/modules/order/application/services/order-export-builder.service.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { OrderRepository } from '../../domain/repositories/order.repository';

import { OrderStatus } from '../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';

export interface OrderExportFilter {
  from?: Date;
  to?: Date;

  status?: OrderStatus;
  paymentStatus?: PaymentStatus;

  search?: string;
}

@Injectable()
export class OrderExportBuilderService {
  constructor(
    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,
  ) {}

  // =======================
  // 📦 EXPORT ALL ORDERS
  // =======================

  async build(): Promise<any[]> {
    return this.orderRepo.findManyForExport({
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });
  }

  // =======================
  // 📅 EXPORT FILTERED ORDERS
  // =======================

  async buildByFilter(
    filter: OrderExportFilter,
  ): Promise<any[]> {
    return this.orderRepo.findManyForExport({
      search: filter.search,

      from: filter.from,
      to: filter.to,

      status: filter.status,
      paymentStatus: filter.paymentStatus,

      sortBy: 'createdAt',
      sortOrder: 'asc',
    });
  }
}