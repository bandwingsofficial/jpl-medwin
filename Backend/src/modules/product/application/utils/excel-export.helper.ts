// src/modules/product/application/utils/excel-export.helper.ts

import { Workbook } from 'exceljs';

export class ExcelExportHelper {
  // =======================
  // EXPORT
  // =======================

  static async export(rows: any[], sheetName = 'Products'): Promise<Buffer> {
    const workbook = new Workbook();

    const sheet = workbook.addWorksheet(sheetName);

    // =======================
    // HEADERS
    // =======================

    sheet.columns = Object.keys(rows[0] ?? {}).map((key) => ({
      header: key,
      key,
      width: 30,
    }));

    // =======================
    // DATA
    // =======================

    sheet.addRows(rows);

    // =======================
    // HEADER STYLE
    // =======================

    sheet.getRow(1).font = {
      bold: true,
    };

    // =======================
    // WRAP TEXT
    // =======================

    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = {
          wrapText: true,
          vertical: 'top',
        };
      });
    });

    // =======================
    // FREEZE HEADER
    // =======================

    sheet.views = [
      {
        state: 'frozen',
        ySplit: 1,
      },
    ];

    // =======================
    // AUTO FILTER
    // =======================

    sheet.autoFilter = {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: sheet.columnCount,
      },
    };

    // =======================
    // BUFFER
    // =======================

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
  }
}
