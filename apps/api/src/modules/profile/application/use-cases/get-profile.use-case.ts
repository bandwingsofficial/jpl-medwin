// src/modules/profile/application/use-cases/get-profile.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProfileRepository } from '../../domain/repositories/profile.repository';

import { Profile } from '../../domain/entities/profile.entity';

import { ProfileNotFoundException } from '../../domain/exceptions/profile-not-found.exception';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(TOKENS.PROFILE_REPO)
    private readonly profileRepo: ProfileRepository,
  ) {}

  async execute(userId: string): Promise<Profile> {
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
    // ✅ RETURN
    // =======================

    return profile;
  }
}
