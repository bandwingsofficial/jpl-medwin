// src/modules/product/application/services/product-export-excel.service.ts

import { Injectable } from '@nestjs/common';

import { ExcelExportHelper } from '../utils/excel-export.helper';

@Injectable()
export class ProductExportExcelService {
  async generate(
    rows: any[],
  ): Promise<Buffer> {
    return ExcelExportHelper.export(
      rows,
      'Products',
    );
  }
}