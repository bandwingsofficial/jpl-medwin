import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { ReturnRepository } from '../../../../domain/repositories/return.repository';

import { Return } from '../../../../domain/entities/return.entity';

import { ReturnStatus } from '../../../../domain/enums/return-status.enum';

import { ReturnType } from '../../../../domain/enums/return-type.enum';

import { ReturnReason } from '../../../../domain/enums/return-reason.enum';

import { ReturnMapper } from '../mappers/return.mapper';

@Injectable()
export class PrismaReturnRepository implements ReturnRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<Return | null> {
    const record = await this.prisma.return.findUnique({
      where: {
        id,
      },

      include: {
        order: true,
        replacementOrder: true,
      },
    });

    return record ? ReturnMapper.toDomain(record) : null;
  }

  async findByOrderId(orderId: string): Promise<Return[]> {
    const records = await this.prisma.return.findMany({
      where: {
        orderId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(ReturnMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<Return[]> {
    const records = await this.prisma.return.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(ReturnMapper.toDomain);
  }

  async findByStatus(status: ReturnStatus): Promise<Return[]> {
    const records = await this.prisma.return.findMany({
      where: {
        status,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(ReturnMapper.toDomain);
  }

  async findByType(type: ReturnType): Promise<Return[]> {
    const records = await this.prisma.return.findMany({
      where: {
        type,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(ReturnMapper.toDomain);
  }

  async findByReason(reason: ReturnReason): Promise<Return[]> {
    const records = await this.prisma.return.findMany({
      where: {
        reason,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(ReturnMapper.toDomain);
  }

  async findPendingReturns(): Promise<Return[]> {
    const records = await this.prisma.return.findMany({
      where: {
        status: ReturnStatus.REQUESTED,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(ReturnMapper.toDomain);
  }

  async findActiveReturnByOrderId(orderId: string): Promise<Return | null> {
    const record = await this.prisma.return.findFirst({
      where: {
        orderId,

        status: {
          in: [ReturnStatus.REQUESTED, ReturnStatus.APPROVED, ReturnStatus.PICKED_UP],
        },
      },
    });

    return record ? ReturnMapper.toDomain(record) : null;
  }

  async findLatestReturnByOrderId(orderId: string): Promise<Return | null> {
    const record = await this.prisma.return.findFirst({
      where: {
        orderId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return record ? ReturnMapper.toDomain(record) : null;
  }

  async findByReplacementOrderId(replacementOrderId: string): Promise<Return | null> {
    const record = await this.prisma.return.findFirst({
      where: {
        replacementOrderId,
      },
    });

    return record ? ReturnMapper.toDomain(record) : null;
  }

  async existsByReplacementOrderId(replacementOrderId: string): Promise<boolean> {
    const count = await this.prisma.return.count({
      where: {
        replacementOrderId,
      },
    });

    return count > 0;
  }

  async findMany(params: {
    page?: number;

    limit?: number;

    search?: string;

    status?: ReturnStatus;

    type?: ReturnType;

    reason?: ReturnReason;

    userId?: string;

    orderId?: string;

    from?: Date;

    to?: Date;

    sortBy?: string;

    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: Return[];

    total: number;
  }> {
    const page = Number(params.page ?? 1);

    const limit = Number(params.limit ?? 10);

    const skip = (page - 1) * limit;

    const where: Prisma.ReturnWhereInput = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.type) {
      where.type = params.type;
    }

    if (params.reason) {
      where.reason = params.reason;
    }

    if (params.userId) {
      where.userId = params.userId;
    }

    if (params.orderId) {
      where.orderId = params.orderId;
    }

    if (params.from || params.to) {
      where.createdAt = {
        ...(params.from && {
          gte: params.from,
        }),

        ...(params.to && {
          lte: params.to,
        }),
      };
    }

    const allowedSortFields = ['createdAt', 'updatedAt', 'status', 'type'];

    const sortBy = allowedSortFields.includes(params.sortBy ?? '') ? params.sortBy! : 'createdAt';

    const sortOrder = params.sortOrder ?? 'desc';

    const [records, total] = await Promise.all([
      this.prisma.return.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          [sortBy]: sortOrder,
        },

        include: {
          user: true,

          order: true,
        },
      }),

      this.prisma.return.count({
        where,
      }),
    ]);

    return {
      data: records.map(ReturnMapper.toDomain),

      total,
    };
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.return.count({
      where: {
        id,
      },
    });

    return count > 0;
  }

  async existsActiveReturnByOrderId(orderId: string): Promise<boolean> {
    const count = await this.prisma.return.count({
      where: {
        orderId,

        status: {
          in: [ReturnStatus.REQUESTED, ReturnStatus.APPROVED, ReturnStatus.PICKED_UP],
        },
      },
    });

    return count > 0;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(request: Return): Promise<Return> {
    const created = await this.prisma.return.create({
      data: ReturnMapper.toPersistence(request),
    });

    return ReturnMapper.toDomain(created);
  }

  async update(request: Return): Promise<Return> {
    const updated = await this.prisma.return.update({
      where: {
        id: request.id,
      },

      data: ReturnMapper.toPersistence(request),
    });

    return ReturnMapper.toDomain(updated);
  }

  async createMany(requests: Return[]): Promise<void> {
    if (!requests.length) {
      return;
    }

    await this.prisma.return.createMany({
      data: requests.map(ReturnMapper.toPersistence),
    });
  }

  async updateMany(requests: Return[]): Promise<void> {
    await Promise.all(
      requests.map((request) =>
        this.prisma.return.update({
          where: {
            id: request.id,
          },

          data: ReturnMapper.toPersistence(request),
        }),
      ),
    );
  }

  // =======================
  // ❌ DELETE
  // =======================

  async delete(returnId: string): Promise<void> {
    await this.prisma.return.delete({
      where: {
        id: returnId,
      },
    });
  }
}
