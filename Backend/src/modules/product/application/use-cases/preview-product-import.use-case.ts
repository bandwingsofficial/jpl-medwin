// =======================
// 📁 preview-product-import.use-case.ts
// =======================

import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { ExcelParserHelper } from '../utils/excel-parser.helper';

import { ProductImportMapperService } from '../services/product-import.mapper';
import { ProductImportValidatorService } from '../services/product-import.validator';

@Injectable()
export class PreviewProductImportUseCase {
  constructor(
    private readonly mapper: ProductImportMapperService,

    private readonly validator: ProductImportValidatorService,
  ) {}

  async execute(
    file: Express.Multer.File,
  ) {
    // =======================
    // 🚫 FILE CHECK
    // =======================

    if (!file?.buffer) {
      throw new BadRequestException(
        'Excel file is required',
      );
    }

    // =======================
    // 📖 PARSE EXCEL
    // =======================

    const rows = ExcelParserHelper.cleanRows(
      ExcelParserHelper.parse(file.buffer),
    );

    // =======================
    // 🚫 EMPTY FILE
    // =======================

    if (!rows.length) {
      throw new BadRequestException(
        'Excel file is empty',
      );
    }

    // =======================
    // 🧠 MAP PRODUCTS
    // =======================

    const products = this.mapper.map(rows);

    // =======================
    // ✅ VALIDATE
    // =======================

    const validation =
      this.validator.validate(products);

    // =======================
    // 📊 COUNTS
    // =======================

    const totalVariants = products.reduce(
      (acc, product) =>
        acc + product.variants.length,
      0,
    );

    const simpleProducts =
      products.filter(
        (p) => p.type === 'SIMPLE',
      ).length;

    const variableProducts =
      products.filter(
        (p) => p.type === 'VARIABLE',
      ).length;

    // =======================
    // ✅ RESPONSE
    // =======================

    return {
      success: validation.valid,

      message: validation.valid
        ? 'Import preview generated successfully'
        : 'Import preview generated with validation errors',

      summary: {
        totalRows: rows.length,

        totalProducts: products.length,

        totalVariants,

        simpleProducts,

        variableProducts,

        totalErrors:
          validation.totalErrors,
      },

      validation,

      preview: products,
    };
  }
}

