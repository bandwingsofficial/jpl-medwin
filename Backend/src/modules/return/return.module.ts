import { Module ,forwardRef } from '@nestjs/common';

// =======================
// INFRA
// =======================

import { PrismaService } from '../../infrastructure/prisma/prisma.service';

// =======================
// TOKENS
// =======================

import { TOKENS } from '@/common/constants/tokens';

// =======================
// CONTROLLERS
// =======================

import { ReturnController } from './presentation/controllers/return.controller';

import { AdminReturnController } from './presentation/controllers/admin-return.controller';

// =======================
// REPOSITORIES
// =======================

import { PrismaReturnRepository } from './infrastructure/persistence/prisma/repositories/prisma-return.repository';

// =======================
// DOMAIN SERVICES
// =======================

import { ReturnDomainService } from './domain/services/return-domain.service';

// =======================
// APPLICATION SERVICES
// =======================

import { ReturnOwnershipService } from './application/services/return-ownership.service';

// =======================
// USE CASES
// =======================

import { RequestReturnUseCase } from './application/use-cases/request-return.use-case';

import { GetReturnUseCase } from './application/use-cases/get-return.use-case';

import { GetMyReturnsUseCase } from './application/use-cases/get-my-returns.use-case';

import { ApproveReturnUseCase } from './application/use-cases/approve-return.use-case';

import { RejectReturnUseCase } from './application/use-cases/reject-return.use-case';

import { PickupReturnUseCase } from './application/use-cases/pickup-return.use-case';

import { CompleteReturnUseCase } from './application/use-cases/complete-return.use-case';

import { CreateReplacementOrderUseCase } from './application/use-cases/create-replacement-order.use-case';

// =======================
// IMPORTS
// =======================

import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    forwardRef(() => OrderModule),
  ],

  controllers: [
    ReturnController,

    AdminReturnController,
  ],

  providers: [
    PrismaService,

    // =======================
    // REPOSITORIES
    // =======================

    {
      provide: TOKENS.RETURN_REPO,

      useClass: PrismaReturnRepository,
    },

    // =======================
    // DOMAIN SERVICES
    // =======================

    ReturnDomainService,

    // =======================
    // APP SERVICES
    // =======================

    ReturnOwnershipService,

    // =======================
    // USE CASES
    // =======================

    RequestReturnUseCase,

    GetReturnUseCase,

    GetMyReturnsUseCase,

    ApproveReturnUseCase,

    RejectReturnUseCase,

    PickupReturnUseCase,

    CompleteReturnUseCase,

    CreateReplacementOrderUseCase,
  ],

  exports: [
    // =======================
    // REPOSITORIES
    // =======================

    TOKENS.RETURN_REPO,

    // =======================
    // DOMAIN SERVICES
    // =======================

    ReturnDomainService,

    // =======================
    // APP SERVICES
    // =======================

    ReturnOwnershipService,

    // =======================
    // USE CASES
    // =======================

    RequestReturnUseCase,

    GetReturnUseCase,

    GetMyReturnsUseCase,

    ApproveReturnUseCase,

    RejectReturnUseCase,

    PickupReturnUseCase,

    CompleteReturnUseCase,

    CreateReplacementOrderUseCase,
  ],
})
export class ReturnModule {}