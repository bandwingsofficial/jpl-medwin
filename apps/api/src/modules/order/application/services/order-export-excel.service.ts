// src/modules/order/application/services/order-export-excel.service.ts

import { Injectable } from '@nestjs/common';

import { ExcelExportHelper } from '../../../product/application/utils/excel-export.helper';

@Injectable()
export class OrderExportExcelService {
  async generate(rows: any[]): Promise<Buffer> {
    return ExcelExportHelper.export(rows, 'Orders');
  }
}