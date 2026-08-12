"use client";

import { cartApi } from "@/features/cart/api/cart.api";
import {
  GuestCartItem,
  localCartService,
} from "@/features/cart/hooks/local-cart.service";

class GuestCartMigrationService {
  private migrationPromise:
    | Promise<void>
    | null = null;

  async migrate(): Promise<void> {
    if (this.migrationPromise) {
      return this.migrationPromise;
    }

    this.migrationPromise =
      this.executeMigration();

    try {
      await this.migrationPromise;
    } finally {
      this.migrationPromise = null;
    }
  }

  private async executeMigration(): Promise<void> {
    const guestItems =
      localCartService.getItems();

    if (guestItems.length === 0) {
      return;
    }

    /*
     * Get the authenticated backend cart first.
     *
     * This is important because the user may already
     * have products in their real cart.
     */
    const existingCart =
      await cartApi.getCart();

    for (const guestItem of guestItems) {
      await this.migrateItem(
        guestItem,
        existingCart,
      );
    }

    /*
     * Only clear guest cart after every item
     * has been migrated successfully.
     */
    localCartService.clear();
  }

  private async migrateItem(
    guestItem: GuestCartItem,
    existingCart: Awaited<
      ReturnType<typeof cartApi.getCart>
    >,
  ): Promise<void> {
    const existingItem =
      existingCart.cartItems.find(
        (item) =>
          item.productId ===
            guestItem.product.id &&
          item.variantId ===
            guestItem.variantId,
      );

    if (!existingItem) {
      await cartApi.addItem({
        productId:
          guestItem.product.id,

        variantId:
          guestItem.variantId,

        quantity:
          guestItem.quantity,
      });

      return;
    }

    /*
     * The same product/variant already exists
     * in the authenticated cart.
     *
     * Merge guest quantity into existing quantity.
     */
    const currentQuantity =
      existingItem.variant.quantity;

    await cartApi.updateItem(
      existingItem.id,
      {
        quantity:
          currentQuantity +
          guestItem.quantity,
      },
    );
  }
}

export const guestCartMigrationService =
  new GuestCartMigrationService();