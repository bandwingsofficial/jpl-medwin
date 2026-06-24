import { Banner } from '../entities/banner.entity';

import { BannerStatus } from '../enums/banner-status.enum';

import { BannerType } from '../enums/banner-type.enum';

export interface BannerRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(
    id: string,
  ): Promise<Banner | null>;

  findAll(): Promise<Banner[]>;

  findByType(
    type: BannerType,
  ): Promise<Banner[]>;

  findByStatus(
    status: BannerStatus,
  ): Promise<Banner[]>;

  // =======================
  // ♻️ FIND INCLUDING DELETED
  // =======================

  findByIdIncludingDeleted(
    id: string,
  ): Promise<Banner | null>;

  findByNameIncludingDeleted(
    name: string,
  ): Promise<Banner | null>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsByName(
    name: string,
  ): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(
    banner: Banner,
  ): Promise<Banner>;

  update(
    banner: Banner,
  ): Promise<Banner>;

  // =======================
  // 🔄 STATUS
  // =======================

  activate(
    bannerId: string,
  ): Promise<void>;

  deactivate(
    bannerId: string,
  ): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(
    bannerId: string,
  ): Promise<void>;

  restore(
    bannerId: string,
  ): Promise<void>;
}