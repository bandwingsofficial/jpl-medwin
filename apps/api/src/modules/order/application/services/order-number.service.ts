// src/modules/order/application/services/order-number.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderNumberService {
  // =======================
  // 🔢 GENERATE
  // =======================

  generate(prefix = 'JPL-WEB', sequence = 1): string {
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
    // 🔢 SEQUENTIAL NUMBER
    // =======================

    const sequentialNumber = String(sequence).padStart(3, '0');

    // =======================
    // 🚀 RESULT
    // =======================

   return `JPL-${yyyy}${mm}${dd}-${hh}${min}${ss}-${sequentialNumber}`;
  }

  // =======================
  // 🔍 VALIDATE FORMAT
  // =======================

  isValid(orderNumber: string): boolean {
    const regex = /^JPL-\d{8}-\d{6}-\d{3,}$/;

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