import { Injectable } from '@nestjs/common';

import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class ProductPriceService {
  calculatePriceRange(
    product: Product,

    variants: {
      sellingPrice: number;
    }[] = [],
  ) {
    const sellingPrices = variants
      .map((v) => Number(v.sellingPrice))
      .filter((price) => !Number.isNaN(price));

    if (!sellingPrices.length) {
      product.minPrice = undefined;
      product.maxPrice = undefined;

      return;
    }

    product.minPrice = Math.min(...sellingPrices);

    product.maxPrice = Math.max(...sellingPrices);
  }
}
