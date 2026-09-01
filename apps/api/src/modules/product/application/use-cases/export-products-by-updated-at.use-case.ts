import { Injectable } from '@nestjs/common';

import { ProductExportBuilderService } from '../services/product-export-builder.service';
import { ProductExportMapperService } from '../services/product-export.mapper.service';
import { ProductExportFlattenerService } from '../services/product-export-flattener.service';
import { ProductExportExcelService } from '../services/product-export-excel.service';

@Injectable()
export class ExportProductsByUpdatedAtUseCase {
  constructor(
    private readonly builder: ProductExportBuilderService,
    private readonly mapper: ProductExportMapperService,
    private readonly flattener: ProductExportFlattenerService,
    private readonly excelService: ProductExportExcelService,
  ) {}

  async execute(fromDate: Date, toDate: Date) {
    // =======================
    // 📦 FETCH PRODUCTS
    // =======================

    const entities = await this.builder.buildByUpdatedAt({
      fromDate,
      toDate,
    });

    // =======================
    // 🧠 MAP
    // =======================

    const products = this.mapper.map(entities);

    // =======================
    // 📄 FLATTEN
    // =======================

    const rows = this.flattener.flatten(products);

    // =======================
    // 📁 GENERATE EXCEL
    // =======================

    const buffer = await this.excelService.generate(rows);

    // =======================
    // 📊 SUMMARY
    // =======================

    const totalVariants = products.reduce(
      (acc, product) => acc + product.variants.length,
      0,
    );

    const simpleProducts = products.filter(
      (p) => p.type === 'SIMPLE',
    ).length;

    const variableProducts = products.filter(
      (p) => p.type === 'VARIABLE',
    ).length;

    // =======================
    // ✅ RESPONSE
    // =======================

    return {
      success: true,
      message: 'Products exported successfully by updated date.',
      summary: {
        totalRows: rows.length,
        totalProducts: products.length,
        totalVariants,
        simpleProducts,
        variableProducts,
        fromDate,
        toDate,
      },
      file: {
        name: `products-updated-at-${Date.now()}.xlsx`,
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: buffer.length,
      },
      buffer,
    };
  }
}