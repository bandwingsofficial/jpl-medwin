import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { ErrorCode } from '@/common/constants/error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: any = {
      success: false,

      message: 'Unexpected server error',

      errorCode: 'INTERNAL_ERROR',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res: any = exception.getResponse();

      if (typeof res === 'object') {
        errorResponse = {
          success: false,
          ...res,
        };
      } else {
        errorResponse.message = res;
      }
    } else if (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception?.name === 'PrismaClientKnownRequestError'
    ) {
      this.logger.error(
        `Prisma error [${exception.code}]: ${exception.message}`,
        exception.stack,
      );

      const mapped = this.mapPrismaError(exception);

      status = mapped.status;
      errorResponse = mapped.body;
    } else {
      this.logger.error(
        `Unhandled exception: ${exception?.message || exception}`,
        exception?.stack,
      );

      if (process.env.NODE_ENV !== 'production') {
        errorResponse.message = exception?.message || errorResponse.message;
        errorResponse.stack = exception?.stack;
      }
    }

    if (errorResponse.errorCode && ERROR_MESSAGE_MAP[errorResponse.errorCode]) {
      errorResponse.message = ERROR_MESSAGE_MAP[errorResponse.errorCode];
    }

    response.status(status).json(errorResponse);
  }

  private mapPrismaError(error: Prisma.PrismaClientKnownRequestError | any) {
    const code = error.code as string;
    const target = Array.isArray(error.meta?.target)
      ? (error.meta.target as string[]).join(', ')
      : String(error.meta?.target ?? '');

    if (code === 'P2002') {
      const isSku = target.toLowerCase().includes('sku');

      return {
        status: HttpStatus.CONFLICT,
        body: {
          success: false,
          message: isSku ? 'This SKU already exists.' : 'A duplicate record already exists.',
          errorCode: isSku ? ErrorCode.VARIANT.SKU_EXISTS : ErrorCode.PRODUCT.INVALID,
          details: { target },
        },
      };
    }

    if (code === 'P2003') {
      const field = String(error.meta?.field_name ?? '');

      let message = 'A related record was not found.';

      if (field.includes('brandId')) {
        message = 'Selected Brand does not exist.';
      } else if (field.includes('categoryId')) {
        message = 'Selected Category does not exist.';
      } else if (field.includes('subCategoryId')) {
        message = 'Selected Sub Category does not exist.';
      } else if (field.includes('miniCategoryId')) {
        message = 'Selected Mini Category does not exist.';
      }

      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          success: false,
          message,
          errorCode: ErrorCode.PRODUCT.INVALID,
          details: { field },
        },
      };
    }

    if (code === 'P2025') {
      return {
        status: HttpStatus.NOT_FOUND,
        body: {
          success: false,
          message: 'The requested record was not found.',
          errorCode: ErrorCode.PRODUCT.NOT_FOUND,
        },
      };
    }

    if (code === 'P2022') {
      const column = String(error.meta?.column ?? '');
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          success: false,
          message: process.env.NODE_ENV !== 'production'
            ? `Database column does not exist: ${column}`
            : 'A database schema error occurred.',
          errorCode: 'DATABASE.SCHEMA_MISMATCH',
          details: { code, column },
        },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        message: 'A database error occurred.',
        errorCode: 'DATABASE.ERROR',
        details: { code },
      },
    };
  }
}

const ERROR_MESSAGE_MAP: Record<string, string> = {
  [ErrorCode.BRAND.NOT_FOUND]: 'Brand not found.',
  [ErrorCode.CATEGORY.NOT_FOUND]: 'Category does not exist.',
  [ErrorCode.CATEGORY.SUB_NOT_FOUND]: 'Sub Category does not exist.',
  [ErrorCode.CATEGORY.MINI_NOT_FOUND]: 'Mini Category does not exist.',
  [ErrorCode.CATEGORY.INVALID_HIERARCHY]:
    'Mini Category does not belong to the selected Sub Category.',
  [ErrorCode.VARIANT.SKU_EXISTS]: 'This SKU already exists.',
  [ErrorCode.VARIANT.INVALID]: 'Variant validation failed.',
  [ErrorCode.PRODUCT.INVALID]: 'Product validation failed.',
  [ErrorCode.BRAND.INVALID]: 'Brand SKU Prefix not configured.',
};
