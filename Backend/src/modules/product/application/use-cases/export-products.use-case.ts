// =======================
// 📁 export-products.use-case.ts
// =======================

import { Injectable } from '@nestjs/common';

import { ProductExportBuilderService } from '../services/product-export-builder.service';
import { ProductExportMapperService } from '../services/product-export.mapper.service';
import { ProductExportFlattenerService } from '../services/product-export-flattener.service';
import { ProductExportExcelService } from '../services/product-export-excel.service';

@Injectable()
export class ExportProductsUseCase {
  constructor(
    private readonly builder: ProductExportBuilderService,

    private readonly mapper: ProductExportMapperService,

    private readonly flattener: ProductExportFlattenerService,

    private readonly excelService: ProductExportExcelService,
  ) {}

  async execute() {
    // =======================
    // 📦 FETCH PRODUCTS
    // =======================

    const entities = await this.builder.build();

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
    // 📊 COUNTS
    // =======================

    const totalVariants = products.reduce((acc, product) => acc + product.variants.length, 0);

    const simpleProducts = products.filter((p) => p.type === 'SIMPLE').length;

    const variableProducts = products.filter((p) => p.type === 'VARIABLE').length;

    // =======================
    // ✅ RESPONSE
    // =======================

    return {
      success: true,

      message: 'Products exported successfully',

      summary: {
        totalRows: rows.length,

        totalProducts: products.length,

        totalVariants,

        simpleProducts,

        variableProducts,
      },

      file: {
        name: `products-${Date.now()}.xlsx`,

        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

        size: buffer.length,
      },

      buffer,
    };
  }
}
