import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const { method, url, ip } = req;
    const user = req.user;

    return next.handle().pipe(
      tap(() => {
        const time = Date.now() - now;

        console.log(
          `✅ [${method}] ${url} ${ip} - ${res.statusCode} - ${time}ms`,
          user?.sub ? `| user: ${user.sub}` : '',
          user?.sessionId ? `| session: ${user.sessionId}` : '',
        );
      }),

      catchError((err) => {
        const time = Date.now() - now;

        console.error(
          `❌ [${method}] ${url} ${ip} - ${res.statusCode || 500} - ${time}ms`,
          '\nError:',
          err?.message,
          user?.sub ? `| user: ${user.sub}` : '',
          user?.sessionId ? `| session: ${user.sessionId}` : '',
        );

        return throwError(() => err);
      }),
    );
  }
}
