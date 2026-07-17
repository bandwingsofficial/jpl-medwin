import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: any = {
      success: false,

      message: 'Internal server error',

      errorCode: 'INTERNAL_ERROR',
    };

    // =======================
    // 🔥 HTTP EXCEPTIONS
    // =======================

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res: any = exception.getResponse();

      // =======================
      // 📦 OBJECT RESPONSE
      // =======================

      if (typeof res === 'object') {
        errorResponse = {
          success: false,

          ...res,
        };
      }

      // =======================
      // 📝 STRING RESPONSE
      // =======================
      else {
        errorResponse.message = res;
      }
    }

    // =======================
    // 🔥 UNKNOWN ERRORS
    // =======================
    else {
      if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = exception?.stack;
      }
    }

    response.status(status).json(errorResponse);
  }
}
