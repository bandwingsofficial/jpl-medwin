import crypto from 'crypto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { AuthIdentityRepository } from '@/domain/repositories/auth-identity.repository';
import { AuthMethod } from '@/domain/enums/auth-method.enum';

import { ProfileDomainService } from '../../domain/services/profile-domain.service';

import { ProfileNotFoundException } from '../../domain/exceptions/profile-not-found.exception';

import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';
import { InvalidEmailException } from '../../domain/exceptions/invalid-email.exception';
import { InvalidPhoneNumberException } from '../../domain/exceptions/invalid-phone-number.exception';
import { PhoneNumberAlreadyExistsException } from '../../domain/exceptions/phone-number-already-exists.exception';

import { Profile } from '../../domain/entities/profile.entity';
import { AuthIdentity } from '@/domain/entities/auth-identity.entity';

@Injectable()
export class UpdateProfileUseCase {
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
    // 🔍 FIND PROFILE
    // =======================

    let profile = await this.profileRepo.findByUserId(input.userId);

    if (!profile) {
      const newProfile = new Profile(
        crypto.randomUUID(),
        input.userId,
        undefined,
        undefined,
        undefined,
        undefined,
      );
      profile = await this.profileRepo.create(newProfile);
    }

    // =======================
    // ✨ NORMALIZATION
    // =======================

    const normalizedSalutation =
      input.salutation !== undefined ? input.salutation?.trim() || undefined : undefined;

    const normalizedFirstName =
      input.firstName !== undefined
        ? input.firstName ? this.domainService.normalizeName(input.firstName) : undefined
        : undefined;

    const normalizedLastName =
      input.lastName !== undefined
        ? input.lastName ? this.domainService.normalizeName(input.lastName) : undefined
        : undefined;

    let computedName =
      input.name !== undefined ? this.domainService.normalizeName(input.name) : undefined;

    if (!computedName && (normalizedFirstName !== undefined || normalizedLastName !== undefined)) {
      const first = normalizedFirstName !== undefined ? normalizedFirstName : profile.firstName;
      const last = normalizedLastName !== undefined ? normalizedLastName : profile.lastName;
      computedName = [first, last].filter(Boolean).join(' ') || undefined;
    }

    const normalizedName = computedName;

    const normalizedCustomerType =
      input.customerType !== undefined ? input.customerType?.trim() || undefined : undefined;

    const normalizedClinicHospitalName =
      input.clinicHospitalName !== undefined
        ? input.clinicHospitalName ? this.domainService.normalizeName(input.clinicHospitalName) : undefined
        : undefined;

    const normalizedWhatsappNumber =
      input.whatsappNumber !== undefined
        ? input.whatsappNumber ? this.domainService.normalizeWhatsappNumber(input.whatsappNumber) : undefined
        : undefined;

    const normalizedGstNumber =
      input.gstNumber !== undefined
        ? input.gstNumber ? this.domainService.normalizeGstin(input.gstNumber) : undefined
        : undefined;

    let normalizedEmail =
      input.email !== undefined && input.email !== null
        ? this.domainService.normalizeEmail(input.email)
        : undefined;

    let normalizedPhoneNumber =
      input.phoneNumber !== undefined && input.phoneNumber !== null
        ? this.domainService.normalizePhoneNumber(input.phoneNumber)
        : undefined;

    // =======================
    // 🔐 AUTHENTICATED IDENTITY PROTECTION
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
          message: 'Verified phone number cannot be changed directly from profile',
          errorCode: 'VERIFIED_PHONE_PROTECTED',
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
          message: 'Verified email address cannot be changed directly from profile',
          errorCode: 'VERIFIED_EMAIL_PROTECTED',
        });
      }
      normalizedEmail = normalizedVerifiedEmail;
    }

    // =======================
    // 📧 EMAIL VALIDATION
    // =======================

    if (normalizedEmail && !this.domainService.isValidEmail(normalizedEmail)) {
      throw new InvalidEmailException({
        email: normalizedEmail,
      });
    }

    // =======================
    // 📱 PHONE VALIDATION
    // =======================

    if (normalizedPhoneNumber && !this.domainService.isValidPhoneNumber(normalizedPhoneNumber)) {
      throw new InvalidPhoneNumberException({
        phoneNumber: normalizedPhoneNumber,
      });
    }

    // =======================
    // 📧 EMAIL CHECK
    // =======================

    if (normalizedEmail && normalizedEmail !== profile.email) {
      const existingProfile = await this.profileRepo.findByEmail(normalizedEmail);

      if (existingProfile && existingProfile.id !== profile.id) {
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
    // 📱 PHONE CHECK
    // =======================

    if (normalizedPhoneNumber && normalizedPhoneNumber !== profile.phoneNumber) {
      const existingPhoneProfile = await this.profileRepo.findByPhoneNumber(normalizedPhoneNumber);

      if (existingPhoneProfile && existingPhoneProfile.id !== profile.id) {
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
    // 🔄 UPDATE ENTITY
    // =======================

    profile.updateDetails({
      name: normalizedName,
      email: normalizedEmail,
      phoneNumber: normalizedPhoneNumber,
      avatarUrl: input.avatarUrl,
      salutation: normalizedSalutation,
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      customerType: normalizedCustomerType,
      clinicHospitalName: normalizedClinicHospitalName,
      whatsappNumber: normalizedWhatsappNumber,
      gstNumber: normalizedGstNumber,
    });

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
    // 💾 SAVE
    // =======================

    return this.profileRepo.save(profile);
  }
}
