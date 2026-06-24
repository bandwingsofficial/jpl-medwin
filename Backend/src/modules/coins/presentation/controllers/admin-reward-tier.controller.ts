import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { RewardTierStatus } from '../../domain/enums/reward-tier-status.enum';

import { CreateTierUseCase } from '../../application/use-cases/tiers/create-tier.use-case';
import { UpdateTierUseCase } from '../../application/use-cases/tiers/update-tier.use-case';
import { AssignTierUseCase } from '../../application/use-cases/tiers/assign-tier.use-case';
import { ListTiersUseCase } from '../../application/use-cases/tiers/list-tiers.use-case';

import { CreateRewardTierDto } from '../dto/tiers/create-reward-tier.dto';
import { UpdateRewardTierDto } from '../dto/tiers/update-reward-tier.dto';

@Controller('admin/coins/tiers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminRewardTierController {
  constructor(
    private readonly createTierUseCase: CreateTierUseCase,
    private readonly updateTierUseCase: UpdateTierUseCase,
    private readonly assignTierUseCase: AssignTierUseCase,
    private readonly listTiersUseCase: ListTiersUseCase,
  ) {}

  @Post()
  async createTier(
    @Body()
    body: CreateRewardTierDto,
  ) {
    return this.createTierUseCase.execute(body);
  }

  @Patch(':id')
  async updateTier(
    @Param('id')
    id: string,

    @Body()
    body: UpdateRewardTierDto,
  ) {
    return this.updateTierUseCase.execute({
      id,
      ...body,
    });
  }

  @Get()
  async listTiers(
    @Query('status')
    status?: RewardTierStatus,

    @Query('activeOnly')
    activeOnly?: string,
  ) {
    return this.listTiersUseCase.execute({
      status,
      activeOnly: activeOnly === 'true',
    });
  }

  @Get(':id')
  async getTier(
    @Param('id')
    id: string,
  ) {
    return this.listTiersUseCase.execute();
  }

  @Post('assign/:userId')
  async assignTier(
    @Param('userId')
    userId: string,
  ) {
    return this.assignTierUseCase.execute({
      userId,
    });
  }
}
