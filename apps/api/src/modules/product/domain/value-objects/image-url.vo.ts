import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class ImageUrlVO {
  private readonly value: string;

  constructor(input: string) {
    const normalized = input?.trim();

    if (!normalized) {
      throw new BaseException(
        'Image URL required',
        ErrorCode.PRODUCT_IMAGE.INVALID_OWNER,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      new URL(normalized);
    } catch {
      throw new BaseException(
        'Invalid image URL',
        ErrorCode.PRODUCT_IMAGE.INVALID_OWNER,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }
}
