import { Brand } from '../entities/brand.entity';

export interface BrandRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(
    id: string,
  ): Promise<Brand | null>;

  findBySlug(
    slug: string,
  ): Promise<Brand | null>;

  findByName(
    name: string,
  ): Promise<Brand | null>;

  // 🔥 RESTORE SUPPORT
  findBySlugIncludingDeleted(
    slug: string,
  ): Promise<Brand | null>;

  findAll(): Promise<Brand[]>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsBySlug(
    slug: string,
  ): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(
    brand: Brand,
  ): Promise<Brand>;

  update(
    brand: Brand,
  ): Promise<Brand>;

  // =======================
  // ❌ DELETE
  // =======================

  delete(id: string): Promise<void>;
}