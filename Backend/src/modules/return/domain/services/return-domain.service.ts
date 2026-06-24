import { Injectable } from '@nestjs/common';

import { Return } from '../entities/return.entity';

import { ReturnStatus } from '../enums/return-status.enum';

import { InvalidReturnOperationException } from '../exceptions/invalid-return-operation.exception';

@Injectable()
export class ReturnDomainService {
  // =======================
  // 🛡 RETURN VALIDATION
  // =======================

  ensureReturnUsable(returnRequest: Return) {
    if (returnRequest.isCompleted()) {
      throw new InvalidReturnOperationException({
        returnId: returnRequest.id,

        operation: 'use',

        reason: 'Return already completed',
      });
    }

    if (returnRequest.isRejected()) {
      throw new InvalidReturnOperationException({
        returnId: returnRequest.id,

        operation: 'use',

        reason: 'Return already rejected',
      });
    }
  }

  // =======================
  // ✅ APPROVAL
  // =======================

  ensureCanApprove(returnRequest: Return) {
    if (
      returnRequest.status !==
      ReturnStatus.REQUESTED
    ) {
      throw new InvalidReturnOperationException({
        returnId: returnRequest.id,

        operation: 'approve',

        reason:
          'Only requested returns can be approved',
      });
    }
  }

  // =======================
  // ❌ REJECTION
  // =======================

  ensureCanReject(returnRequest: Return) {
    if (
      returnRequest.status !==
      ReturnStatus.REQUESTED
    ) {
      throw new InvalidReturnOperationException({
        returnId: returnRequest.id,

        operation: 'reject',

        reason:
          'Only requested returns can be rejected',
      });
    }
  }

  // =======================
  // 📦 PICKUP
  // =======================

  ensureCanPickup(returnRequest: Return) {
    if (
      returnRequest.status !==
      ReturnStatus.APPROVED
    ) {
      throw new InvalidReturnOperationException({
        returnId: returnRequest.id,

        operation: 'pickup',

        reason:
          'Only approved returns can be picked up',
      });
    }
  }

  // =======================
  // 🎉 COMPLETE
  // =======================

  ensureCanComplete(returnRequest: Return) {
    if (
      returnRequest.status !==
      ReturnStatus.PICKED_UP
    ) {
      throw new InvalidReturnOperationException({
        returnId: returnRequest.id,

        operation: 'complete',

        reason:
          'Return must be picked up before completion',
      });
    }
  }

  // =======================
  // 🔐 OWNERSHIP
  // =======================

  belongsToUser(params: {
    returnRequest: Return;

    userId: string;
  }): boolean {
    return (
      params.returnRequest.userId ===
      params.userId
    );
  }

  // =======================
  // 📊 STATE CHECKS
  // =======================

  isActive(returnRequest: Return): boolean {
    return [
      ReturnStatus.REQUESTED,
      ReturnStatus.APPROVED,
      ReturnStatus.PICKED_UP,
    ].includes(returnRequest.status);
  }

  isClosed(returnRequest: Return): boolean {
    return [
      ReturnStatus.REJECTED,
      ReturnStatus.COMPLETED,
    ].includes(returnRequest.status);
  }
}