// src/modules/profile/application/use-cases/create-profile.use-case.ts

import crypto from 'crypto';

import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { AuthIdentityRepository } from '@/domain/repositories/auth-identity.repository';
import { AuthMethod } from '@/domain/enums/auth-method.enum';

import { Profile } from '../../domain/entities/profile.entity';
import { AuthIdentity } from '@/domain/entities/auth-identity.entity';

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

    @Inject(TOKENS.AUTH_IDENTITY_REPO)
    private readonly identityRepo: AuthIdentityRepository,

    private readonly domainService: ProfileDomainService,
  ) {}

  async execute(input: {
    userId: string;

    salutation?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    customerType?: string;
    clinicHospitalName?: string;
    whatsappNumber?: string;
    gstNumber?: string;

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

    const normalizedSalutation = input.salutation?.trim();
    const normalizedFirstName = input.firstName ? this.domainService.normalizeName(input.firstName) : undefined;
    const normalizedLastName = input.lastName ? this.domainService.normalizeName(input.lastName) : undefined;

    let computedName = input.name ? this.domainService.normalizeName(input.name) : undefined;
    if (!computedName && (normalizedFirstName || normalizedLastName)) {
      computedName = [normalizedFirstName, normalizedLastName].filter(Boolean).join(' ');
    }

    const normalizedName = computedName;

    const normalizedCustomerType = input.customerType?.trim();
    const normalizedClinicHospitalName = input.clinicHospitalName ? this.domainService.normalizeName(input.clinicHospitalName) : undefined;

    let normalizedWhatsappNumber = input.whatsappNumber
      ? this.domainService.normalizeWhatsappNumber(input.whatsappNumber)
      : undefined;

    let normalizedGstNumber = input.gstNumber
      ? this.domainService.normalizeGstin(input.gstNumber)
      : undefined;

    let normalizedEmail = input.email
      ? this.domainService.normalizeEmail(input.email)
      : undefined;

    let normalizedPhoneNumber = input.phoneNumber
      ? this.domainService.normalizePhoneNumber(input.phoneNumber)
      : undefined;

    // =======================
    // 🔐 AUTHENTICATED IDENTITY RECONCILIATION
    // =======================

    const userIdentities = await this.identityRepo.findActiveByUserId(input.userId);
    const verifiedPhone = userIdentities.find(
      (i) => i.type === AuthMethod.PHONE && i.isVerified,
    );
    const verifiedEmail = userIdentities.find(
      (i) => i.type === AuthMethod.EMAIL && i.isVerified,
    );

    if (verifiedPhone) {
      const normalizedVerifiedPhone = this.domainService.normalizePhoneNumber(verifiedPhone.value);
      if (
        normalizedPhoneNumber !== undefined &&
        normalizedPhoneNumber !== '' &&
        normalizedPhoneNumber !== normalizedVerifiedPhone
      ) {
        throw new BadRequestException({
          message: 'Phone number cannot differ from verified authentication phone number',
          errorCode: 'VERIFIED_PHONE_MISMATCH',
        });
      }
      normalizedPhoneNumber = normalizedVerifiedPhone;
    }

    if (verifiedEmail) {
      const normalizedVerifiedEmail = this.domainService.normalizeEmail(verifiedEmail.value);
      if (
        normalizedEmail !== undefined &&
        normalizedEmail !== '' &&
        normalizedEmail !== normalizedVerifiedEmail
      ) {
        throw new BadRequestException({
          message: 'Email address cannot differ from verified authentication email address',
          errorCode: 'VERIFIED_EMAIL_MISMATCH',
        });
      }
      normalizedEmail = normalizedVerifiedEmail;
    }

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

      if (existingEmailProfile && existingEmailProfile.userId !== input.userId) {
        throw new EmailAlreadyExistsException({
          email: normalizedEmail,
        });
      }

      const existingEmailIdentity = await this.identityRepo.findActiveByTypeAndValue(
        AuthMethod.EMAIL,
        normalizedEmail,
      );

      if (existingEmailIdentity && existingEmailIdentity.userId !== input.userId) {
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

      if (existingPhoneProfile && existingPhoneProfile.userId !== input.userId) {
        throw new PhoneNumberAlreadyExistsException({
          phoneNumber: normalizedPhoneNumber,
        });
      }

      const existingPhoneIdentity = await this.identityRepo.findActiveByTypeAndValue(
        AuthMethod.PHONE,
        normalizedPhoneNumber,
      );

      if (existingPhoneIdentity && existingPhoneIdentity.userId !== input.userId) {
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

      new Date(),
      new Date(),
      undefined,

      normalizedSalutation,
      normalizedFirstName,
      normalizedLastName,
      normalizedCustomerType,
      normalizedClinicHospitalName,
      normalizedWhatsappNumber,
      normalizedGstNumber,
    );

    // =======================
    // 🔐 SYNC AUTH IDENTITIES
    // =======================

    if (normalizedPhoneNumber) {
      const existingPhoneIdentity = await this.identityRepo.findActiveByTypeAndValue(
        AuthMethod.PHONE,
        normalizedPhoneNumber,
      );

      if (!existingPhoneIdentity) {
        await this.identityRepo.create(
          new AuthIdentity(
            crypto.randomUUID(),
            input.userId,
            AuthMethod.PHONE,
            normalizedPhoneNumber,
            true,
          ),
        );
      }
    }

    if (normalizedEmail) {
      const existingEmailIdentity = await this.identityRepo.findActiveByTypeAndValue(
        AuthMethod.EMAIL,
        normalizedEmail,
      );

      if (!existingEmailIdentity) {
        await this.identityRepo.create(
          new AuthIdentity(
            crypto.randomUUID(),
            input.userId,
            AuthMethod.EMAIL,
            normalizedEmail,
            true,
          ),
        );
      }
    }

    // =======================
    // 💾 STORE
    // =======================

    return this.profileRepo.create(profile);
  }
}
