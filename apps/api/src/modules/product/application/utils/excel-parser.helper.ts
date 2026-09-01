import * as XLSX from 'xlsx';

export class ExcelParserHelper {
  // =======================
  // 📖 PARSE EXCEL
  // =======================

 static parse(buffer: Buffer) {
  const workbook = XLSX.read(buffer, {
    type: 'buffer',
  });

  const sheetName = workbook.SheetNames[0];
  console.log('ALL SHEETS:', workbook.SheetNames);
console.log('READING SHEET:', sheetName);

  const sheet = workbook.Sheets[sheetName];

  // Read the entire sheet as arrays
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
  }) as any[][];
  console.log('RAW ROW COUNT:', rows.length);

  if (rows.length < 2) {
    return [];
  }

  // Second row contains the actual import headers
  const headers = rows[1].map((header) =>
    this.normalizeHeader(String(header)),
  );

  const result: Record<string, any>[] = [];

  // Data starts from row 3
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];

    const obj: Record<string, any> = {};

    headers.forEach((header, index) => {
      obj[header] = row[index] ?? '';
    });

    result.push(obj);
  }

  return result;
}

private static normalizeHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_');
}

// =======================
// 📥 GET COLUMN
// =======================

static getValue(
  row: Record<string, any>,
  ...keys: string[]
) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
      return row[key];
    }
  }

  return '';
}

  // =======================
  // 🧹 CLEAN ROWS
  // =======================

  static cleanRows(rows: any[]) {
    return rows.filter((row: any) => {
      // Skip completely empty rows
      const hasValues = Object.values(row).some(
        (value) => value !== null && value !== undefined && String(value).trim() !== '',
      );

      if (!hasValues) {
        return false;
      }

      // Skip helper rows
      const sku = this.normalizeText(
  this.getValue(row, 'sku'),
).toUpperCase();


      if (sku.includes('COMPANY+BRAND')) {
        return false;
      }

      return true;
    });
  }

  // =======================
  // 🧹 NORMALIZE TEXT
  // =======================

  static normalizeText(value: any): string {
    return String(value ?? '')
      .replace(/\r/g, '')
      .replace(/\t/g, '')
      .trim();
  }

  // =======================
  // 📋 BULLET LIST PARSER
  // =======================

  static parseBulletList(value?: string): string[] {
    if (!value) {
      return [];
    }

    return String(value)
      .split('\n')
      .map((v) => v.replace(/•/g, '').replace(/-/g, '').trim())
      .filter(Boolean);
  }

  // =======================
  // 🧠 SPECIFICATIONS PARSER
  // =======================

  static parseSpecifications(value?: string) {
    if (!value) {
      return [];
    }

    return String(value)
      .split('\n')
      .map((line) => {
        const cleaned = line.replace(/•/g, '').replace(/-/g, '').trim();

        const [key, ...rest] = cleaned.split(':');

        return {
          key: key?.trim() ?? '',
          value: rest.join(':').trim(),
        };
      })
      .filter((v) => v.key && v.value);
  }

  // =======================
  // ❓ FAQ PARSER
  // =======================

  static parseFaq(value?: string) {
    if (!value) {
      return [];
    }

    return String(value)
      .split('\n')
      .map((line) => {
        const cleaned = line.replace(/•/g, '').replace(/-/g, '').trim();

        const [question, ...rest] = cleaned.split(':');

        return {
          question: question?.trim() ?? '',
          answer: rest.join(':').trim(),
        };
      })
      .filter((v) => v.question && v.answer);
  }

  // =======================
  // 🔢 NUMBER PARSER
  // =======================

  static parseNumber(value: any): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(String(value).replace(/,/g, '').trim());

    return Number.isNaN(parsed) ? undefined : parsed;
  }

  // =======================
  // ✅ BOOLEAN PARSER
  // =======================

  static parseBoolean(value: any): boolean {
    const normalized = String(value ?? '')
      .trim()
      .toLowerCase();

    return ['true', '1', 'yes', 'y', 'active', 'enabled', 'on'].includes(normalized);
  }

  // =======================
  // 🖼 IMAGE URL PARSER
  // =======================

  static parseImages(value?: string): string[] {
    if (!value) {
      return [];
    }

    return String(value)
      .split(/[\n,;]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }

  // =======================
  // 🏷 TAG PARSER
  // =======================

  static parseTags(value?: string): string[] {
    if (!value) {
      return [];
    }

    return String(value)
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }

  // =======================
  // 🧼 REMOVE EMPTY OBJECTS
  // =======================

  static removeEmpty<T>(arr: T[]): T[] {
    return arr.filter(Boolean);
  }

  // =======================
  // 🔒 SKU VALIDATION
  // =======================

  static isValidSku(sku: string): boolean {
    return /^[A-Z0-9-]+$/i.test(this.normalizeText(sku));
  }
}
