// =======================
// 📁 export-orders.use-case.ts
// =======================

import { Injectable } from '@nestjs/common';

import { OrderStatus } from '../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';

import { OrderExportBuilderService } from '../services/order-export-builder.service';
import { OrderExportMapperService } from '../services/order-export.mapper.service';
import { OrderExportFlattenerService } from '../services/order-export-flattener.service';
import { OrderExportExcelService } from '../services/order-export-excel.service';

@Injectable()
export class ExportOrdersUseCase {
  constructor(
    private readonly builder: OrderExportBuilderService,

    private readonly mapper: OrderExportMapperService,

    private readonly flattener: OrderExportFlattenerService,

    private readonly excelService: OrderExportExcelService,
  ) {}

  async execute(filter?: {
    from?: Date;
    to?: Date;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    search?: string;
  }) {
    // =======================
    // 📦 FETCH ORDERS
    // =======================

    const entities =
      filter &&
      (filter.from ||
        filter.to ||
        filter.status ||
        filter.paymentStatus ||
        filter.search)
        ? await this.builder.buildByFilter(filter)
        : await this.builder.build();
        console.log(JSON.stringify(entities[0], null, 2));
    // =======================
    // 🧠 MAP
    // =======================

    const orders = this.mapper.map(entities);

    // =======================
    // 📄 FLATTEN
    // =======================

    const rows = this.flattener.flatten(orders);

    // =======================
    // 📁 GENERATE EXCEL
    // =======================

    const buffer = await this.excelService.generate(rows);

    // =======================
    // 📊 SUMMARY
    // =======================

    const statusCounts = orders.reduce(
      (acc: Record<string, number>, order: any) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1;
        return acc;
      },
      {},
    );

    // =======================
    // ✅ RESPONSE
    // =======================

    return {
      success: true,

      message: 'Orders exported successfully',

      summary: {
        totalRows: rows.length,

        totalOrders: orders.length,

        statusCounts,
      },

      file: {
        name: `orders-${Date.now()}.xlsx`,

        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

        size: buffer.length,
      },

      buffer,
    };
  }
}