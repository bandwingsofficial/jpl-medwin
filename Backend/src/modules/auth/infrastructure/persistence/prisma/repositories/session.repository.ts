import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { SessionRepository } from '@/domain/repositories/session.repository';
import { Session } from '@/domain/entities/session.entity';

import { SessionMapper } from '@/infrastructure/persistence/prisma/mappers/session.mapper';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // CREATE
  // =======================

  async create(session: Session): Promise<Session> {
    const created = await this.prisma.session.create({
      data: SessionMapper.toPersistence(session),
    });

    return SessionMapper.toDomain(created);
  }

  // =======================
  // UPDATE
  // =======================

  async update(session: Session): Promise<Session> {
    const updated = await this.prisma.session.update({
      where: { id: session.id },
      data: {
        isRevoked: session.isRevoked,
        revokedAt: session.revokedAt ?? null,
        lastUsedAt: session.lastUsedAt ?? null,
        replacedByToken: session.replacedByToken ?? null,
        refreshTokenHash: session.refreshTokenHash,
      },
    });

    return SessionMapper.toDomain(updated);
  }

  // =======================
  // FIND
  // =======================

  async findById(id: string): Promise<Session | null> {
    const data = await this.prisma.session.findUnique({
      where: { id },
    });

    return data ? SessionMapper.toDomain(data) : null;
  }

  async findByRefreshTokenHash(hash: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { refreshTokenHash: hash },
    });

    return session ? SessionMapper.toDomain(session) : null;
  }

  async findByUserId(userId: string): Promise<Session[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
    });

    return sessions.map(SessionMapper.toDomain);
  }

  // 🔥 ACTIVE ONLY
  async findActiveByUserId(userId: string): Promise<Session[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sessions.map(SessionMapper.toDomain);
  }

  // 🔥 LATEST SESSION PER DEVICE
  async findLatestByUserIdAndDeviceId(userId: string, deviceId: string): Promise<Session | null> {
    const session = await this.prisma.session.findFirst({
      where: {
        userId,
        deviceId,
      },
      orderBy: {
        createdAt: 'desc', // 🔥 important
      },
    });

    return session ? SessionMapper.toDomain(session) : null;
  }

  // =======================
  // DELETE / REPLACE
  // =======================

  async deleteByUserIdAndDeviceId(userId: string, deviceId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        userId,
        deviceId,
      },
    });
  }

  // =======================
  // REVOKE
  // =======================

  async revoke(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        userId,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  // 🔥 SECURITY: REVOKE ALL EXCEPT CURRENT
  async revokeAllExcept(userId: string, sessionId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        userId,
        id: {
          not: sessionId,
        },
        isRevoked: false,
      },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }
}
