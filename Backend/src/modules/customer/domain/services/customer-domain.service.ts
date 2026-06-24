// src/modules/customer/domain/services/customer-domain.service.ts

import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerDomainService {
  // =======================
  // 💰 TOTAL SPENT
  // =======================

  calculateTotalSpent(
    orders: {
      grandTotal?:
        | Prisma.Decimal
        | number
        | string
        | null;
    }[] = [],
  ): number {
    console.log(
      '\n💰 [CUSTOMER TOTAL SPENT]',
    );

    console.log(
      '➡️ Orders count:',
      orders.length,
    );

    const total = orders.reduce(
      (sum, order) => {
        return (
          sum +
          Number(
            order.grandTotal ?? 0,
          )
        );
      },
      0,
    );

    console.log(
      '✅ Total spent:',
      total,
    );

    return total;
  }

  // =======================
  // 📦 TOTAL ORDERS
  // =======================

  calculateTotalOrders(
    orders: unknown[] = [],
  ): number {
    console.log(
      '\n📦 [CUSTOMER TOTAL ORDERS]',
    );

    console.log(
      '➡️ Orders count:',
      orders.length,
    );

    return orders.length;
  }

  // =======================
  // 🧠 ACTIVE CHECK
  // =======================

  ensureCustomerActive(params: {
    isActive: boolean;

    deletedAt?: Date | null;
  }): void {
    console.log(
      '\n🧠 [CUSTOMER ACTIVE CHECK]',
    );

    console.log(
      '➡️ isActive:',
      params.isActive,
    );

    console.log(
      '➡️ deletedAt:',
      params.deletedAt,
    );

    const isValid =
      params.isActive &&
      !params.deletedAt;

    console.log(
      '➡️ Active result:',
      isValid,
    );

    if (!isValid) {
      throw new Error(
        'Customer is inactive',
      );
    }

    console.log(
      '✅ CUSTOMER ACTIVE',
    );
  }

  // =======================
  // 📧 PRIMARY EMAIL
  // =======================

  getPrimaryEmail(
    identities: {
      type: string;

      value: string;

      isVerified: boolean;
    }[] = [],
  ): string | null {
    console.log(
      '\n📧 [PRIMARY EMAIL]',
    );

    const email = identities.find(
      (identity) =>
        identity.type === 'EMAIL' &&
        identity.isVerified,
    );

    console.log(
      '➡️ Found:',
      !!email,
    );

    return email?.value ?? null;
  }

  // =======================
  // 📱 PRIMARY PHONE
  // =======================

  getPrimaryPhone(
    identities: {
      type: string;

      value: string;

      isVerified: boolean;
    }[] = [],
  ): string | null {
    console.log(
      '\n📱 [PRIMARY PHONE]',
    );

    const phone = identities.find(
      (identity) =>
        identity.type === 'PHONE' &&
        identity.isVerified,
    );

    console.log(
      '➡️ Found:',
      !!phone,
    );

    return phone?.value ?? null;
  }
}