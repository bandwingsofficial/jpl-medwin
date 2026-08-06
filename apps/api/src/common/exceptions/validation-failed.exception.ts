import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@/common/constants/error-codes';

export type ValidationFieldError = {
  field: string;
  message: string;
};

export class ValidationFailedException extends HttpException {
  constructor(message: string, errors: ValidationFieldError[]) {
    super(
      {
        success: false,
        message,
        errorCode: ErrorCode.VALIDATION.GENERIC,
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
