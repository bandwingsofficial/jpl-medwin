// src/modules/coupon/coupon.module.ts

import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

import { AuthModule } from '@/modules/auth/auth.module';

import { TOKENS } from '@/common/constants/tokens';

// =======================
// CONTROLLERS
// =======================

import { AdminCouponController } from './presentation/controllers/admin-coupon.controller';

import { PublicCouponController } from './presentation/controllers/public-coupon.controller';

// =======================
// USE CASES
// =======================

import { CreateCouponUseCase } from './application/use-cases/create-coupon.use-case';

import { UpdateCouponUseCase } from './application/use-cases/update-coupon.use-case';

import { GetCouponUseCase } from './application/use-cases/get-coupon.use-case';

import { ListCouponsUseCase } from './application/use-cases/list-coupons.use-case';

import { ValidateCouponUseCase } from './application/use-cases/validate-coupon.use-case';

import { RedeemCouponUseCase } from './application/use-cases/redeem-coupon.use-case';

import { ActivateCouponUseCase } from './application/use-cases/activate-coupon.use-case';

import { DeactivateCouponUseCase } from './application/use-cases/deactivate-coupon.use-case';

import { RestoreCouponUseCase } from './application/use-cases/restore-coupon.use-case';

import { DeleteCouponUseCase } from './application/use-cases/delete-coupon.use-case';

// =======================
// APPLICATION SERVICES
// =======================

import { CouponApplicationService } from './application/services/coupon-application.service';

// =======================
// DOMAIN SERVICES
// =======================

import { CouponDomainService } from './domain/services/coupon-domain.service';

// =======================
// REPOSITORY
// =======================

import { PrismaCouponRepository } from './infrastructure/persistence/prisma/repositories/prisma-coupon.repository';

@Module({
  imports: [PrismaModule, AuthModule],

  controllers: [
    // =======================
    // CONTROLLERS
    // =======================

    AdminCouponController,

    PublicCouponController,
  ],

  providers: [
    // =======================
    // USE CASES
    // =======================

    CreateCouponUseCase,

    UpdateCouponUseCase,

    GetCouponUseCase,

    ListCouponsUseCase,

    ValidateCouponUseCase,

    RedeemCouponUseCase,

    ActivateCouponUseCase,

    DeactivateCouponUseCase,

    RestoreCouponUseCase,

    DeleteCouponUseCase,

    // =======================
    // APPLICATION SERVICES
    // =======================

    CouponApplicationService,

    // =======================
    // DOMAIN SERVICES
    // =======================

    CouponDomainService,

    // =======================
    // REPOSITORY
    // =======================

    {
      provide: TOKENS.COUPON_REPO,

      useClass: PrismaCouponRepository,
    },
  ],

  exports: [
    TOKENS.COUPON_REPO,

    CouponApplicationService,

    ValidateCouponUseCase,

    RedeemCouponUseCase,
  ],
})
export class CouponModule {}
