// src/modules/brand/presentation/controllers/admin-brand.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';

import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { multerConfig } from '@/modules/upload/infrastructure/multer.config';

import { UploadImageUseCase } from '@/modules/upload/application/upload-image.usecase';

import { TOKENS } from '@/common/constants/tokens';

import { BrandRepository } from '../../domain/repositories/brand.repository';

import { BrandStatus } from '../../domain/enums/brand-status.enum';

import { CreateBrandUseCase } from '../../application/use-cases/create-brand.use-case';

import { UpdateBrandUseCase } from '../../application/use-cases/update-brand.use-case';

import { DeleteBrandUseCase } from '../../application/use-cases/delete-brand.use-case';

import { UpdateBrandStatusUseCase } from '../../application/use-cases/update-brand-status.use-case';

import { CreateBrandDto } from '../../application/dto/create-brand.dto';

import { UpdateBrandDto } from '../../application/dto/update-brand.dto';

@Controller('admin/brands')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminBrandController {
  constructor(
    private readonly createBrandUseCase: CreateBrandUseCase,

    private readonly updateBrandUseCase: UpdateBrandUseCase,

    private readonly deleteBrandUseCase: DeleteBrandUseCase,

    private readonly updateBrandStatusUseCase: UpdateBrandStatusUseCase,

    private readonly uploadUseCase: UploadImageUseCase,

    @Inject(TOKENS.BRAND_REPO)
    private readonly brandRepo: BrandRepository,
  ) {}

  // =======================
  // ✨ CREATE
  // =======================

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createBrand(
    @UploadedFile() file: Express.Multer.File,

    @Body() dto: CreateBrandDto,
  ) {
    let imageUrl = dto.imageUrl;

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'brands');

      imageUrl = upload.url;
    }

    return this.createBrandUseCase.execute({
      ...dto,
      imageUrl,
    });
  }

  // =======================
  // 🔄 UPDATE
  // =======================

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateBrand(
    @Param('id') id: string,

    @UploadedFile() file: Express.Multer.File,

    @Body() dto: UpdateBrandDto,
  ) {
    const existing = await this.brandRepo.findById(id);

    if (!existing) {
      throw new Error('Brand not found');
    }

    let imageUrl = existing.imageUrl;

    // upload new
    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'brands');

      imageUrl = upload.url;
    }

    // update db
    const brand = await this.updateBrandUseCase.execute({
      id,
      ...dto,
      imageUrl,
    });

    // delete old image
    if (file && existing.imageUrl) {
      await this.uploadUseCase.delete(existing.imageUrl);
    }

    return brand;
  }

  // =======================
  // 🚫 STATUS
  // =======================

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,

    @Body()
    body: {
      status: 'ACTIVE' | 'INACTIVE';
    },
  ) {
    return this.updateBrandStatusUseCase.execute({
      id,
      status: BrandStatus[body.status],
    });
  }

  // =======================
  // 🗑 DELETE
  // =======================

  @Delete(':id')
  async deleteBrand(
    @Param('id') id: string,

    @Query('force') force?: string,

    @Query('preview') preview?: string,
  ) {
    const existing = await this.brandRepo.findById(id);

    if (!existing) {
      throw new Error('Brand not found');
    }

    const result = await this.deleteBrandUseCase.execute(id, force === 'true', preview === 'true');

    if (existing.imageUrl) {
      await this.uploadUseCase.delete(existing.imageUrl);
    }

    return result;
  }
}
