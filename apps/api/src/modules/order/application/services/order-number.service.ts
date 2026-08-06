// src/modules/order/application/services/order-number.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderNumberService {
  // =======================
  // 🔢 GENERATE
  // =======================

  generate(prefix = 'ORD'): string {
    const now = new Date();

    // =======================
    // 📅 DATE
    // =======================

    const yyyy = now.getFullYear();

    const mm = String(now.getMonth() + 1).padStart(2, '0');

    const dd = String(now.getDate()).padStart(2, '0');

    // =======================
    // ⏰ TIME
    // =======================

    const hh = String(now.getHours()).padStart(2, '0');

    const min = String(now.getMinutes()).padStart(2, '0');

    const ss = String(now.getSeconds()).padStart(2, '0');

    // =======================
    // 🎲 RANDOM
    // =======================

    const random = Math.floor(100000 + Math.random() * 900000);

    // =======================
    // 🚀 RESULT
    // =======================

    return `${prefix}-${yyyy}${mm}${dd}-${hh}${min}${ss}-${random}`;
  }

  // =======================
  // 🔍 VALIDATE FORMAT
  // =======================

  isValid(orderNumber: string): boolean {
    const regex = /^ORD-\d{8}-\d{6}-\d{6}$/;

    return regex.test(orderNumber);
  }

  // =======================
  // 📅 EXTRACT DATE
  // =======================

  extractDate(orderNumber: string): string | null {
    const parts = orderNumber.split('-');

    if (parts.length < 3) {
      return null;
    }

    return parts[1];
  }
}
