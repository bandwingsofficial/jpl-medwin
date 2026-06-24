import { AuthMethod } from '../enums/auth-method.enum';

import { IdentityNotVerifiedException } from '../exceptions/auth/identity-not-verified.exception';
import { IdentityInactiveException } from '../exceptions/auth/identity-inactive.exception';
import { IdentityPasswordMissingException } from '../exceptions/auth/identity-password-missing.exception';
import { IdentityTotpNotEnabledException } from '../exceptions/auth/identity-totp-not-enabled.exception';

export class AuthIdentity {
  constructor(
    public readonly id: string,

    public userId: string,

    public type: AuthMethod,
    public value: string,

    public isVerified: boolean = false,

    // 🔥 ADMIN
    public passwordHash?: string,
    public totpSecret?: string,
    public isTotpEnabled: boolean = false,

    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt?: Date,
  ) {
    // 🔥 normalize at creation
    this.value = this.normalizeValue(value);
  }

  // =======================
  // 🧠 STATE
  // =======================

  isActive(): boolean {
    return !this.deletedAt;
  }

  isEmail(): boolean {
    return this.type === AuthMethod.EMAIL;
  }

  isPhone(): boolean {
    return this.type === AuthMethod.PHONE;
  }

  // =======================
  // 🔐 BUSINESS RULES
  // =======================

  verify() {
    this.isVerified = true;
  }

  unverify() {
    this.isVerified = false;
  }

  softDelete() {
    this.deletedAt = new Date();
  }

  // =======================
  // 🔐 PASSWORD
  // =======================

  hasPassword(): boolean {
    return !!this.passwordHash;
  }

  setPassword(hash: string) {
    this.passwordHash = hash;
  }

  clearPassword() {
    this.passwordHash = undefined;
  }

  // =======================
  // 🔐 TOTP
  // =======================

  enableTotp(secret: string) {
    if (this.isTotpEnabled) return; // prevent overwrite silently

    this.totpSecret = secret;
    this.isTotpEnabled = true;
  }

  disableTotp() {
    this.totpSecret = undefined;
    this.isTotpEnabled = false;
  }

  // =======================
  // 🔐 GUARDS
  // =======================

  ensureVerified() {
    if (!this.isVerified) {
      throw new IdentityNotVerifiedException({
        type: this.type,
        value: this.value,
      });
    }
  }

  ensureActive() {
    if (this.deletedAt) {
      throw new IdentityInactiveException({
        type: this.type,
        value: this.value,
      });
    }
  }

  ensurePasswordExists() {
    if (!this.passwordHash) {
      throw new IdentityPasswordMissingException({
        type: this.type,
        value: this.value,
      });
    }
  }

  ensureTotpEnabled() {
    if (!this.isTotpEnabled || !this.totpSecret) {
      throw new IdentityTotpNotEnabledException({
        type: this.type,
        value: this.value,
      });
    }
  }

  // =======================
  // 🔄 UTILITY
  // =======================

  matches(type: AuthMethod, value: string): boolean {
    return this.type === type && this.value === this.normalizeValue(value);
  }

  private normalizeValue(value: string): string {
    if (this.type === AuthMethod.EMAIL) {
      return value.toLowerCase().trim();
    }

    return value.trim(); // phone normalization handled in VO ideally
  }
}
