import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as crypto from 'crypto';

import { AuthIdentity } from '../entities/auth-identity.entity';
import { User } from '../entities/user.entity';

import { InvalidCredentialsException } from '../exceptions/admin/invalid-credentials.exception';
import { InvalidTotpException } from '../exceptions/admin/invalid-totp.exception';
import { ForbiddenRoleException } from '../exceptions/user/forbidden-role.exception';

import { UserRole } from '../enums/user-role.enum';

export class AuthDomainService {
  // =======================
  // 🔐 PASSWORD VERIFY
  // =======================

  async verifyPassword(identity: AuthIdentity, password: string): Promise<void> {
    identity.ensurePasswordExists();

    const isMatch = await bcrypt.compare(password, identity.passwordHash!);

    if (!isMatch) {
      throw new InvalidCredentialsException();
    }
  }

  // =======================
  // 🔐 TOTP VERIFY
  // =======================

  verifyTotp(identity: AuthIdentity, code: string): void {
    identity.ensureTotpEnabled();

    const verified = speakeasy.totp.verify({
      secret: identity.totpSecret!,
      encoding: 'base32',
      token: code,
      window: 1, // allows slight time drift
    });

    if (!verified) {
      throw new InvalidTotpException();
    }
  }

  // =======================
  // 🔐 ADMIN CHECK
  // =======================

  ensureAdmin(user: User): void {
    if (!user.isAdmin()) {
      throw new ForbiddenRoleException({
        requiredRoles: [UserRole.ADMIN],
        currentRole: user.role,
      });
    }
  }

  // =======================
  // 🔐 SECURE EMAIL OTP HELPERS
  // =======================

  generateSecureOtp(): string {
    return crypto.randomInt(100000, 1000000).toString();
  }

  hashOtp(code: string): string {
    return crypto.createHash('sha256').update(code.trim()).digest('hex');
  }

  verifyOtpHash(inputCode: string, storedHash: string): boolean {
    if (!storedHash || !inputCode) return false;
    const inputHash = this.hashOtp(inputCode);
    if (inputHash.length !== storedHash.length) return false;

    return crypto.timingSafeEqual(
      Buffer.from(inputHash, 'hex'),
      Buffer.from(storedHash, 'hex'),
    );
  }
}
