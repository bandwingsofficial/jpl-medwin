import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export interface PricingInput {
  purchasePrice?: number | null;
  sellingPrice?: number | null;
  mrp?: number | null;
}

export class ProductPricingValidator {
  static normalizeOptionalPrice(value?: number | null): number {
    if (value === undefined || value === null || Number.isNaN(Number(value))) {
      return 0;
    }

    const num = Number(value);

    if (num < 0) {
      throw new BaseException(
        'Price cannot be negative',
        ErrorCode.VARIANT.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    return Number(num.toFixed(2));
  }

  static normalizeSellingPrice(value?: number | null): number {
    if (value === undefined || value === null || Number.isNaN(Number(value))) {
      throw new BaseException(
        'Selling price is required',
        ErrorCode.VARIANT.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    const num = Number(value);

    if (num <= 0) {
      throw new BaseException(
        'Selling price must be greater than zero',
        ErrorCode.VARIANT.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    return Number(num.toFixed(2));
  }

  static validate(input: PricingInput): {
    purchasePrice: number;
    sellingPrice: number;
    mrp: number;
  } {
    const purchasePrice = this.normalizeOptionalPrice(input.purchasePrice);
    const sellingPrice = this.normalizeSellingPrice(input.sellingPrice);
    const mrp = this.normalizeOptionalPrice(input.mrp);

    if (purchasePrice > 0 && sellingPrice < purchasePrice) {
      throw new BaseException(
        'Selling price cannot be less than purchase price',
        ErrorCode.VARIANT.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (mrp > 0 && mrp < sellingPrice) {
      throw new BaseException(
        'MRP cannot be less than selling price',
        ErrorCode.VARIANT.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    return { purchasePrice, sellingPrice, mrp };
  }
}
