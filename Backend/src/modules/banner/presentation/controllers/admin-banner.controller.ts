import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Inject,
} from '@nestjs/common';

import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';

import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { multerConfig } from '@/modules/upload/infrastructure/multer.config';

import { UploadImageUseCase } from '@/modules/upload/application/upload-image.usecase';

import { CreateBannerUseCase } from '../../application/use-cases/create-banner.use-case';
import { UpdateBannerUseCase } from '../../application/use-cases/update-banner.use-case';
import { DeleteBannerUseCase } from '../../application/use-cases/delete-banner.use-case';
import { RestoreBannerUseCase } from '../../application/use-cases/restore-banner.use-case';
import { ActivateBannerUseCase } from '../../application/use-cases/activate-banner.use-case';
import { DeactivateBannerUseCase } from '../../application/use-cases/deactivate-banner.use-case';
import { GetBannerUseCase } from '../../application/use-cases/get-banner.use-case';
import { ListBannersUseCase } from '../../application/use-cases/list-banners.use-case';
import { UpdateBannerImageUseCase } from '../../application/use-cases/update-banner-image.use-case';
import { RestoreBannerImageUseCase } from '../../application/use-cases/restore-banner-image.use-case';
import { DeleteBannerImageUseCase } from '../../application/use-cases/delete-banner-image.use-case';
import { AddBannerImageUseCase } from '../../application/use-cases/add-banner-image.use-case';

import { CreateBannerDto } from '../dto/create-banner.dto';
import { UpdateBannerDto } from '../dto/update-banner.dto';
import { UpdateBannerImageDto } from '../dto/update-banner-image.dto';
import { AddBannerImageDto } from '../dto/add-banner-image';

import { BannerStatus } from '../../domain/enums/banner-status.enum';
import { BannerType } from '../../domain/enums/banner-type.enum';
import { BannerImageRepository } from '../../domain/repositories/banner-image.repository';
import { TOKENS } from '@/common/constants/tokens';

