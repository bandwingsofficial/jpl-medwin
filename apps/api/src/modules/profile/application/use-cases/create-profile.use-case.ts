// src/modules/profile/application/use-cases/create-profile.use-case.ts

import crypto from 'crypto';

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProfileRepository } from '../../domain/repositories/profile.repository';

import { Profile } from '../../domain/entities/profile.entity';

import { ProfileDomainService } from '../../domain/services/profile-domain.service';

import { ProfileAlreadyExistsException } from '../../domain/exceptions/profile-already-exists.exception';
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';
import { InvalidEmailException } from '../../domain/exceptions/invalid-email.exception';
import { InvalidPhoneNumberException } from '../../domain/exceptions/invalid-phone-number.exception';
import { PhoneNumberAlreadyExistsException } from '../../domain/exceptions/phone-number-already-exists.exception';
@Injectable()
export class CreateProfileUseCase {
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
    // 🔍 CHECK EXISTING PROFILE
    // =======================

    const existingProfile = await this.profileRepo.findByUserId(input.userId);

    if (existingProfile) {
      throw new ProfileAlreadyExistsException({
        userId: input.userId,
      });
    }

    // =======================
    // ✨ NORMALIZATION
    // =======================

    const normalizedName = input.name ? this.domainService.normalizeName(input.name) : undefined;

    const normalizedEmail = input.email
      ? this.domainService.normalizeEmail(input.email)
      : undefined;

    const normalizedPhoneNumber = input.phoneNumber
      ? this.domainService.normalizePhoneNumber(input.phoneNumber)
      : undefined;

    // =======================
    // 🔍 EMAIL VALIDATION
    // =======================

    if (normalizedEmail && !this.domainService.isValidEmail(normalizedEmail)) {
      throw new InvalidEmailException({
        email: normalizedEmail,
      });
    }

    // =======================
    // 🔍 PHONE VALIDATION
    // =======================

    if (normalizedPhoneNumber && !this.domainService.isValidPhoneNumber(normalizedPhoneNumber)) {
      throw new InvalidPhoneNumberException({
        phoneNumber: normalizedPhoneNumber,
      });
    }

    // =======================
    // 🔍 EMAIL CHECK
    // =======================

    if (normalizedEmail) {
      const existingEmailProfile = await this.profileRepo.findByEmail(normalizedEmail);

      if (existingEmailProfile) {
        throw new EmailAlreadyExistsException({
          email: normalizedEmail,
        });
      }
    }

    // =======================
    // 🔍 PHONE CHECK
    // =======================

    if (normalizedPhoneNumber) {
      const existingPhoneProfile = await this.profileRepo.findByPhoneNumber(normalizedPhoneNumber);

      if (existingPhoneProfile) {
        throw new PhoneNumberAlreadyExistsException({
          phoneNumber: normalizedPhoneNumber,
        });
      }
    }

    // =======================
    // 🏗️ CREATE ENTITY
    // =======================

    const profile = new Profile(
      crypto.randomUUID(),

      input.userId,

      normalizedName,
      normalizedEmail,
      normalizedPhoneNumber,

      input.avatarUrl,
    );

    // =======================
    // 💾 STORE
    // =======================

    return this.profileRepo.create(profile);
  }
}
