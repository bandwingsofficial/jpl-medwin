// src/modules/brand/presentation/controllers/public-brand.controller.ts

import { Controller, Get } from '@nestjs/common';

import { GetBrandsUseCase } from '../../application/use-cases/get-brands.use-case';

@Controller('brands')
export class PublicBrandController {
  constructor(private readonly getBrandsUseCase: GetBrandsUseCase) {}

  // =======================
  // 📥 GET ALL BRANDS
  // =======================

  @Get()
  async getBrands() {
    return this.getBrandsUseCase.execute();
  }
}
