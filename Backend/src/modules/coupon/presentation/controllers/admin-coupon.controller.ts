// src/modules/coupon/presentation/controllers/admin-coupon.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';

import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { CouponStatus } from '../../domain/enums/coupon-status.enum';

import { CreateCouponUseCase } from '../../application/use-cases/create-coupon.use-case';

import { UpdateCouponUseCase } from '../../application/use-cases/update-coupon.use-case';

import { GetCouponUseCase } from '../../application/use-cases/get-coupon.use-case';

import { ListCouponsUseCase } from '../../application/use-cases/list-coupons.use-case';

import { ValidateCouponUseCase } from '../../application/use-cases/validate-coupon.use-case';

import { RedeemCouponUseCase } from '../../application/use-cases/redeem-coupon.use-case';

import { ActivateCouponUseCase } from '../../application/use-cases/activate-coupon.use-case';

import { DeactivateCouponUseCase } from '../../application/use-cases/deactivate-coupon.use-case';

import { RestoreCouponUseCase } from '../../application/use-cases/restore-coupon.use-case';

import { DeleteCouponUseCase } from '../../application/use-cases/delete-coupon.use-case';

import { CreateCouponDto } from '../dto/create-coupon.dto';

import { UpdateCouponDto } from '../dto/update-coupon.dto';

@Controller('admin/coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminCouponController {
  constructor(
    private readonly createCouponUseCase: CreateCouponUseCase,

    private readonly updateCouponUseCase: UpdateCouponUseCase,

    private readonly getCouponUseCase: GetCouponUseCase,

    private readonly listCouponsUseCase: ListCouponsUseCase,

    private readonly validateCouponUseCase: ValidateCouponUseCase,

    private readonly redeemCouponUseCase: RedeemCouponUseCase,

    private readonly activateCouponUseCase: ActivateCouponUseCase,

    private readonly deactivateCouponUseCase: DeactivateCouponUseCase,

    private readonly restoreCouponUseCase: RestoreCouponUseCase,

    private readonly deleteCouponUseCase: DeleteCouponUseCase,
  ) {}

  // =======================
  // ✨ CREATE
  // =======================

  @Post()
  async createCoupon(@Body() dto: CreateCouponDto) {
    return this.createCouponUseCase.execute(dto);
  }

  // =======================
  // 🔄 UPDATE
  // =======================

  @Patch(':id')
  async updateCoupon(
    @Param('id') id: string,

    @Body() dto: UpdateCouponDto,
  ) {
    return this.updateCouponUseCase.execute({
      couponId: id,

      ...dto,
    });
  }

  // =======================
  // 🔍 GET SINGLE
  // =======================

  @Get(':id')
  async getCoupon(@Param('id') id: string) {
    return this.getCouponUseCase.execute({
      couponId: id,
    });
  }

  // =======================
  // 📋 LIST
  // =======================

  @Get()
  async listCoupons(
    @Query('status')
    status?: CouponStatus,

    @Query('includeDeleted')
    includeDeleted?: string,
  ) {
    return this.listCouponsUseCase.execute({
      status,

      includeDeleted: includeDeleted === 'true',
    });
  }

  // =======================
  // 🛡 VALIDATE
  // =======================

  @Post('validate')
  async validateCoupon(
    @Body()
    body: {
      couponCode: string;

      subtotal: number;

      userId?: string;
    },
  ) {
    return this.validateCouponUseCase.execute({
      couponCode: body.couponCode,

      subtotal: body.subtotal,

      userId: body.userId,
    });
  }

  // =======================
  // 🎟 REDEEM
  // =======================

  @Post('redeem')
  async redeemCoupon(
    @Body()
    body: {
      couponId: string;

      userId: string;

      orderId: string;

      discountAmount: number;
    },
  ) {
    return this.redeemCouponUseCase.execute({
      couponId: body.couponId,

      userId: body.userId,

      orderId: body.orderId,

      discountAmount: body.discountAmount,
    });
  }

  // =======================
  // ✅ ACTIVATE
  // =======================

  @Patch(':id/activate')
  async activateCoupon(@Param('id') id: string) {
    return this.activateCouponUseCase.execute({
      couponId: id,
    });
  }

  // =======================
  // 🚫 DEACTIVATE
  // =======================

  @Patch(':id/deactivate')
  async deactivateCoupon(@Param('id') id: string) {
    return this.deactivateCouponUseCase.execute({
      couponId: id,
    });
  }

  // =======================
  // ♻️ RESTORE
  // =======================

  @Patch(':id/restore')
  async restoreCoupon(@Param('id') id: string) {
    return this.restoreCouponUseCase.execute({
      couponId: id,
    });
  }

  // =======================
  // 🗑 DELETE
  // =======================

  @Delete(':id')
  async deleteCoupon(@Param('id') id: string) {
    return this.deleteCouponUseCase.execute({
      couponId: id,
    });
  }
}