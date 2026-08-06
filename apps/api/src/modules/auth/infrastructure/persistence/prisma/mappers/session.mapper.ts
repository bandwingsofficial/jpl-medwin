import {
  Session as PrismaSession,
  Platform as PrismaPlatform,
  SessionType as PrismaSessionType,
} from '@prisma/client';

import { Session } from '@/domain/entities/session.entity';
import { Platform } from '@/domain/enums/platform.enum';
import { SessionType } from '@/domain/enums/session-type.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class SessionMapper {
  // =======================
  // TO DOMAIN
  // =======================

  static toDomain(session: PrismaSession): Session {
    return new Session(
      session.id,
      session.userId,
      session.deviceId,
      session.refreshTokenHash,
      session.expiresAt,
      session.isRevoked,
      session.revokedAt ?? undefined,
      session.replacedByToken ?? undefined,
      session.deviceName ?? undefined,
      this.toDomainPlatform(session.platform),
      this.toDomainSessionType(session.type), // 🔥 FIXED
      session.ipAddress ?? undefined,
      session.userAgent ?? undefined,
      session.lastUsedAt ?? undefined,
      session.createdAt,
      session.updatedAt,
    );
  }

  // =======================
  // TO PERSISTENCE
  // =======================

  static toPersistence(session: Session) {
    return {
      id: session.id, // ✅ OK if you generate UUID manually

      userId: session.userId,
      deviceId: session.deviceId,
      refreshTokenHash: session.refreshTokenHash,
      expiresAt: session.expiresAt,
      isRevoked: session.isRevoked,
      revokedAt: session.revokedAt ?? null,
      replacedByToken: session.replacedByToken ?? null,
      deviceName: session.deviceName,
      platform: this.toPrismaPlatform(session.platform),

      // 🔥 FIXED
      type: this.toPrismaSessionType(session.type),

      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      lastUsedAt: session.lastUsedAt ?? null,
    };
  }

  // =======================
  // ENUM: Prisma → Domain
  // =======================

  private static toDomainPlatform(platform?: PrismaPlatform | null): Platform | undefined {
    if (!platform) return undefined;

    switch (platform) {
      case 'WEB':
        return Platform.WEB;
      case 'ANDROID':
        return Platform.ANDROID;
      case 'IOS':
        return Platform.IOS;
      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown Platform',
          value: platform,
          direction: 'prisma_to_domain',
        });
    }
  }

  private static toDomainSessionType(type?: PrismaSessionType | null): SessionType | undefined {
    if (!type) return undefined;

    switch (type) {
      case 'USER':
        return SessionType.USER;
      case 'ADMIN':
        return SessionType.ADMIN;
      case 'API':
        return SessionType.API;
      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown SessionType',
          value: type,
          direction: 'prisma_to_domain',
        });
    }
  }

  // =======================
  // ENUM: Domain → Prisma
  // =======================

  private static toPrismaPlatform(platform?: Platform): PrismaPlatform | undefined {
    if (!platform) return undefined;

    switch (platform) {
      case Platform.WEB:
        return 'WEB';
      case Platform.ANDROID:
        return 'ANDROID';
      case Platform.IOS:
        return 'IOS';
      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown Platform',
          value: platform,
          direction: 'prisma_to_domain',
        });
    }
  }

  private static toPrismaSessionType(type?: SessionType): PrismaSessionType | undefined {
    if (!type) return undefined;

    switch (type) {
      case SessionType.USER:
        return 'USER';
      case SessionType.ADMIN:
        return 'ADMIN';
      case SessionType.API:
        return 'API';
      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown SessionType',
          value: type,
          direction: 'prisma_to_domain',
        });
    }
  }
}
