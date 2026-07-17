import { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';

import { User } from '@/domain/entities/user.entity';
import { UserRole } from '@/domain/enums/user-role.enum';

export class UserMapper {
  // =======================
  // TO DOMAIN
  // =======================

  static toDomain(user: PrismaUser): User {
    return new User(
      user.id,
      user.name ?? undefined,
      user.profilePic ?? undefined,
      user.isActive,
      user.tokenVersion,

      // 🔥 ADD ROLE
      this.toDomainRole(user.role),

      user.createdAt,
      user.updatedAt,
      user.deletedAt ?? undefined,
    );
  }

  // =======================
  // TO PERSISTENCE
  // =======================

  static toPersistence(user: User) {
    return {
      name: user.name,
      profilePic: user.profilePic,
      isActive: user.isActive,
      tokenVersion: user.tokenVersion,

      // 🔥 ADD ROLE
      role: this.toPrismaRole(user.role),

      deletedAt: user.deletedAt ?? null,
    };
  }

  // =======================
  // ENUM: Prisma → Domain
  // =======================

  private static toDomainRole(role: PrismaUserRole): UserRole {
    switch (role) {
      case 'ADMIN':
        return UserRole.ADMIN;
      case 'USER':
      default:
        return UserRole.USER;
    }
  }

  // =======================
  // ENUM: Domain → Prisma
  // =======================

  private static toPrismaRole(role: UserRole): PrismaUserRole {
    switch (role) {
      case UserRole.ADMIN:
        return 'ADMIN';
      case UserRole.USER:
      default:
        return 'USER';
    }
  }
}
