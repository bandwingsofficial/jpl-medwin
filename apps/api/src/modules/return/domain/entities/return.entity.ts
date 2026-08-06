import { ReturnReason } from '../enums/return-reason.enum';
import { ReturnStatus } from '../enums/return-status.enum';
import { ReturnType } from '../enums/return-type.enum';

import { InvalidReturnOperationException } from '../exceptions/invalid-return-operation.exception';
import { ReturnAlreadyApprovedException } from '../exceptions/return-already-approved.exception';
import { ReturnAlreadyCompletedException } from '../exceptions/return-already-completed.exception';
import { ReturnAlreadyPickedUpException } from '../exceptions/return-already-picked-up.exception';
import { ReturnAlreadyRejectedException } from '../exceptions/return-already-rejected.exception';
import { ReturnNotApprovedException } from '../exceptions/return-not-approved.exception';

export class Return {
  constructor(
    public readonly id: string,

    public orderId: string,

    public userId: string,

    public type: ReturnType,

    public reason: ReturnReason,

    public status: ReturnStatus = ReturnStatus.REQUESTED,

    public description?: string,

    public adminRemark?: string,

    public rejectionReason?: string,

    public pickupTrackingId?: string,

    public replacementOrderId?: string,

    public approvedAt?: Date,

    public rejectedAt?: Date,

    public pickedUpAt?: Date,

    public completedAt?: Date,

    public metadata: Record<string, any> = {},

    public readonly createdAt: Date = new Date(),

    public updatedAt: Date = new Date(),
  ) {}

  static create(params: {
    orderId: string;
    userId: string;
    type: ReturnType;
    reason: ReturnReason;
    description?: string;
  }) {
    return new Return(
      crypto.randomUUID(),
      params.orderId,
      params.userId,
      params.type,
      params.reason,
      ReturnStatus.REQUESTED,
      params.description,
    );
  }

  // =======================
  // 🧠 STATE
  // =======================

  isRequested(): boolean {
    return this.status === ReturnStatus.REQUESTED;
  }

  isApproved(): boolean {
    return this.status === ReturnStatus.APPROVED;
  }

  isRejected(): boolean {
    return this.status === ReturnStatus.REJECTED;
  }

  isPickedUp(): boolean {
    return this.status === ReturnStatus.PICKED_UP;
  }

  isCompleted(): boolean {
    return this.status === ReturnStatus.COMPLETED;
  }

  // =======================
  // ✅ APPROVE
  // =======================

  approve(adminRemark?: string) {
    if (this.isCompleted()) {
      throw new ReturnAlreadyCompletedException({
        returnId: this.id,
      });
    }

    if (this.isApproved()) {
      throw new ReturnAlreadyApprovedException({
        returnId: this.id,
      });
    }

    if (this.isRejected()) {
      throw new InvalidReturnOperationException({
        returnId: this.id,
        operation: 'approve',
        reason: 'Rejected return cannot be approved',
      });
    }

    this.status = ReturnStatus.APPROVED;

    this.adminRemark = adminRemark;

    this.approvedAt = new Date();

    this.touch();
  }

  // =======================
  // ❌ REJECT
  // =======================

  reject(reason?: string) {
    if (this.isCompleted()) {
      throw new ReturnAlreadyCompletedException({
        returnId: this.id,
      });
    }

    if (this.isRejected()) {
      throw new ReturnAlreadyRejectedException({
        returnId: this.id,
      });
    }

    if (this.isApproved()) {
      throw new InvalidReturnOperationException({
        returnId: this.id,
        operation: 'reject',
        reason: 'Approved return cannot be rejected',
      });
    }

    this.status = ReturnStatus.REJECTED;

    this.rejectionReason = reason;

    this.rejectedAt = new Date();

    this.touch();
  }

  // =======================
  // 📦 PICKUP
  // =======================

  pickup(params?: { trackingId?: string }) {
    if (!this.isApproved()) {
      throw new ReturnNotApprovedException({
        returnId: this.id,
      });
    }

    if (this.isPickedUp()) {
      throw new ReturnAlreadyPickedUpException({
        returnId: this.id,
      });
    }

    if (this.isCompleted()) {
      throw new ReturnAlreadyCompletedException({
        returnId: this.id,
      });
    }

    this.status = ReturnStatus.PICKED_UP;

    this.pickupTrackingId = params?.trackingId;

    this.pickedUpAt = new Date();

    this.touch();
  }

  // =======================
  // 🎉 COMPLETE
  // =======================

  complete(params?: { replacementOrderId?: string }) {
    if (this.isCompleted()) {
      throw new ReturnAlreadyCompletedException({
        returnId: this.id,
      });
    }

    if (!this.isPickedUp()) {
      throw new InvalidReturnOperationException({
        returnId: this.id,
        operation: 'complete',
        reason: 'Return must be picked up before completion',
      });
    }

    if (this.type === ReturnType.REPLACEMENT && !params?.replacementOrderId) {
      throw new InvalidReturnOperationException({
        returnId: this.id,
        operation: 'complete',
        reason: 'Replacement order id is required',
      });
    }

    this.status = ReturnStatus.COMPLETED;

    if (params?.replacementOrderId) {
      this.replacementOrderId = params.replacementOrderId;
    }

    this.completedAt = new Date();

    this.touch();
  }

  // =======================
  // 🕒 INTERNAL
  // =======================

  private touch() {
    this.updatedAt = new Date();
  }
}
