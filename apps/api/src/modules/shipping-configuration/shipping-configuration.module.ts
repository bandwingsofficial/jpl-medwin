import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

import { AuthModule } from '@/modules/auth/auth.module';

import { TOKENS } from '@/common/constants/tokens';

import { AdminShippingConfigurationController } from './presentation/controllers/admin-shipping-configuration.controller';

import { PrismaShippingConfigurationRepository } from './infrastructure/persistence/prisma/repositories/prisma-shipping-configuration.repository';

import { ShippingCalculatorService } from './application/services/shipping-calculator.service';

import { CreateShippingConfigurationUseCase } from './application/use-cases/create-shipping-configuration.use-case';

import { UpdateShippingConfigurationUseCase } from './application/use-cases/update-shipping-configuration.use-case';

import { DeleteShippingConfigurationUseCase } from './application/use-cases/delete-shipping-configuration.use-case';

import { ListShippingConfigurationsUseCase } from './application/use-cases/list-shipping-configurations.use-case';

import { GetActiveShippingConfigurationUseCase } from './application/use-cases/get-active-shipping-configuration.use-case';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminShippingConfigurationController],
  providers: [
    {
      provide: TOKENS.SHIPPING_CONFIGURATION_REPO,
      useClass: PrismaShippingConfigurationRepository,
    },
    ShippingCalculatorService,
    CreateShippingConfigurationUseCase,
    UpdateShippingConfigurationUseCase,
    DeleteShippingConfigurationUseCase,
    ListShippingConfigurationsUseCase,
    GetActiveShippingConfigurationUseCase,
  ],
  exports: [ShippingCalculatorService, TOKENS.SHIPPING_CONFIGURATION_REPO],
})
export class ShippingConfigurationModule {}
