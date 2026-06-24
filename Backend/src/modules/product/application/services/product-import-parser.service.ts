// src/modules/product/application/services/product-import-parser.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductImportParserService {
  // =======================
  // 🧠 JSON PARSER
  // =======================

  parseJson<T>(
    value: any,
    fallback: T,
  ): T {
    try {
      if (
        value === undefined ||
        value === null ||
        value === ''
      ) {
        return fallback;
      }

      return typeof value === 'string'
        ? (JSON.parse(value) as T)
        : (value as T);
    } catch {
      return fallback;
    }
  }

  // =======================
  // ✅ BOOLEAN PARSER
  // =======================

  toBoolean(value: any): boolean {
    const normalized = String(value ?? '')
      .trim()
      .toLowerCase();

    return [
      'true',
      '1',
      'yes',
      'y',
      'active',
      'enabled',
      'on',
    ].includes(normalized);
  }

  // =======================
  // 🔢 NUMBER PARSER
  // =======================

  toNumber(
    value: any,
  ): number | undefined {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return undefined;
    }

    const parsed = Number(
      String(value)
        .replace(/,/g, '')
        .trim(),
    );

    return Number.isNaN(parsed)
      ? undefined
      : parsed;
  }

  // =======================
  // 📝 STRING PARSER
  // =======================

  toString(value: any): string {
    return String(value ?? '').trim();
  }

  // =======================
  // 📋 ARRAY PARSER
  // =======================

  toArray(
    value: any,
    separator = ',',
  ): string[] {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return [];
    }

    return String(value)
      .split(separator)
      .map((v) => v.trim())
      .filter(Boolean);
  }

  // =======================
  // 🖼 IMAGE URL PARSER
  // =======================

  toImages(value: any): string[] {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return [];
    }

    return String(value)
      .split(/[\n,;]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
}