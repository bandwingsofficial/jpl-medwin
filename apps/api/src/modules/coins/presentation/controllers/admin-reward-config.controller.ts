import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { CreateRewardConfigUseCase } from '../../application/use-cases/config/create-reward-config.use-case';
import { UpdateRewardConfigUseCase } from '../../application/use-cases/config/update-reward-config.use-case';
import { GetRewardConfigUseCase } from '../../application/use-cases/config/get-reward-config.use-case';

import { CreateRewardConfigDto } from '../dto/config/create-reward-config.dto';
import { UpdateRewardConfigDto } from '../dto/config/update-reward-config.dto';

@Controller('admin/coins/config')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminRewardConfigController {
  constructor(
    private readonly createRewardConfigUseCase: CreateRewardConfigUseCase,
    private readonly updateRewardConfigUseCase: UpdateRewardConfigUseCase,
    private readonly getRewardConfigUseCase: GetRewardConfigUseCase,
  ) {}

  @Post()
  async createConfig(
    @Body()
    body: CreateRewardConfigDto,
  ) {
    return this.createRewardConfigUseCase.execute(body);
  }

  @Patch(':id')
  async updateConfig(
    @Param('id')
    id: string,

    @Body()
    body: UpdateRewardConfigDto,
  ) {
    return this.updateRewardConfigUseCase.execute({
      id,
      ...body,
    });
  }

  @Get()
  async getActiveConfig() {
    return this.getRewardConfigUseCase.execute({
      activeOnly: true,
    });
  }

  @Get(':id')
  async getConfigById(
    @Param('id')
    id: string,
  ) {
    return this.getRewardConfigUseCase.execute({
      id,
    });
  }
}