@Controller('admin/banners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminBannerController {
  constructor(
    private readonly createBannerUseCase: CreateBannerUseCase,

    private readonly updateBannerUseCase: UpdateBannerUseCase,

    private readonly deleteBannerUseCase: DeleteBannerUseCase,

    private readonly restoreBannerUseCase: RestoreBannerUseCase,

    private readonly activateBannerUseCase: ActivateBannerUseCase,

    private readonly deactivateBannerUseCase: DeactivateBannerUseCase,

    private readonly getBannerUseCase: GetBannerUseCase,

    private readonly listBannersUseCase: ListBannersUseCase,

    private readonly updateBannerImageUseCase: UpdateBannerImageUseCase,

    private readonly restoreBannerImageUseCase: RestoreBannerImageUseCase,

    private readonly deleteBannerImageUseCase: DeleteBannerImageUseCase,

    private readonly addBannerImageUseCase: AddBannerImageUseCase,

    private readonly uploadUseCase: UploadImageUseCase,
    @Inject(TOKENS.BANNER_IMAGE_REPO)
    private readonly bannerImageRepo: BannerImageRepository,
  ) {}

  // =======================
  // =======================
  // ✨ CREATE
  // =======================

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  async createBanner(
    @UploadedFiles()
    files: Express.Multer.File[],

    @Body()
    dto: CreateBannerDto,
  ) {
    const images = await Promise.all(
      (files ?? []).map(async (file, index) => {
        const upload = await this.uploadUseCase.execute(file, 'banners');

        return {
          imageUrl: upload.url,

          productId: dto.images?.[index]?.productId,

          sortOrder: dto.images?.[index]?.sortOrder ?? index,
        };
      }),
    );

    return this.createBannerUseCase.execute({
      name: dto.name,

      type: dto.type,

      images,
    });
  }

  // =======================
  // 🔄 UPDATE BANNER
  // =======================

  @Patch(':bannerId')
  async updateBanner(
    @Param('bannerId')
    bannerId: string,

    @Body()
    dto: UpdateBannerDto,
  ) {
    console.log('DTO:', dto);
    return this.updateBannerUseCase.execute({
      bannerId,
      ...dto,
    });
  }

  // =======================
  // 🔄 UPDATE IMAGE
  // =======================

  @Patch('images/:bannerImageId')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateBannerImage(
    @Param('bannerImageId')
    bannerImageId: string,

    @UploadedFile()
    file: Express.Multer.File,

    @Body()
    dto: UpdateBannerImageDto,
  ) {
    const existing = await this.bannerImageRepo.findById(bannerImageId);

    if (!existing) {
      throw new Error('Banner image not found');
    }

    let imageUrl = existing.imageUrl;

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'banners');

      imageUrl = upload.url;
    }

    const image = await this.updateBannerImageUseCase.execute({
      bannerImageId,

      imageUrl,

      productId: dto.productId,

      sortOrder: dto.sortOrder,
    });

    if (file && existing.imageUrl) {
      await this.uploadUseCase.delete(existing.imageUrl);
    }

    return image;
  }

  @Post(':bannerId/images')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async addImage(
    @Param('bannerId')
    bannerId: string,

    @UploadedFile()
    file: Express.Multer.File,

    @Body()
    dto: AddBannerImageDto,
  ) {
    const upload = await this.uploadUseCase.execute(file, 'banners');

    return this.addBannerImageUseCase.execute({
      bannerId,

      imageUrl: upload.url,

      productId: dto.productId,

      sortOrder: dto.sortOrder,
    });
  }

  // =======================
  // 📋 LIST
  // =======================

  @Get()
  async getBanners(
    @Query('type')
    type?: BannerType,

    @Query('status')
    status?: BannerStatus,
  ) {
    return this.listBannersUseCase.execute({
      type,
      status,
    });
  }

  // =======================
  // 🔍 DETAILS
  // =======================

  @Get(':bannerId')
  async getBanner(
    @Param('bannerId')
    bannerId: string,
  ) {
    return this.getBannerUseCase.execute(bannerId);
  }

  // =======================
  // 🟢 ACTIVATE
  // =======================

  @Patch(':bannerId/activate')
  async activate(
    @Param('bannerId')
    bannerId: string,
  ) {
    await this.activateBannerUseCase.execute(bannerId);

    return {
      success: true,
      message: 'Banner activated successfully',
    };
  }

  // =======================
  // 🔴 DEACTIVATE
  // =======================

  @Patch(':bannerId/deactivate')
  async deactivate(
    @Param('bannerId')
    bannerId: string,
  ) {
    await this.deactivateBannerUseCase.execute(bannerId);

    return {
      success: true,
      message: 'Banner deactivated successfully',
    };
  }

  // =======================
  // ♻️ RESTORE BANNER
  // =======================

  @Patch(':bannerId/restore')
  async restore(
    @Param('bannerId')
    bannerId: string,
  ) {
    await this.restoreBannerUseCase.execute(bannerId);

    return {
      success: true,
      message: 'Banner restored successfully',
    };
  }

  // =======================
  // ♻️ RESTORE IMAGE
  // =======================

  @Patch('images/:bannerImageId/restore')
  async restoreImage(
    @Param('bannerImageId')
    bannerImageId: string,
  ) {
    await this.restoreBannerImageUseCase.execute(bannerImageId);

    return {
      success: true,
      message: 'Banner image restored successfully',
    };
  }

  //   // =======================
  //   // 🗑 DELETE
  //   // =======================

  //   @Delete(':bannerId')
  // async deleteBanner(
  //   @Param('bannerId')
  //   bannerId: string,
  // ) {
  //   const banner =
  //     await this.getBannerUseCase.execute(
  //       bannerId,
  //     );

  //   await this.deleteBannerUseCase.execute(
  //     bannerId,
  //   );

  //   await Promise.all(
  //     banner.images.map(
  //       async (image) => {
  //         if (image.imageUrl) {
  //           try {
  //             await this.uploadUseCase.delete(
  //               image.imageUrl,
  //             );
  //           } catch {
  //             // ignore
  //           }
  //         }
  //       },
  //     ),
  //   );

  //   return {
  //     success: true,
  //     message:
  //       'Banner deleted successfully',
  //   };
  // }

  // @Delete('images/:bannerImageId')
  // async deleteImage(
  //   @Param('bannerImageId')
  //   bannerImageId: string,
  // ) {
  //   const image =
  //     await this.bannerImageRepo.findById(
  //       bannerImageId,
  //     );

  //   if (!image) {
  //     throw new Error(
  //       'Banner image not found',
  //     );
  //   }

  //   // Save URL before delete
  //   const imageUrl =
  //     image.imageUrl;

  //   // Soft delete DB record
  //   await this.deleteBannerImageUseCase.execute(
  //     bannerImageId,
  //   );

  //   // Delete S3 file
  //   if (imageUrl) {
  //     try {
  //       console.log(
  //         'Deleting image:',
  //         imageUrl,
  //       );

  //       await this.uploadUseCase.delete(
  //         imageUrl,
  //       );

  //       console.log(
  //         'S3 delete success',
  //       );
  //     } catch (error) {
  //       console.error(
  //         'S3 delete failed:',
  //         error,
  //       );
  //     }
  //   }

  //   return {
  //     success: true,
  //     message:
  //       'Banner image deleted successfully',
  //   };
  // }

  // =======================
  // 🗑 DELETE BANNER
  // =======================

  @Delete(':bannerId')
  async deleteBanner(
    @Param('bannerId')
    bannerId: string,
  ) {
    await this.deleteBannerUseCase.execute(bannerId);

    return {
      success: true,
      message: 'Banner deleted successfully',
    };
  }

  // =======================
  // 🗑 DELETE IMAGE
  // =======================

  @Delete('images/:bannerImageId')
  async deleteImage(
    @Param('bannerImageId')
    bannerImageId: string,
  ) {
    await this.deleteBannerImageUseCase.execute(bannerImageId);

    return {
      success: true,
      message: 'Banner image deleted successfully',
    };
  }
}
