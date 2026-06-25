import {
  Prisma,
  Return as PrismaReturn,
  ReturnReason as PrismaReturnReason,
  ReturnStatus as PrismaReturnStatus,
  ReturnType as PrismaReturnType,
} from '@prisma/client';

import { Return } from '../../../../domain/entities/return.entity';

import { ReturnReason } from '../../../../domain/enums/return-reason.enum';
import { ReturnStatus } from '../../../../domain/enums/return-status.enum';
import { ReturnType } from '../../../../domain/enums/return-type.enum';
import { OrderMapper } from '@/modules/order/infrastructure/persistence/prisma/mappers/order.mapper';
export class ReturnMapper {
  // =======================
  // 🧾 TO DOMAIN
  // =======================

  static toDomain(p: PrismaReturn): Return {
    return new Return(
      p.id,

      p.orderId,

      p.userId,

      p.type as ReturnType,

      p.reason as ReturnReason,

      p.status as ReturnStatus,

      p.description ?? undefined,

      p.adminRemark ?? undefined,

      p.rejectionReason ?? undefined,

      p.pickupTrackingId ?? undefined,

      p.replacementOrderId ?? undefined,

      p.approvedAt ?? undefined,

      p.rejectedAt ?? undefined,

      p.pickedUpAt ?? undefined,

      p.completedAt ?? undefined,

      (p.metadata as Record<string, any>) ?? {},

      p.createdAt,

      p.updatedAt,
    );
  }

  // =======================
  // 💾 TO PERSISTENCE
  // =======================

  static toPersistence(e: Return) {
    return {
      id: e.id,

      orderId: e.orderId,

      userId: e.userId,

      type: e.type as PrismaReturnType,

      reason: e.reason as PrismaReturnReason,

      status: e.status as PrismaReturnStatus,

      description: e.description ?? null,

      adminRemark: e.adminRemark ?? null,

      rejectionReason: e.rejectionReason ?? null,

      pickupTrackingId: e.pickupTrackingId ?? null,

      replacementOrderId: e.replacementOrderId ?? null,

      approvedAt: e.approvedAt ?? null,

      rejectedAt: e.rejectedAt ?? null,

      pickedUpAt: e.pickedUpAt ?? null,

      completedAt: e.completedAt ?? null,

      metadata: (e.metadata as Prisma.InputJsonValue) ?? Prisma.JsonNull,

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,
    };
  }
}
