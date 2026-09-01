// src/modules/cart/application/use-cases/calculate-guest-cart-summary.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { CartItem } from '../../domain/entities/cart-item.entity';
import { CartSummaryService } from '../services/cart-summary.service';

export interface GuestCartItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
  price?: number;
  mrp?: number;
  isOverweight?: boolean;
  weightKg?: number | null;
}

@Injectable()
export class CalculateGuestCartSummaryUseCase {
  constructor(
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
    private readonly summaryService: CartSummaryService,
  ) {}

  async execute(input: { items?: GuestCartItemInput[] }) {
    const rawItems = input.items ?? [];

    if (rawItems.length === 0) {
      const summary = await this.summaryService.buildEmptySummary();
      return { summary };
    }

    const resolvedItems: CartItem[] = [];
    const overweightItems: Array<{
      isOverweight?: boolean;
      weightKg?: number | null;
      quantity: number;
    }> = [];

    for (const item of rawItems) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        continue;
      }

      let price = item.price ?? 0;
      let mrp = item.mrp ?? price;
      let isOverweight = Boolean(item.isOverweight);
      let weightKg = item.weightKg ?? null;
      let productName = 'Product';

      // Lookup live product data from repository for accuracy
      try {
        const product = await this.productRepo.findFullById(item.productId);
        if (product) {
          productName = product.name;
          isOverweight = Boolean(product.isOverweight);
          weightKg = product.weightKg ?? null;

          const variant = item.variantId
            ? product.variants.find((v) => v.id === item.variantId)
            : product.variants[0];

          if (variant?.sellingPrice !== undefined && variant?.sellingPrice !== null) {
            price = Number(variant.sellingPrice);
            mrp = variant.mrp ? Number(variant.mrp) : price;
          }
        }
      } catch (err) {
        // Fallback to client-provided values if lookup fails
      }

      resolvedItems.push(
        new CartItem(
          `guest-item-${item.productId}-${item.variantId ?? ''}`,
          'guest-cart',
          item.productId,
          item.variantId ?? '',
          item.quantity,
          productName,
          undefined,
          undefined,
          undefined,
          price,
          mrp,
        ),
      );

      overweightItems.push({
        isOverweight,
        weightKg,
        quantity: item.quantity,
      });
    }

    if (resolvedItems.length === 0) {
      const summary = await this.summaryService.buildEmptySummary();
      return { summary };
    }

    const summary = await this.summaryService.build({
      items: resolvedItems,
      overweightItems,
    });

    return { summary };
  }
}
