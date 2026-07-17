// src/modules/profile/application/services/profile-validation.service.ts

import { Injectable } from '@nestjs/common';

import { ProfileRepository } from '../../domain/repositories/profile.repository';

import { ProfileDomainService } from '../../domain/services/profile-domain.service';

import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';

@Injectable()
export class ProfileValidationService {
  constructor(
    private readonly profileRepository: ProfileRepository,

    private readonly profileDomainService: ProfileDomainService,
  ) {}

  // =======================
  // 📧 EMAIL
  // =======================

  async validateEmail(email?: string): Promise<string | undefined> {
    if (!email) {
      return undefined;
    }

    const normalizedEmail = this.profileDomainService.normalizeEmail(email);

    const isValid = this.profileDomainService.isValidEmail(normalizedEmail);

    if (!isValid) {
      throw new Error('Invalid email');
    }

    const existingProfile = await this.profileRepository.findByEmail(normalizedEmail);

    if (existingProfile) {
      throw new EmailAlreadyExistsException({
        email: normalizedEmail,
      });
    }

    return normalizedEmail;
  }

  // =======================
  // 👤 NAME
  // =======================

  normalizeName(name?: string): string | undefined {
    if (!name) {
      return undefined;
    }

    return this.profileDomainService.normalizeName(name);
  }
}
