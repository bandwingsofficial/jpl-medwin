import { Controller, Get, Param } from '@nestjs/common';

import { GetBannerUseCase } from '../../application/use-cases/get-banner.use-case';
import { ListBannersUseCase } from '../../application/use-cases/list-banners.use-case';

import { BannerType } from '../../domain/enums/banner-type.enum';

@Controller('banners')
export class PublicBannerController {
  constructor(
    private readonly getBannerUseCase: GetBannerUseCase,

    private readonly listBannersUseCase: ListBannersUseCase,
  ) {}

  // =======================
  // 📋 ALL BANNERS
  // =======================

  @Get()
  async getBanners() {
    return this.listBannersUseCase.execute();
  }

  // =======================
  // 🔍 SINGLE BANNER
  // =======================

  @Get(':bannerId')
  async getBanner(
    @Param('bannerId')
    bannerId: string,
  ) {
    return this.getBannerUseCase.execute(bannerId);
  }

  // =======================
  // 🔍 BY TYPE
  // =======================

  @Get('type/:type')
  async getBannerByType(
    @Param('type')
    type: BannerType,
  ) {
    return this.listBannersUseCase.execute({
      type,
    });
  }
}
