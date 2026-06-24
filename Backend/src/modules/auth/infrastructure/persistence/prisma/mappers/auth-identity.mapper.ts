import { AuthIdentity as PrismaAuthIdentity, AuthMethod as PrismaAuthMethod } from '@prisma/client';

import { AuthIdentity } from '@/domain/entities/auth-identity.entity';
import { AuthMethod } from '@/domain/enums/auth-method.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class AuthIdentityMapper {
  // =======================
  // TO DOMAIN
  // =======================

  static toDomain(identity: PrismaAuthIdentity): AuthIdentity {
    return new AuthIdentity(
      identity.id,
      identity.userId,
      this.toDomainMethod(identity.type),
      identity.value,
      identity.isVerified,

      // 🔥 NEW FIELDS
      identity.passwordHash ?? undefined,
      identity.totpSecret ?? undefined,
      identity.isTotpEnabled ?? false,

      identity.createdAt,
      identity.updatedAt,
      identity.deletedAt ?? undefined,
    );
  }

  // =======================
  // TO PERSISTENCE
  // =======================

  static toPersistence(identity: AuthIdentity) {
    return {
      userId: identity.userId,
      type: this.toPrismaMethod(identity.type),
      value: identity.value,
      isVerified: identity.isVerified,

      // 🔥 NEW FIELDS
      passwordHash: identity.passwordHash,
      totpSecret: identity.totpSecret,
      isTotpEnabled: identity.isTotpEnabled,

      deletedAt: identity.deletedAt ?? null,
    };
  }

  // =======================
  // ENUM: Prisma → Domain
  // =======================

  private static toDomainMethod(method: PrismaAuthMethod): AuthMethod {
    switch (method) {
      case 'PHONE':
        return AuthMethod.PHONE;
      case 'EMAIL':
        return AuthMethod.EMAIL;
      case 'GOOGLE':
        return AuthMethod.GOOGLE;
      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown AuthMethod', value: method, direction: 'prisma_to_domain' });
    }
  }

  // =======================
  // ENUM: Domain → Prisma
  // =======================

  private static toPrismaMethod(method: AuthMethod): PrismaAuthMethod {
    switch (method) {
      case AuthMethod.PHONE:
        return 'PHONE';
      case AuthMethod.EMAIL:
        return 'EMAIL';
      case AuthMethod.GOOGLE:
        return 'GOOGLE';
      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown AuthMethod', value: method, direction: 'prisma_to_domain' });
    }
  }
}
