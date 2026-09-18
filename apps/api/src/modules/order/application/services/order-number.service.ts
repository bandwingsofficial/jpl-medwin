// src/modules/order/application/services/order-number.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderNumberService {
  // =======================
  // 🔢 GENERATE ORDER NUMBER
  // Fixed:
  // JPL-WO-012926
  //
  // Changing:
  // 00001, 00002, 00003...
  // =======================

  generate(sequence: number): string {
    const sequentialNumber = String(sequence).padStart(5, '0');

    return `JPL-WO-012926-${sequentialNumber}`;
  }

  // =======================
  // 🔍 VALIDATE FORMAT
  // =======================

  isValid(orderNumber: string): boolean {
    const regex = /^JPL-WO-012926-\d{5}$/;

    return regex.test(orderNumber);
  }

  // =======================
  // 🔢 EXTRACT SEQUENCE
  // =======================

  extractSequence(orderNumber: string): number | null {
    if (!this.isValid(orderNumber)) {
      return null;
    }

    const parts = orderNumber.split('-');
    const sequencePart = parts[3];

    if (!sequencePart) {
      return null;
    }

    const sequence = Number(sequencePart);

    return Number.isNaN(sequence) ? null : sequence;
  }
}