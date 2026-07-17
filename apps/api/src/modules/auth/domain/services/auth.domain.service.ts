import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

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
    console.log('\n🔐 [PASSWORD CHECK]');
    console.log('➡️ Password provided:', !!password);
    console.log('➡️ Has stored hash:', !!identity.passwordHash);

    identity.ensurePasswordExists();

    const isMatch = await bcrypt.compare(password, identity.passwordHash!);

    console.log('➡️ Match result:', isMatch);

    if (!isMatch) {
      console.log('❌ PASSWORD MISMATCH');
      throw new InvalidCredentialsException();
    }

    console.log('✅ PASSWORD OK');
  }

  // =======================
  // 🔐 TOTP VERIFY
  // =======================

  verifyTotp(identity: AuthIdentity, code: string): void {
    console.log('\n🔐 [TOTP CHECK]');
    console.log('➡️ Code received:', code);
    console.log('➡️ TOTP enabled:', identity.isTotpEnabled);
    console.log('➡️ Has secret:', !!identity.totpSecret);

    identity.ensureTotpEnabled();

    const verified = speakeasy.totp.verify({
      secret: identity.totpSecret!,
      encoding: 'base32',
      token: code,
      window: 1, // allows slight time drift
    });

    console.log('➡️ TOTP result:', verified);

    if (!verified) {
      console.log('❌ TOTP FAILED');
      throw new InvalidTotpException(); // ✅ separate exception
    }

    console.log('✅ TOTP OK');
  }

  // =======================
  // 🔐 ADMIN CHECK
  // =======================

  ensureAdmin(user: User): void {
    console.log('\n🔐 [ROLE CHECK]');
    console.log('➡️ User role:', user.role);

    if (!user.isAdmin()) {
      console.log('❌ NOT ADMIN');
      throw new ForbiddenRoleException({
        requiredRoles: [UserRole.ADMIN],
        currentRole: user.role,
      });
    }

    console.log('✅ ADMIN OK');
  }
}
