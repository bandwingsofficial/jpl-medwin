import crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { AuthIdentityRepository } from '@/domain/repositories/auth-identity.repository';
import { AuthMethod } from '@/domain/enums/auth-method.enum';

import { Profile } from '../../domain/entities/profile.entity';

import { ProfileNotFoundException } from '../../domain/exceptions/profile-not-found.exception';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(TOKENS.PROFILE_REPO)
    private readonly profileRepo: ProfileRepository,

    @Inject(TOKENS.AUTH_IDENTITY_REPO)
    private readonly identityRepo: AuthIdentityRepository,
  ) {}

  async execute(userId: string): Promise<Profile> {
    // =======================
    // 🔍 FIND PROFILE
    // =======================

    let profile = await this.profileRepo.findByUserId(userId);

    // =======================
    // 🔄 AUTO-RECONCILE PROFILE FROM AUTH IDENTITIES
    // =======================
    if (!profile) {
      const userIdentities = await this.identityRepo.findActiveByUserId(userId);
      const emailIdentity = userIdentities.find(
        (i) => i.type === AuthMethod.EMAIL && i.isVerified,
      );
      const phoneIdentity = userIdentities.find(
        (i) => i.type === AuthMethod.PHONE && i.isVerified,
      );

      if (emailIdentity || phoneIdentity) {
        const newProfile = new Profile(
          crypto.randomUUID(),
          userId,
          undefined,
          emailIdentity?.value,
          phoneIdentity?.value,
          undefined,
        );

        profile = await this.profileRepo.create(newProfile);
      }
    }

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
