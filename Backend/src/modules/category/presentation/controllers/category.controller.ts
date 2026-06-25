import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ParseBoolPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '@/modules/upload/infrastructure/multer.config';
import { UploadImageUseCase } from '@/modules/upload/application/upload-image.usecase';

import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '../../../category/domain/repositories/category.repository';
import { SubCategoryRepository } from '../../../category/domain/repositories/sub-category.repository';
import { MiniCategoryRepository } from '../../../category/domain/repositories/mini-category.repository';

import { UserRole } from '../../../auth/domain/enums/user-role.enum';
import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { CreateCategoryUseCase } from '../../application/usecases/category/create-category.usecase';
import { CreateSubCategoryUseCase } from '../../../category/application/usecases/sub-category/create-sub-category.usecase';
import { CreateMiniCategoryUseCase } from '../../../category/application/usecases/mini-category/create-mini-category.usecase';

import { UpdateCategoryUseCase } from '../../../category/application/usecases/category/update-category.usecase';
import { UpdateSubCategoryUseCase } from '../../../category/application/usecases/sub-category/update-sub-category.usecase';
import { UpdateMiniCategoryUseCase } from '../../../category/application/usecases/mini-category/update-mini-category.usecase';

import { DeleteCategoryUseCase } from '../../../category/application/usecases/category/delete-category.usecase';
import { DeleteSubCategoryUseCase } from '../../../category/application/usecases/sub-category/delete-sub-category.usecase';
import { DeleteMiniCategoryUseCase } from '../../../category/application/usecases/mini-category/delete-mini-category.usecase';

import { GetCategoryTreeUseCase } from '../../../category/application/usecases/get-category-tree.usecase';

import { GetCategoriesUseCase } from '../../application/usecases/category/get-categories.usecase';
import { GetSubCategoriesUseCase } from '../../application/usecases/sub-category/get-sub-categories.usecase';
import { GetMiniCategoriesUseCase } from '../../application/usecases/mini-category/get-mini-categories.usecase';

import { CategoryStatus } from '../../domain/enums/category-status.enum';
import { UpdateCategoryStatusUseCase } from '../../application/usecases/category/update-category-status.usecase';
import { UpdateSubCategoryStatusUseCase } from '../../application/usecases/sub-category/update-sub-category-status.usecase';
import { UpdateMiniCategoryStatusUseCase } from '../../application/usecases/mini-category/update-mini-category-status.usecase';

import { CreateSubCategoryDto } from '../../application/dto/create-sub-category.dto';
import { CreateCategoryDto } from '../../application/dto/create-category.dto';
import { CreateMiniCategoryDto } from '../../application/dto/create-mini-category.dto';
import { UpdateCategoryDto } from '../../application/dto/update-category.dto';
import { UpdateSubCategoryDto } from '../../application/dto/update-sub-category.dto';
import { UpdateMiniCategoryDto } from '../../application/dto/update-mini-category.dto';

