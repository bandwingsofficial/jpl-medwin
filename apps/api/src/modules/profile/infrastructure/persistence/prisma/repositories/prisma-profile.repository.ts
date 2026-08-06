// src/modules/profile/infrastructure/persistence/prisma/repositories/prisma-profile.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { ProfileRepository } from '@/modules/profile/domain/repositories/profile.repository';

import { Profile } from '@/modules/profile/domain/entities/profile.entity';

import { PrismaProfileMapper } from '../mappers/prisma-profile.mapper';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // ✨ CREATE
  // =======================

  async create(profile: Profile): Promise<Profile> {
    const createdProfile = await this.prisma.profile.create({
      data: PrismaProfileMapper.toPersistence(profile),
    });

    return PrismaProfileMapper.toDomain(createdProfile);
  }

  // =======================
  // 💾 SAVE
  // =======================

  async save(profile: Profile): Promise<Profile> {
    const updatedProfile = await this.prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: PrismaProfileMapper.toPersistence(profile),
    });

    return PrismaProfileMapper.toDomain(updatedProfile);
  }

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!profile) {
      return null;
    }

    return PrismaProfileMapper.toDomain(profile);
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
    });

    if (!profile) {
      return null;
    }

    return PrismaProfileMapper.toDomain(profile);
  }

  async findByEmail(email: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!profile) {
      return null;
    }

    return PrismaProfileMapper.toDomain(profile);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findFirst({
      where: {
        phoneNumber,
        deletedAt: null,
      },
    });

    if (!profile) {
      return null;
    }

    return PrismaProfileMapper.toDomain(profile);
  }

  // =======================
  // 🗑️ DELETE
  // =======================

  async softDelete(id: string): Promise<void> {
    await this.prisma.profile.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
