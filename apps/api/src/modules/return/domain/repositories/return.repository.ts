import { Return } from '../entities/return.entity';

import { ReturnReason } from '../enums/return-reason.enum';
import { ReturnStatus } from '../enums/return-status.enum';
import { ReturnType } from '../enums/return-type.enum';

export interface ReturnRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<Return | null>;

  findByOrderId(orderId: string): Promise<Return[]>;

  findByUserId(userId: string): Promise<Return[]>;

  findByStatus(status: ReturnStatus): Promise<Return[]>;

  findByType(type: ReturnType): Promise<Return[]>;

  findByReason(reason: ReturnReason): Promise<Return[]>;

  findPendingReturns(): Promise<Return[]>;

  findActiveReturnByOrderId(orderId: string): Promise<Return | null>;

  findLatestReturnByOrderId(orderId: string): Promise<Return | null>;

  findByReplacementOrderId(replacementOrderId: string): Promise<Return | null>;

  findMany(params: {
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
  }>;

  // =======================
  // 🧠 EXISTS
  // =======================

  existsById(id: string): Promise<boolean>;

  existsActiveReturnByOrderId(orderId: string): Promise<boolean>;

  existsByReplacementOrderId(replacementOrderId: string): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(request: Return): Promise<Return>;

  update(request: Return): Promise<Return>;

  createMany(requests: Return[]): Promise<void>;

  updateMany(requests: Return[]): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  delete(returnId: string): Promise<void>;
}
