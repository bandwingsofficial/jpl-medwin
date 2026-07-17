import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ReturnRepository } from '../../domain/repositories/return.repository';

import { ReturnNotFoundException } from '../../domain/exceptions/return-not-found.exception';

import { ReturnDomainService } from '../../domain/services/return-domain.service';

@Injectable()
export class PickupReturnUseCase {
  constructor(
    @Inject(TOKENS.RETURN_REPO)
    private readonly returnRepo: ReturnRepository,

    private readonly domainService: ReturnDomainService,
  ) {}

  async execute(input: {
    returnId: string;

    trackingId?: string;
  }) {
    // =======================
    // 🔍 FIND RETURN
    // =======================

    const returnRequest = await this.returnRepo.findById(input.returnId);

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!returnRequest) {
      throw new ReturnNotFoundException({
        returnId: input.returnId,
      });
    }

    // =======================
    // 🛡 VALIDATE
    // =======================

    this.domainService.ensureReturnUsable(returnRequest);

    this.domainService.ensureCanPickup(returnRequest);

    // =======================
    // 📦 PICKUP
    // =======================

    returnRequest.pickup({
      trackingId: input.trackingId,
    });

    // =======================
    // 💾 SAVE
    // =======================

    const updated = await this.returnRepo.update(returnRequest);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      success: true,

      data: {
        id: updated.id,

        orderId: updated.orderId,

        userId: updated.userId,

        type: updated.type,

        reason: updated.reason,

        status: updated.status,

        pickup: {
          trackingId: updated.pickupTrackingId,

          pickedUpAt: updated.pickedUpAt,
        },

        createdAt: updated.createdAt,

        updatedAt: updated.updatedAt,
      },
    };
  }
}