@Controller('admin/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminCategoryController {
  constructor(
    // CREATE
    private readonly createCategory: CreateCategoryUseCase,
    private readonly createSub: CreateSubCategoryUseCase,
    private readonly createMini: CreateMiniCategoryUseCase,

    // UPDATE
    private readonly updateCategory: UpdateCategoryUseCase,
    private readonly updateSub: UpdateSubCategoryUseCase,
    private readonly updateMini: UpdateMiniCategoryUseCase,

    // DELETE
    private readonly deleteCategory: DeleteCategoryUseCase,
    private readonly deleteSub: DeleteSubCategoryUseCase,
    private readonly deleteMini: DeleteMiniCategoryUseCase,

    // STATUS
    private readonly updateStatus: UpdateCategoryStatusUseCase,
    private readonly updateSubStatus: UpdateSubCategoryStatusUseCase,
    private readonly updateMiniStatus: UpdateMiniCategoryStatusUseCase,

    // READ
    private readonly getTree: GetCategoryTreeUseCase,
    private readonly getCategories: GetCategoriesUseCase,
    private readonly getSubs: GetSubCategoriesUseCase,
    private readonly getMinis: GetMiniCategoriesUseCase,

    // 🔥 S3
    private readonly uploadUseCase: UploadImageUseCase,

    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,

    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subRepo: SubCategoryRepository,

    @Inject(TOKENS.MINI_CATEGORY_REPO)
    private readonly miniRepo: MiniCategoryRepository,
  ) {}

  // ================= CREATE =================
  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateCategoryDto) {
    let imageUrl = dto.imageUrl;

    // =======================
    // UPLOAD FIRST
    // =======================
    console.time('upload');

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'categories');
      console.timeEnd('upload');

      imageUrl = upload.url;
    }

    // =======================
    // CREATE CATEGORY
    // =======================
    console.time('create');
    return this.createCategory.execute({
      ...dto,
      imageUrl,
    });
    console.timeEnd('create');
  }

  @Post('sub')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createSubCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateSubCategoryDto,
  ) {
    let imageUrl = dto.imageUrl;

    // =======================
    // UPLOAD FIRST
    // =======================

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'sub-categories');

      imageUrl = upload.url;
    }

    // =======================
    // CREATE SUB CATEGORY
    // =======================

    return this.createSub.execute({
      ...dto,
      imageUrl,
    });
  }

  @Post('mini')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createMiniCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateMiniCategoryDto,
  ) {
    let imageUrl = dto.imageUrl;

    // =======================
    // UPLOAD FIRST
    // =======================

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'mini-categories');

      imageUrl = upload.url;
    }

    // =======================
    // CREATE MINI CATEGORY
    // =======================

    return this.createMini.execute({
      ...dto,
      imageUrl,
    });
  }

  // ================= UPDATE =================

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateCategoryDto,
  ) {
    const existing = await this.categoryRepo.findById(id);
    if (!existing) throw new Error('Category not found');

    let imageUrl = existing.imageUrl;

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'categories');
      imageUrl = upload.url;
    }

    const result = await this.updateCategory.execute({
      id,
      ...dto,
      imageUrl,
    });

    // ✅ delete old AFTER success
    if (file && existing.imageUrl) {
      await this.uploadUseCase.delete(existing.imageUrl);
    }

    return result;
  }

  @Patch('sub/:id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateSubCategory(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    const existing = await this.subRepo.findById(id);
    if (!existing) throw new Error('SubCategory not found');

    let imageUrl = existing.imageUrl;

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'sub-categories');
      imageUrl = upload.url;
    }

    const result = await this.updateSub.execute({
      id,
      ...dto,
      imageUrl,
    });

    if (file && existing.imageUrl) {
      await this.uploadUseCase.delete(existing.imageUrl);
    }

    return result;
  }

  @Patch('mini/:id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateMiniCategory(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateMiniCategoryDto,
  ) {
    const existing = await this.miniRepo.findById(id);
    if (!existing) throw new Error('MiniCategory not found');

    let imageUrl = existing.imageUrl;

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'mini-categories');
      imageUrl = upload.url;
    }

    const result = await this.updateMini.execute({
      id,
      ...dto,
      imageUrl,
    });

    if (file && existing.imageUrl) {
      await this.uploadUseCase.delete(existing.imageUrl);
    }

    return result;
  }

  // ================= DELETE =================

  @Delete(':id')
  async deleteCategoryHandler(
    @Param('id') id: string,
    @Query('force') force?: string,
    @Query('preview') preview?: string,
  ) {
    const isForce = force === 'true';
    const isPreview = preview === 'true';

    const existing = await this.categoryRepo.findById(id);
    if (!existing) throw new Error('Category not found');

    const result = await this.deleteCategory.execute(id, isForce, isPreview);

    if (!isPreview && existing.imageUrl) {
      await this.uploadUseCase.delete(existing.imageUrl);
    }

    return result;
  }

  @Delete('sub/:id')
  async deleteSubCategory(
    @Param('id') id: string,
    @Query('force') force?: string,
    @Query('preview') preview?: string,
  ) {
    const isForce = force === 'true';
    const isPreview = preview === 'true';

    const existing = await this.subRepo.findById(id);
    if (!existing) throw new Error('SubCategory not found');

    const result = await this.deleteSub.execute(id, isForce, isPreview);

    if (!isPreview && existing.imageUrl) {
      await this.uploadUseCase.delete(existing.imageUrl);
    }

    return result;
  }

  @Delete('mini/:id')
  async deleteMiniCategory(
    @Param('id') id: string,
    @Query('force') force?: string,
    @Query('preview') preview?: string,
  ) {
    const isForce = force === 'true';
    const isPreview = preview === 'true';

    const existing = await this.miniRepo.findById(id);
    if (!existing) throw new Error('MiniCategory not found');

    const result = await this.deleteMini.execute(id, isForce, isPreview);

    if (!isPreview && existing.imageUrl) {
      await this.uploadUseCase.delete(existing.imageUrl);
    }

    return result;
  }

  // ================= STATUS =================
  @Patch(':id/status')
  async updateStatusHandler(@Param('id') id: string, @Body('status') status: CategoryStatus) {
    return this.updateStatus.execute({ id, status });
  }

  @Patch('sub/:id/status')
  async updateSubStatusHandler(@Param('id') id: string, @Body('status') status: CategoryStatus) {
    return this.updateSubStatus.execute({ id, status });
  }

  @Patch('mini/:id/status')
  async updateMiniStatusHandler(@Param('id') id: string, @Body('status') status: CategoryStatus) {
    return this.updateMiniStatus.execute({ id, status });
  }

  // ================= READ =================

  @Get('tree')
  getTreeAll() {
    return this.getTree.execute(false);
  }

  @Get()
  getAll() {
    return this.getCategories.execute(false);
  }

  @Get('sub')
  getSubsAll(@Query('categoryId') categoryId?: string) {
    return this.getSubs.execute({
      categoryId,
      onlyActive: false,
    });
  }

  @Get('mini')
  getMinisAll(@Query('subCategoryId') subCategoryId?: string) {
    return this.getMinis.execute({
      subCategoryId,
      onlyActive: false,
    });
  }
}
