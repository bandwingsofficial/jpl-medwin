import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { AuthIdentity } from '@/domain/entities/auth-identity.entity';
import { AuthIdentityRepository } from '@/domain/repositories/auth-identity.repository';
import { AuthMethod } from '@/domain/enums/auth-method.enum';

import { AuthIdentityMapper } from '@/infrastructure/persistence/prisma/mappers/auth-identity.mapper';

@Injectable()
export class PrismaAuthIdentityRepository implements AuthIdentityRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // BASIC
  // =======================

  async findById(id: string): Promise<AuthIdentity | null> {
    const identity = await this.prisma.authIdentity.findUnique({
      where: { id },
    });

    return identity ? AuthIdentityMapper.toDomain(identity) : null;
  }

  async findByUserId(userId: string): Promise<AuthIdentity[]> {
    const identities = await this.prisma.authIdentity.findMany({
      where: { userId },
    });

    return identities.map(AuthIdentityMapper.toDomain);
  }

  async create(identity: AuthIdentity): Promise<AuthIdentity> {
    const created = await this.prisma.authIdentity.create({
      data: AuthIdentityMapper.toPersistence(identity),
    });

    return AuthIdentityMapper.toDomain(created);
  }

  async update(identity: AuthIdentity): Promise<AuthIdentity> {
    const updated = await this.prisma.authIdentity.update({
      where: { id: identity.id },
      data: AuthIdentityMapper.toPersistence(identity),
    });

    return AuthIdentityMapper.toDomain(updated);
  }

  // =======================
  // 🔐 LOOKUPS
  // =======================

  async findByTypeAndValue(type: AuthMethod, value: string): Promise<AuthIdentity | null> {
    const normalized = this.normalize(type, value);

    const identity = await this.prisma.authIdentity.findFirst({
      where: {
        type,
        value: normalized,
      },
    });

    return identity ? AuthIdentityMapper.toDomain(identity) : null;
  }

  async findActiveByTypeAndValue(type: AuthMethod, value: string): Promise<AuthIdentity | null> {
    const normalized = this.normalize(type, value);

    const identity = await this.prisma.authIdentity.findFirst({
      where: {
        type,
        value: normalized,
        deletedAt: null, // 🔥 CRITICAL
      },
    });

    return identity ? AuthIdentityMapper.toDomain(identity) : null;
  }

  // =======================
  // 🔥 ADMIN LOGIN
  // =======================

  async findByEmail(email: string): Promise<AuthIdentity | null> {
    // reuse logic (clean)
    return this.findActiveByTypeAndValue(AuthMethod.EMAIL, email);
  }

  // =======================
  // 🔐 FILTERED
  // =======================

  async findActiveByUserId(userId: string): Promise<AuthIdentity[]> {
    const identities = await this.prisma.authIdentity.findMany({
      where: {
        userId,
        deletedAt: null, // 🔥 CRITICAL
      },
    });

    return identities.map(AuthIdentityMapper.toDomain);
  }

  // =======================
  // 🔧 NORMALIZATION
  // =======================

  private normalize(type: AuthMethod, value: string): string {
    if (type === AuthMethod.EMAIL) {
      return value.toLowerCase().trim();
    }

    return value.trim();
  }
}
