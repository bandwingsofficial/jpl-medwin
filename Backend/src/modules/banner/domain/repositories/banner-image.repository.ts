import { BannerImage } from '../entities/banner-image.entity';

export interface BannerImageRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(
    id: string,
  ): Promise<BannerImage | null>;

  findByBannerId(
    bannerId: string,
  ): Promise<BannerImage[]>;

  findByProductId(
    productId: string,
  ): Promise<BannerImage[]>;

  // =======================
  // ♻️ FIND INCLUDING DELETED
  // =======================

  findByIdIncludingDeleted(
    id: string,
  ): Promise<BannerImage | null>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(
    image: BannerImage,
  ): Promise<BannerImage>;

  createMany(
    images: BannerImage[],
  ): Promise<void>;

  update(
    image: BannerImage,
  ): Promise<BannerImage>;

  updateSortOrder(
    params: {
      id: string;
      sortOrder: number;
    },
  ): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(
    id: string,
  ): Promise<void>;

  restore(
    id: string,
  ): Promise<void>;

  deleteByBannerId(
    bannerId: string,
  ): Promise<void>;

  // =======================
// ♻️ FIND INCLUDING DELETED
// =======================

findByBannerIdIncludingDeleted(
  bannerId: string,
): Promise<BannerImage[]>;
}