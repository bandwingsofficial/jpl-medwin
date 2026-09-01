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

  normalizeWhatsappNumber(whatsappNumber: string): string {
    return whatsappNumber.replace(/\s+/g, '').trim();
  }

  normalizeGstin(gstin: string): string {
    return gstin.replace(/\s+/g, '').trim().toUpperCase();
  }

  // =======================
  // 🔍 VALIDATIONS
  // =======================

  isValidEmail(email: string): boolean {
    const normalizedEmail = this.normalizeEmail(email);

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    const normalizedPhoneNumber = this.normalizePhoneNumber(phoneNumber);

    // Supports:
    // +919876543210
    // 9876543210
    return /^(\+?\d{10,15})$/.test(normalizedPhoneNumber);
  }

  isValidWhatsappNumber(whatsappNumber: string): boolean {
    const normalizedWhatsapp = this.normalizeWhatsappNumber(whatsappNumber);
    if (!normalizedWhatsapp) return true;

    return /^(\+?\d{10,15})$/.test(normalizedWhatsapp);
  }

  isValidGstin(gstin: string): boolean {
    const normalizedGstin = this.normalizeGstin(gstin);
    if (!normalizedGstin) return true;

    // Indian GSTIN regex: 15 alphanumeric characters
    // 2 digits state code + 5 chars PAN + 4 digits + 1 char + 1 char (1-9/A-Z) + 'Z' + 1 check char
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(normalizedGstin);
  }
}
