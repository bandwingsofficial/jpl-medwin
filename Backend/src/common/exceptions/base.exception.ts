import { HttpException, HttpStatus } from '@nestjs/common';

export interface ExceptionPayload {
  success: false;
  message: string;
  errorCode: string;
  details?: Record<string, any>;
}

export class BaseException extends HttpException {
  constructor(
    message: string,
    errorCode: string,
    statusCode: HttpStatus,
    details?: Record<string, any>,
  ) {
    const payload: ExceptionPayload = {
      success: false,
      message,
      errorCode,
      ...(details && { details }),
    };

    super(payload, statusCode);
  }
}
