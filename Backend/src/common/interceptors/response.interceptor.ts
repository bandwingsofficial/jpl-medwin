import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ) {
    return next.handle().pipe(
      map((response) => {
        // =======================
        // CUSTOM MESSAGE
        // =======================

        if (response?.message) {
          const {
            message,
            data,
            pagination,
            ...rest
          } = response;

          return {
            success: true,

            message,

            ...(data !== undefined && {
              data,
            }),

            ...(pagination && {
              pagination,
            }),

            ...rest,
          };
        }

        // =======================
        // DEFAULT RESPONSE
        // =======================

        return {
          success: true,

          message: 'Request successful',

          data: response ?? null,
        };
      }),
    );
  }
}