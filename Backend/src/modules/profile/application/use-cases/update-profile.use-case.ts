// src/modules/profile/application/usecases/update-profile.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProfileRepository } from '../../domain/repositories/profile.repository';

import { ProfileDomainService } from '../../domain/services/profile-domain.service';

import { ProfileNotFoundException } from '../../domain/exceptions/profile-not-found.exception';

import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';
import { InvalidEmailException } from '../../domain/exceptions/invalid-email.exception';
import { InvalidPhoneNumberException } from '../../domain/exceptions/invalid-phone-number.exception';
import { PhoneNumberAlreadyExistsException } from '../../domain/exceptions/phone-number-already-exists.exception';

import { Profile } from '../../domain/entities/profile.entity';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(TOKENS.PROFILE_REPO)
    private readonly profileRepo: ProfileRepository,

    private readonly domainService: ProfileDomainService,
  ) {}

  async execute(input: {
    userId: string;

    name?: string;
    email?: string;
    phoneNumber?: string;

    avatarUrl?: string;
  }): Promise<Profile> {
    // =======================
    // 🔍 FIND PROFILE
    // =======================

    const profile = await this.profileRepo.findByUserId(
      input.userId,
    );

    if (!profile) {
      throw new ProfileNotFoundException({
        userId: input.userId,
      });
    }

    // =======================
    // ✨ NORMALIZATION
    // =======================

    const normalizedName =
      input.name !== undefined
        ? this.domainService.normalizeName(input.name)
        : undefined;

    const normalizedEmail =
      input.email !== undefined
        ? this.domainService.normalizeEmail(input.email)
        : undefined;

    const normalizedPhoneNumber =
      input.phoneNumber !== undefined
        ? this.domainService.normalizePhoneNumber(
            input.phoneNumber,
          )
        : undefined;

    // =======================
    // 📧 EMAIL VALIDATION
    // =======================

    if (
      normalizedEmail &&
      !this.domainService.isValidEmail(
        normalizedEmail,
      )
    ) {
      throw new InvalidEmailException({
  email: normalizedEmail,
});
    }

    // =======================
    // 📱 PHONE VALIDATION
    // =======================

    if (
      normalizedPhoneNumber &&
      !this.domainService.isValidPhoneNumber(
        normalizedPhoneNumber,
      )
    ) {
      throw new InvalidPhoneNumberException({
  phoneNumber: normalizedPhoneNumber,
});
    }

    // =======================
    // 📧 EMAIL CHECK
    // =======================

    if (
      normalizedEmail &&
      normalizedEmail !== profile.email
    ) {
      const existingProfile =
        await this.profileRepo.findByEmail(
          normalizedEmail,
        );

      if (
        existingProfile &&
        existingProfile.id !== profile.id
      ) {
        throw new EmailAlreadyExistsException({
          email: normalizedEmail,
        });
      }
    }

    // =======================
    // 📱 PHONE CHECK
    // =======================

    if (
      normalizedPhoneNumber &&
      normalizedPhoneNumber !== profile.phoneNumber
    ) {
      const existingPhoneProfile =
        await this.profileRepo.findByPhoneNumber(
          normalizedPhoneNumber,
        );

      if (
        existingPhoneProfile &&
        existingPhoneProfile.id !== profile.id
      ) {
        throw new PhoneNumberAlreadyExistsException({
  phoneNumber: normalizedPhoneNumber,
});
      }
    }

    // =======================
    // 🔄 UPDATE ENTITY
    // =======================

    profile.updateDetails({
      name: normalizedName,
      email: normalizedEmail,
      phoneNumber: normalizedPhoneNumber,
      avatarUrl: input.avatarUrl,
    });

    // =======================
    // 💾 SAVE
    // =======================

    return this.profileRepo.save(profile);
  }
}