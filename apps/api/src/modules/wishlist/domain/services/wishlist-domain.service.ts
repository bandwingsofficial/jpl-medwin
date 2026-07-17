// src/modules/wishlist/domain/services/wishlist-domain.service.ts

import { Injectable } from '@nestjs/common';

import { Wishlist } from '../entities/wishlist.entity';

@Injectable()
export class WishlistDomainService {
  // =======================
  // 🛡 ACTIVE VALIDATION
  // =======================

  ensureActive(wishlist: Wishlist) {
    if (wishlist.isDeleted()) {
      throw new Error('Wishlist item is deleted');
    }
  }

  // =======================
  // 👤 USER OWNERSHIP
  // =======================

  belongsToUser(params: {
    wishlist: Wishlist;

    userId: string;
  }): boolean {
    return params.wishlist.userId === params.userId;
  }

  // =======================
  // 📊 COUNT
  // =======================

  calculateTotalItems(wishlists: Wishlist[]): number {
    return wishlists.filter((wishlist) => !wishlist.isDeleted()).length;
  }

  // =======================
  // 🧹 FILTER ACTIVE
  // =======================

  filterActive(wishlists: Wishlist[]): Wishlist[] {
    return wishlists.filter((wishlist) => !wishlist.isDeleted());
  }
}
