// src/modules/profile/domain/repositories/profile.repository.ts

import { Profile } from '../entities/profile.entity';

export abstract class ProfileRepository {
  // =======================
  // ✨ CREATE
  // =======================

  abstract create(profile: Profile): Promise<Profile>;

  // =======================
  // 💾 SAVE
  // =======================

  abstract save(profile: Profile): Promise<Profile>;

  // =======================
  // 🔍 FIND
  // =======================

  abstract findById(id: string): Promise<Profile | null>;

  abstract findByUserId(userId: string): Promise<Profile | null>;

  abstract findByEmail(email: string): Promise<Profile | null>;

  abstract findByPhoneNumber(
    phoneNumber: string,
  ): Promise<Profile | null>;

  // =======================
  // 🗑️ DELETE
  // =======================

  abstract softDelete(id: string): Promise<void>;
}