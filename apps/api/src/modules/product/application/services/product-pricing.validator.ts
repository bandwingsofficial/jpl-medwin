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
    return 0;
  }

  const num = Number(value);

  if (num < 0) {
    throw new BaseException(
      'Selling price cannot be negative',
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


    return { purchasePrice, sellingPrice, mrp };
  }
}
