// src/modules/profile/infrastructure/persistence/prisma/mappers/prisma-profile.mapper.ts

import { Profile as PrismaProfile } from '@prisma/client';

import { Profile } from '@/modules/profile/domain/entities/profile.entity';

export class PrismaProfileMapper {
  static toDomain(prismaProfile: PrismaProfile): Profile {
    return new Profile(
      prismaProfile.id,

      prismaProfile.userId,

      prismaProfile.name ?? undefined,
      prismaProfile.email ?? undefined,
      prismaProfile.phoneNumber ?? undefined,

      prismaProfile.avatarUrl ?? undefined,

      prismaProfile.createdAt,
      prismaProfile.updatedAt,

      prismaProfile.deletedAt ?? undefined,
    );
  }

  static toPersistence(profile: Profile) {
    return {
      id: profile.id,

      userId: profile.userId,

      name: profile.name,
      email: profile.email,
      phoneNumber: profile.phoneNumber,

      avatarUrl: profile.avatarUrl,

      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,

      deletedAt: profile.deletedAt,
    };
  }
}
