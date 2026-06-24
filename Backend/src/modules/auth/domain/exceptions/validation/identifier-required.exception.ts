import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class IdentifierRequiredException extends BaseException {
  constructor(details?: {
    allowedTypes?: string[]; // PHONE, EMAIL, etc.
  }) {
    super(
      'Identifier is required',
      ErrorCode.VALIDATION.IDENTIFIER_REQUIRED,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

export class ValidationException extends BaseException {
  constructor(details: Record<string, string>) {
    super('Validation failed', ErrorCode.VALIDATION.GENERIC, HttpStatus.BAD_REQUEST, {
      fields: details,
    });
  }
}
