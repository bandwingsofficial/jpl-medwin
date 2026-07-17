import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';

import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { CreateShippingConfigurationUseCase } from '../../application/use-cases/create-shipping-configuration.use-case';

import { UpdateShippingConfigurationUseCase } from '../../application/use-cases/update-shipping-configuration.use-case';

import { DeleteShippingConfigurationUseCase } from '../../application/use-cases/delete-shipping-configuration.use-case';

import { ListShippingConfigurationsUseCase } from '../../application/use-cases/list-shipping-configurations.use-case';

import { GetActiveShippingConfigurationUseCase } from '../../application/use-cases/get-active-shipping-configuration.use-case';

import { CreateShippingConfigurationDto } from '../dto/create-shipping-configuration.dto';

import { UpdateShippingConfigurationDto } from '../dto/update-shipping-configuration.dto';

@Controller('admin/shipping-configurations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminShippingConfigurationController {
  constructor(
    private readonly createShippingConfigurationUseCase: CreateShippingConfigurationUseCase,
    private readonly updateShippingConfigurationUseCase: UpdateShippingConfigurationUseCase,
    private readonly deleteShippingConfigurationUseCase: DeleteShippingConfigurationUseCase,
    private readonly listShippingConfigurationsUseCase: ListShippingConfigurationsUseCase,
    private readonly getActiveShippingConfigurationUseCase: GetActiveShippingConfigurationUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateShippingConfigurationDto) {
    const data = await this.createShippingConfigurationUseCase.execute(body);

    return {
      message: 'Shipping configuration created successfully',
      ...data,
    };
  }

  @Get('active')
  async getActive() {
    const data = await this.getActiveShippingConfigurationUseCase.execute();

    return {
      message: 'Active shipping configuration fetched successfully',
      ...data,
    };
  }

  @Get()
  async list() {
    const data = await this.listShippingConfigurationsUseCase.execute();

    return {
      message: 'Shipping configurations fetched successfully',
      ...data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateShippingConfigurationDto) {
    const data = await this.updateShippingConfigurationUseCase.execute({
      id,
      ...body,
    });

    return {
      message: 'Shipping configuration updated successfully',
      ...data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.deleteShippingConfigurationUseCase.execute({ id });

    return data;
  }
}
