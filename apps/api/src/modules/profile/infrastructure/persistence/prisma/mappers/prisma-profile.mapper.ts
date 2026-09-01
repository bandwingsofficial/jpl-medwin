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

      prismaProfile.salutation ?? undefined,
      prismaProfile.firstName ?? undefined,
      prismaProfile.lastName ?? undefined,
      prismaProfile.customerType ?? undefined,
      prismaProfile.clinicHospitalName ?? undefined,
      prismaProfile.whatsappNumber ?? undefined,
      prismaProfile.gstNumber ?? undefined,
    );
  }

  static toPersistence(profile: Profile) {
    return {
      id: profile.id,

      userId: profile.userId,

      salutation: profile.salutation,
      firstName: profile.firstName,
      lastName: profile.lastName,
      name: profile.name,
      email: profile.email,
      phoneNumber: profile.phoneNumber,

      customerType: profile.customerType,
      clinicHospitalName: profile.clinicHospitalName,
      whatsappNumber: profile.whatsappNumber,
      gstNumber: profile.gstNumber,

      avatarUrl: profile.avatarUrl,

      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,

      deletedAt: profile.deletedAt,
    };
  }
}
