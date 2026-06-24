// =======================
// 📁 import-products.use-case.ts
// =======================

import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ImportMode } from '../dtos/import-products.dto';
import { SlugVO } from '@/modules/category/domain/value-objects/slug.vo';

import { ExcelParserHelper } from '../utils/excel-parser.helper';

import { ProductImportMapperService } from '../services/product-import.mapper';
import { ProductImportValidatorService } from '../services/product-import.validator';
import { ProductImportResolverService } from '../services/product-import-resolver.service';
import { ProductSlugService } from '../services/product-slug.service';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { CreateProductUseCase } from './create-product.use-case';
import { UpdateProductUseCase } from './update-product.use-case';

@Injectable()
export class ImportProductsUseCase {
  constructor(
    private readonly mapper: ProductImportMapperService,

    private readonly validator: ProductImportValidatorService,

    private readonly resolver: ProductImportResolverService,
    private readonly productSlugService: ProductSlugService,

    private readonly createProductUseCase: CreateProductUseCase,

    private readonly updateProductUseCase: UpdateProductUseCase,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(file: Express.Multer.File, mode: ImportMode) {
    // =======================
    // 📖 PARSE EXCEL
    // =======================

    const rows = ExcelParserHelper.cleanRows(ExcelParserHelper.parse(file.buffer));

    // =======================
    // 🧠 MAP
    // =======================

    const products = this.mapper.map(rows);

    // =======================
    // ✅ VALIDATE
    // =======================

    const validation = this.validator.validate(products);

    if (!validation.valid) {
      return {
        success: false,

        message: 'Validation failed',

        validation,
      };
    }

    // =======================
    // 📊 RESULT ARRAYS
    // =======================

    const imported: any[] = [];

    const updated: any[] = [];

    const restored: any[] = [];

    const skipped: any[] = [];

    const failed: any[] = [];

    // =======================
    // 🔄 PRODUCT LOOP
    // =======================

    for (const product of products) {
      try {
        // =======================
        // 🔥 RESOLVE IDS
        // =======================

        const dto = await this.resolver.resolve(product);

        // =======================
        // 🔍 EXISTING PRODUCT
        // =======================

        const slug = new SlugVO(product.name).getValue();

        const existing = await this.productRepo.findBySlug(slug, true);

        // =======================
        // ⏭ SKIP
        // =======================

        if (existing && mode === ImportMode.SKIP) {
          skipped.push({
            product: product.name,

            reason: 'Product already exists',
          });

          continue;
        }

        // =======================
        // ♻ RESTORE
        // =======================

        if (existing && existing.isDeleted?.() && mode === ImportMode.RESTORE) {
          existing.restore();

          existing.activate();

          await this.productRepo.update(existing);

          restored.push({
            id: existing.id,

            product: existing.name,
          });

          continue;
        }

        // =======================
        // 🔄 OVERRIDE
        // =======================

        if (existing && mode === ImportMode.OVERRIDE) {
          console.log('OVERRIDE MODE', product.name);
          const result = await this.updateProductUseCase.execute({
            id: existing.id,
            ...dto,
          });

          updated.push({
            id: result.id,

            product: result.name,
          });

          continue;
        }

        // =======================
        // 🆕 CREATE
        // =======================

        const created = await this.createProductUseCase.execute(dto);

        imported.push({
          id: created.id,

          product: created.name,

          variants: created.variants?.length ?? 0,
        });
      } catch (e: any) {
        failed.push({
          product: product.name,

          reason: e.message,
        });
      }
    }

    // =======================
    // 📊 SUMMARY
    // =======================

    return {
      success: failed.length === 0,

      message: 'Import completed',

      summary: {
        totalRows: rows.length,

        totalProducts: products.length,

        imported: imported.length,

        updated: updated.length,

        restored: restored.length,

        skipped: skipped.length,

        failed: failed.length,
      },

      imported,

      updated,

      restored,

      skipped,

      failed,
    };
  }
}
