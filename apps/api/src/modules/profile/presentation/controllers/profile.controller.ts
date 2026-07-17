// src/modules/profile/presentation/controllers/profile.controller.ts

import {
  Body,
  Controller,
  Get,
  Delete,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { AuthRequest } from '@/modules/auth/types/auth-request.type';

import { multerConfig } from '@/modules/upload/infrastructure/multer.config';

import { UploadImageUseCase } from '@/modules/upload/application/upload-image.usecase';

import { CreateProfileDto } from '../dto/create-profile.dto';

import { UpdateProfileDto } from '../dto/update-profile.dto';

import { CreateProfileUseCase } from '../../application/use-cases/create-profile.use-case';

import { UpdateProfileUseCase } from '../../application/use-cases/update-profile.use-case';

import { GetProfileUseCase } from '../../application/use-cases/get-profile.use-case';

import { DeleteProfileUseCase } from '../../application/use-cases/delete-profile.use-case';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,

    private readonly updateProfileUseCase: UpdateProfileUseCase,

    private readonly getProfileUseCase: GetProfileUseCase,

    private readonly uploadUseCase: UploadImageUseCase,
    private readonly deleteProfileUseCase: DeleteProfileUseCase,
  ) {}

  // =======================
  // ✨ CREATE PROFILE
  // =======================

  @Post()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async createProfile(
    @Req() req: AuthRequest,

    @UploadedFile() file?: Express.Multer.File,

    @Body() dto?: CreateProfileDto,
  ) {
    let avatarUrl: string | undefined;

    // =======================
    // ⬆️ UPLOAD IMAGE
    // =======================

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'profiles');

      avatarUrl = upload.url;
    }

    // =======================
    // ✨ CREATE
    // =======================

    return this.createProfileUseCase.execute({
      userId: req.user.userId,

      name: dto?.name,
      email: dto?.email,
      phoneNumber: dto?.phoneNumber,

      avatarUrl,
    });
  }

  // =======================
  // 🔄 UPDATE PROFILE
  // =======================

  @Patch()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async updateProfile(
    @Req() req: AuthRequest,

    @UploadedFile() file?: Express.Multer.File,

    @Body() dto?: UpdateProfileDto,
  ) {
    // =======================
    // 🔍 EXISTING PROFILE
    // =======================

    const existingProfile = await this.getProfileUseCase.execute(req.user.userId);

    let avatarUrl = existingProfile.avatarUrl;

    // =======================
    // ⬆️ UPLOAD NEW IMAGE
    // =======================

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'profiles');

      avatarUrl = upload.url;
    }

    // =======================
    // 🔄 UPDATE PROFILE
    // =======================

    const updatedProfile = await this.updateProfileUseCase.execute({
      userId: req.user.userId,

      name: dto?.name,
      email: dto?.email,
      phoneNumber: dto?.phoneNumber,

      avatarUrl,
    });

    // =======================
    // 🗑️ DELETE OLD IMAGE
    // =======================

    if (file && existingProfile.avatarUrl) {
      await this.uploadUseCase.delete(existingProfile.avatarUrl);
    }

    return updatedProfile;
  }

  // =======================
  // 👤 GET MY PROFILE
  // =======================

  @Get()
  async getProfile(@Req() req: AuthRequest) {
    return this.getProfileUseCase.execute(req.user.userId);
  }
  // =======================
  // 🗑️ DELETE PROFILE
  // =======================

  @Delete()
  async deleteProfile(@Req() req: AuthRequest) {
    // =======================
    // 🔍 GET PROFILE
    // =======================

    const profile = await this.getProfileUseCase.execute(req.user.userId);

    // =======================
    // 🗑️ DELETE PROFILE
    // =======================

    await this.deleteProfileUseCase.execute(req.user.userId);

    // =======================
    // 🖼️ DELETE AVATAR
    // =======================

    if (profile.avatarUrl) {
      await this.uploadUseCase.delete(profile.avatarUrl);
    }

    return {
      success: true,
      message: 'Profile deleted successfully',
    };
  }
}
