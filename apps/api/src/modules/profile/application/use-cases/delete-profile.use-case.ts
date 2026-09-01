// src/modules/profile/application/use-cases/delete-profile.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProfileRepository } from '../../domain/repositories/profile.repository';

import { ProfileNotFoundException } from '../../domain/exceptions/profile-not-found.exception';

@Injectable()
export class DeleteProfileUseCase {
  constructor(
    @Inject(TOKENS.PROFILE_REPO)
    private readonly profileRepo: ProfileRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    // =======================
    // 🔍 FIND PROFILE
    // =======================

    const profile = await this.profileRepo.findByUserId(userId);

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!profile) {
      throw new ProfileNotFoundException({
        userId,
      });
    }

    // =======================
    // 🗑️ SOFT DELETE
    // =======================

    await this.profileRepo.softDelete(profile.id);
  }
}
