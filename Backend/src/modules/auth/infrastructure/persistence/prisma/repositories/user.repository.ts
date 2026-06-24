import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { UserRepository } from '@/domain/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';

import { UserMapper } from '@/infrastructure/persistence/prisma/mappers/user.mapper';
import { UserRole } from '@/domain/enums/user-role.enum';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // FIND BY ID
  // =======================

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  // =======================
  // CREATE
  // =======================

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    });

    return UserMapper.toDomain(created);
  }

  // =======================
  // UPDATE
  // =======================

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: UserMapper.toPersistence(user),
    });

    return UserMapper.toDomain(updated);
  }

  // =======================
  // 🔥 FIND BY ROLE
  // =======================

  async findByRole(role: UserRole): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { role },
    });

    return users.map(UserMapper.toDomain);
  }

  // =======================
  // 🔥 UPDATE ROLE
  // =======================

  async updateRole(userId: string, role: UserRole): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  // =======================
  // 🔥 FIND ALL USERS
  // =======================

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(UserMapper.toDomain);
  }
}
