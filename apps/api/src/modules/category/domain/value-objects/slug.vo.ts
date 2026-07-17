import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class SlugVO {
  private readonly value: string;

  constructor(input: string) {
    const normalized = this.generateSlug(input);

    // =======================
    // 🛡️ FALLBACK HANDLING
    // =======================

    // ❗ If completely invalid or empty → fallback
    if (!normalized) {
      this.value = this.generateFallback();
      return;
    }

    // ❗ If fails validation → trim/fix instead of throwing
    if (!this.isValid(normalized)) {
      this.value = this.safeFix(normalized);
      return;
    }

    this.value = normalized;
  }

  // =======================
  // 🔧 CORE
  // =======================

  private generateSlug(value: string): string {
    return value
      .normalize('NFKD') // handle unicode (é → e)
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // spaces → hyphen
      .replace(/-+/g, '-') // collapse multiple hyphens
      .replace(/^-+|-+$/g, ''); // trim hyphens
  }

  private isValid(value: string): boolean {
    return value.length >= 2 && value.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  }

  // =======================
  // 🧠 FALLBACKS
  // =======================

  private generateFallback(): string {
    return `item-${Date.now()}`;
  }

  private safeFix(value: string): string {
    // trim length safely
    let fixed = value.slice(0, 120);

    // ensure valid pattern
    fixed = fixed.replace(/^-+|-+$/g, '');

    // if still invalid → fallback
    if (!this.isValid(fixed)) {
      return this.generateFallback();
    }

    return fixed;
  }

  // =======================
  // 📦 ACCESS
  // =======================

  getValue(): string {
    return this.value;
  }

  equals(other?: SlugVO): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
