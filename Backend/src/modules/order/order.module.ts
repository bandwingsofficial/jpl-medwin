// src/modules/order/order.module.ts

import { Module, forwardRef } from '@nestjs/common';

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

import { OrderController } from './presentation/controllers/order.controller';

import { AdminOrderController } from './presentation/controllers/admin-order.controller';

// =======================
// REPOSITORIES
// =======================

import { PrismaOrderRepository } from './infrastructure/persistence/prisma/repositories/prisma-order.repository';

import { PrismaOrderItemRepository } from './infrastructure/persistence/prisma/repositories/prisma-order-item.repository';

// =======================
// DOMAIN SERVICES
// =======================

import { OrderDomainService } from './domain/services/order-domain.service';

// =======================
// APPLICATION SERVICES
// =======================

import { OrderSummaryService } from './application/services/order-summary.service';

import { OrderOwnershipService } from './application/services/order-ownership.service';

import { OrderNumberService } from './application/services/order-number.service';
import { OrderResponseBuilderService } from './application/services/order-response-builder.service';

import { OrderAddressValidationService } from './application/services/order-address-validation.service';
import { OrderExportBuilderService } from './application/services/order-export-builder.service';
import { OrderExportMapperService } from './application/services/order-export.mapper.service';
import { OrderExportFlattenerService } from './application/services/order-export-flattener.service';
import { OrderExportExcelService } from './application/services/order-export-excel.service';

// =======================
// USE CASES
// =======================

import { CreateOrderFromCheckoutUseCase } from './application/use-cases/create-order-from-checkout.use-case';

import { GetOrderUseCase } from './application/use-cases/get-order.use-case';

import { GetMyOrdersUseCase } from './application/use-cases/get-my-orders.use-case';

import { CancelOrderUseCase } from './application/use-cases/cancel-order.use-case';

import { MarkOrderPaidUseCase } from './application/use-cases/mark-order-paid.use-case';

import { ConfirmOrderUseCase } from './application/use-cases/confirm-order.use-case';

import { ProcessOrderUseCase } from './application/use-cases/process-order.use-case';

import { ShipOrderUseCase } from './application/use-cases/ship-order.use-case';

import { DeliverOrderUseCase } from './application/use-cases/deliver-order.use-case';

import { RefundOrderUseCase } from './application/use-cases/refund-order.use-case';

import { GetOrdersUseCase } from './application/use-cases/get-admin-order.use-case';

import { GetOrderByIdUseCase } from './application/use-cases/get-admin-order-by-id.use-case';
import { ExportOrdersUseCase } from './application/use-cases/export-orders.use-case';

// =======================
// IMPORTS
// =======================

import { CheckoutSessionModule } from '../checkout-session/checkout-session.module';
import { CoinsModule } from '../coins/coins.module';
import { ReturnModule } from '../return/return.module';
import { SavedAddressModule } from '../saved-address/saved-address.module';

@Module({
  imports: [CheckoutSessionModule, CoinsModule, forwardRef(() => ReturnModule), SavedAddressModule],
  controllers: [OrderController, AdminOrderController],

  providers: [
    PrismaService,

    // =======================
    // REPOSITORIES
    // =======================

    {
      provide: TOKENS.ORDER_REPO,

      useClass: PrismaOrderRepository,
    },

    {
      provide: TOKENS.ORDER_ITEM_REPO,

      useClass: PrismaOrderItemRepository,
    },

    // =======================
    // DOMAIN SERVICES
    // =======================

    OrderDomainService,

    // =======================
    // APPLICATION SERVICES
    // =======================

    OrderSummaryService,

    OrderOwnershipService,

    OrderNumberService,
    OrderResponseBuilderService,
    OrderAddressValidationService,
    OrderExportBuilderService,
    OrderExportMapperService,
    OrderExportFlattenerService,
    OrderExportExcelService,

    // =======================
    // USE CASES
    // =======================

    CreateOrderFromCheckoutUseCase,

    GetOrderUseCase,

    GetMyOrdersUseCase,

    CancelOrderUseCase,

    MarkOrderPaidUseCase,

    ConfirmOrderUseCase,

    ProcessOrderUseCase,

    ShipOrderUseCase,

    DeliverOrderUseCase,

    RefundOrderUseCase,

    GetOrderByIdUseCase,
    GetOrdersUseCase,
    ExportOrdersUseCase,
  ],

  exports: [
    // =======================
    // REPOSITORIES
    // =======================

    TOKENS.ORDER_REPO,

    TOKENS.ORDER_ITEM_REPO,

    // =======================
    // DOMAIN SERVICES
    // =======================

    OrderDomainService,

    // =======================
    // APP SERVICES
    // =======================

    OrderSummaryService,

    OrderOwnershipService,

    OrderNumberService,
    OrderResponseBuilderService,
    OrderAddressValidationService,
    OrderExportBuilderService,
    OrderExportMapperService,
    OrderExportFlattenerService,
    OrderExportExcelService,

    // =======================
    // USE CASES
    // =======================

    CreateOrderFromCheckoutUseCase,

    GetOrderUseCase,

    GetMyOrdersUseCase,

    CancelOrderUseCase,

    MarkOrderPaidUseCase,

    ConfirmOrderUseCase,

    ProcessOrderUseCase,

    ShipOrderUseCase,

    DeliverOrderUseCase,

    RefundOrderUseCase,
    GetOrderByIdUseCase,
    GetOrdersUseCase,
    ExportOrdersUseCase,
  ],
})
export class OrderModule {}
