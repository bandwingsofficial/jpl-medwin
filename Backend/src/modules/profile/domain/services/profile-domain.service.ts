// src/modules/profile/domain/services/profile-domain.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileDomainService {
  // =======================
  // ✨ NORMALIZERS
  // =======================

  normalizeName(name: string): string {
    return name.trim();
  }

  normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  normalizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\s+/g, '').trim();
  }

  // =======================
  // 🔍 VALIDATIONS
  // =======================

  isValidEmail(email: string): boolean {
    const normalizedEmail = this.normalizeEmail(email);

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    const normalizedPhoneNumber =
      this.normalizePhoneNumber(phoneNumber);

    // Supports:
    // +919876543210
    // 9876543210
    return /^(\+?\d{10,15})$/.test(normalizedPhoneNumber);
  }
}