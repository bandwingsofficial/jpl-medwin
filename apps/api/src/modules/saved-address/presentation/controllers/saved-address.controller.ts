// src/modules/saved-address/presentation/controllers/saved-address.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { AuthRequest } from '@/modules/auth/types/auth-request.type';
import { CreateSavedAddressUseCase } from '../../application/use-cases/create-saved-address.use-case';
import { UpdateSavedAddressUseCase } from '../../application/use-cases/update-saved-address.use-case';
import { DeleteSavedAddressUseCase } from '../../application/use-cases/delete-saved-address.use-case';
import { GetSavedAddressesUseCase } from '../../application/use-cases/get-saved-addresses.use-case';
import { CreateSavedAddressDto } from '../dto/create-saved-address.dto';
import { UpdateSavedAddressDto } from '../dto/update-saved-address.dto';

@Controller('saved-addresses')
@UseGuards(JwtAuthGuard)
export class SavedAddressController {
  constructor(
    private readonly createAddress: CreateSavedAddressUseCase,
    private readonly updateAddress: UpdateSavedAddressUseCase,
    private readonly deleteAddress: DeleteSavedAddressUseCase,
    private readonly getAddresses: GetSavedAddressesUseCase,
  ) {}

  // =======================
  // ➕ CREATE
  // =======================

  @Post()
  async create(
    @Req() req: AuthRequest,

    @Body()
    dto: CreateSavedAddressDto,
  ) {
    return this.createAddress.execute({
      userId: req.user.userId,

      ...dto,
    });
  }

  // =======================
  // 📦 GET ALL
  // =======================

  @Get()
  async getAll(
    @Req() req: AuthRequest,

    @Query('includeDeleted')
    includeDeleted?: string,
  ) {
    return this.getAddresses.execute({
      userId: req.user.userId,

      includeDeleted: includeDeleted === 'true',
    });
  }

  // =======================
  // ✏️ UPDATE
  // =======================

  @Patch(':id')
  async update(
    @Param('id') id: string,

    @Req() req: AuthRequest,

    @Body()
    dto: UpdateSavedAddressDto,
  ) {
    return this.updateAddress.execute({
      id,

      userId: req.user.userId,

      ...dto,
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  @Delete(':id')
  async delete(
    @Param('id') id: string,

    @Req() req: AuthRequest,
  ) {
    return this.deleteAddress.execute({
      id,

      userId: req.user.userId,
    });
  }
}
