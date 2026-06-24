import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';

import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProd = process.env.NODE_ENV === 'production';

  // ✅ TRUST PROXY
  if (isProd) {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1);
  }

  // 🍪 COOKIE PARSER
  app.use(cookieParser());

  // 🛡️ SECURITY
  app.use(helmet());

  // 🌍 CORS
  app.enableCors({
    origin: isProd
      ? ['https://yourdomain.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // ✅ VALIDATION (🔥 UPDATED)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,

      // 🔥 IMPORTANT ADDITION
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 🔄 INTERCEPTORS
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());

  // ❌ EXCEPTION FILTER
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(4000);
}

bootstrap();
