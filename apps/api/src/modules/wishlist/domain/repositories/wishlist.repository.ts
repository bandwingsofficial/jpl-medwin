// src/modules/wishlist/domain/repositories/wishlist.repository.ts

import { Wishlist } from '../entities/wishlist.entity';

export interface WishlistRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<Wishlist | null>;

  findByUserId(userId: string): Promise<Wishlist[]>;

  findByUserAndProduct(userId: string, productId: string): Promise<Wishlist | null>;

  // =======================
  // 🧠 CHECKS
  // =======================

  exists(userId: string, productId: string): Promise<boolean>;

  countByUserId(userId: string): Promise<number>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(wishlist: Wishlist): Promise<Wishlist>;

  update(wishlist: Wishlist): Promise<Wishlist>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(id: string): Promise<void>;

  restore(id: string): Promise<void>;
}
