import { Inject, Injectable, HttpStatus } from '@nestjs/common';

import { Prisma } from '@prisma/client';



import { TOKENS } from '@/common/constants/tokens';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';



import { BrandRepository } from '@/modules/brand/domain/repositories/brand.repository';

import { BrandNotFoundException } from '@/modules/brand/domain/exceptions/brand-not-found.exception';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';



import { Variant } from '../../domain/entities/variant.entity';

import { SkuVO } from '../../domain/value-objects/sku.vo';

import { ProductType } from '../../domain/enums/product-type.enum';

import {

  CustomerType,

  getCustomerTypeCode,

} from '../../domain/enums/customer-type.enum';



import { PreviewSkuDto } from '../dtos/preview-sku.dto';



type SkuContext = {

  brandId: string;

  customerType: CustomerType;

};



@Injectable()

export class ProductSkuService {

  private readonly companyCode = 'J5';



  constructor(

    private readonly prisma: PrismaService,



    @Inject(TOKENS.BRAND_REPO)

    private readonly brandRepo: BrandRepository,

  ) {}



  getCompanyCode(): string {

    return this.companyCode;

  }



  getCustomerTypeCode(customerType: CustomerType): string {

    return getCustomerTypeCode(customerType);

  }



  async validateSkuContext(input: {
    brandId: string;
    customerType: CustomerType;
    productType: ProductType;
  }): Promise<void> {
    if (!input.customerType) {
      throw new BaseException(
        'Customer Type is required for SKU generation.',
        ErrorCode.PRODUCT.INVALID,
        HttpStatus.BAD_REQUEST,
        { field: 'customerType' },
      );
    }

    if (!input.brandId?.trim()) {
      throw new BaseException(
        'Brand is required for SKU generation.',
        ErrorCode.BRAND.NOT_FOUND,
        HttpStatus.BAD_REQUEST,
        { field: 'brandId' },
      );
    }

    if (!input.productType) {
      throw new BaseException(
        'Product Type is required for SKU generation.',
        ErrorCode.PRODUCT.INVALID,
        HttpStatus.BAD_REQUEST,
        { field: 'type' },
      );
    }

    const brand = await this.brandRepo.findById(input.brandId);

    if (!brand) {
      throw new BrandNotFoundException({ brandId: input.brandId });
    }

    if (!brand.skuPrefix?.trim()) {
      throw new BaseException(
        'Brand SKU Prefix not configured.',
        ErrorCode.BRAND.INVALID,
        HttpStatus.BAD_REQUEST,
        { field: 'brandId' },
      );
    }
  }

  async resolveBrandSkuPrefix(brandId: string): Promise<string> {

    const brand = await this.brandRepo.findById(brandId);



    if (!brand) {

      throw new BrandNotFoundException({ brandId });

    }



    if (!brand.skuPrefix?.trim()) {
      throw new BaseException(
        'Brand SKU Prefix not configured.',
        ErrorCode.BRAND.INVALID,
        HttpStatus.BAD_REQUEST,
        { field: 'brandId' },
      );
    }



    return brand.skuPrefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

  }



  async buildSequenceKey(context: SkuContext): Promise<string> {

    const brandPrefix = await this.resolveBrandSkuPrefix(context.brandId);



    return `${this.companyCode}-${this.getCustomerTypeCode(context.customerType)}-${brandPrefix}`;

  }



  buildProductPrefix(sequenceKey: string, productSequence: number): string {

    return `${sequenceKey}-${String(productSequence).padStart(3, '0')}`;

  }



  formatVariantSku(productPrefix: string, variantSequence: number): string {

    return `${productPrefix}-${String(variantSequence).padStart(3, '0')}`;

  }



  private parseProductSequenceFromJ5Sku(
    sku: string,
    customerCode: string,
  ): number | null {
    if (!sku?.trim()) {
      return null;
    }

    const parts = sku.trim().split('-');

    if (parts.length < 5 || parts[0] !== this.companyCode || parts[1] !== customerCode) {
      return null;
    }

    const parsed = Number.parseInt(parts[3] ?? '', 10);

    return Number.isNaN(parsed) ? null : parsed;
  }



  private async findMaxProductSequenceInDatabase(
    customerType: CustomerType,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.prisma;
    const customerCode = this.getCustomerTypeCode(customerType);

    const variants = await client.variant.findMany({
      where: {
        product: {
          customerType,
        },
      },
      select: { sku: true },
    });

    let maxFromSkus = 0;

    for (const variant of variants) {
      const parsed = this.parseProductSequenceFromJ5Sku(variant.sku, customerCode);

      if (parsed !== null) {
        maxFromSkus = Math.max(maxFromSkus, parsed);
      }
    }

    return maxFromSkus;
  }



  private parseVariantSequenceFromSku(sku: string, productPrefix: string): number | null {

    if (!sku.startsWith(`${productPrefix}-`)) {

      return null;

    }



    const suffix = sku.slice(productPrefix.length + 1);

    const parsed = Number.parseInt(suffix, 10);



    return Number.isNaN(parsed) ? null : parsed;

  }



  private extractProductPrefixFromSku(sku: string): string | null {

    const parts = sku.split('-');



    if (parts.length < 5) {

      return null;

    }



    return parts.slice(0, -1).join('-');

  }



  private async syncProductSequenceFromExistingSkus(

    customerType: CustomerType,

    tx?: Prisma.TransactionClient,

  ): Promise<number> {

    const client = tx ?? this.prisma;

    const maxFromSkus = await this.findMaxProductSequenceInDatabase(
      customerType,
      tx,
    );

    const existing = await client.skuSequence.findUnique({

      where: {

        customerType,

      },

    });

    const current = existing?.lastSequence ?? 0;
    const synced = Math.max(current, maxFromSkus);

    await client.skuSequence.upsert({
      where: {
        customerType,
      },
      create: {
        customerType,
        lastSequence: synced,
      },
      update: {
        lastSequence: synced,
      },
    });

    console.log('[SKU_TRACE] syncProductSequence', {
      customerType,
      maxFromSkus,
      previousCounter: current,
      syncedCounter: synced,
      nextPreview: synced + 1,
    });

    return synced;

  }



  async peekNextProductSequence(

    context: SkuContext,

    tx?: Prisma.TransactionClient,

  ): Promise<number> {

    const sequenceKey = await this.buildSequenceKey(context);
    const current = await this.syncProductSequenceFromExistingSkus(
      context.customerType,
      tx,
    );
    const next = current + 1;

    console.log('[SKU_TRACE] peekNextProductSequence', {
      brandId: context.brandId,
      customerType: context.customerType,
      sequenceKey,
      current,
      next,
    });

    return next;

  }



  async allocateNextProductSequence(

    context: SkuContext,

    tx?: Prisma.TransactionClient,

  ): Promise<number> {

    const execute = async (client: Prisma.TransactionClient) => {
      const sequenceKey = await this.buildSequenceKey(context);

      await this.syncProductSequenceFromExistingSkus(context.customerType, client);

      await client.$queryRaw`
        SELECT "lastSequence"
        FROM "SkuSequence"
        WHERE "customerType" = ${context.customerType}::"CustomerType"
        FOR UPDATE
      `;

      const updated = await client.skuSequence.update({

        where: {

          customerType: context.customerType,

        },

        data: {

          lastSequence: { increment: 1 },

        },

      });

      console.log('[SKU_TRACE] allocateNextProductSequence', {
        brandId: context.brandId,
        customerType: context.customerType,
        sequenceKey,
        allocated: updated.lastSequence,
      });

      return updated.lastSequence;
    };

    if (tx) {
      return execute(tx);
    }

    return this.prisma.$transaction(execute);

  }



  async buildProductPrefixForSequence(

    context: SkuContext,

    productSequence: number,

  ): Promise<string> {

    const sequenceKey = await this.buildSequenceKey(context);



    return this.buildProductPrefix(sequenceKey, productSequence);

  }



  async resolveProductPrefixForPreview(
    productId: string,
    context: SkuContext,
    tx?: Prisma.TransactionClient,
  ): Promise<string> {
    const client = tx ?? this.prisma;

    const variants = await client.variant.findMany({
      where: {
        productId,
        deletedAt: null,
      },
      select: { sku: true },
      orderBy: { createdAt: 'asc' },
    });

    if (variants.length > 0) {
      const prefix = this.extractProductPrefixFromSku(variants[0].sku);

      if (prefix) {
        return prefix;
      }
    }

    const productSequence = await this.peekNextProductSequence(context, tx);

    return this.buildProductPrefixForSequence(context, productSequence);
  }

  async resolveProductPrefixForProduct(

    productId: string,

    context: SkuContext,

    tx?: Prisma.TransactionClient,

  ): Promise<string> {

    const client = tx ?? this.prisma;



    const variants = await client.variant.findMany({

      where: {

        productId,

        deletedAt: null,

      },

      select: { sku: true },

      orderBy: { createdAt: 'asc' },

    });



    if (variants.length > 0) {

      const prefix = this.extractProductPrefixFromSku(variants[0].sku);



      if (prefix) {

        return prefix;

      }

    }



    const productSequence = await this.allocateNextProductSequence(context, tx);



    return this.buildProductPrefixForSequence(context, productSequence);

  }



  async peekNextVariantSequence(

    productId: string,

    productPrefix: string,

    tx?: Prisma.TransactionClient,

  ): Promise<number> {

    const client = tx ?? this.prisma;



    const variants = await client.variant.findMany({

      where: {

        productId,

        deletedAt: null,

      },

      select: { sku: true },

    });



    let max = 0;



    for (const variant of variants) {

      const parsed = this.parseVariantSequenceFromSku(variant.sku, productPrefix);



      if (parsed !== null) {

        max = Math.max(max, parsed);

      }

    }



    return max + 1;

  }



  async preview(input: PreviewSkuDto) {

    console.log('[SKU_TRACE] ProductSkuService.preview input', JSON.stringify(input));



    if (!input.brandId) {

      throw new Error('brandId is required for SKU preview');

    }



    if (!input.customerType) {

      throw new Error('customerType is required for SKU preview');

    }



    const context: SkuContext = {

      brandId: input.brandId,

      customerType: input.customerType,

    };



    const isSimple = input.productType === ProductType.SIMPLE;



    if (input.productId) {

      const productPrefix = await this.resolveProductPrefixForPreview(input.productId, context);

      const startVariantSeq = await this.peekNextVariantSequence(input.productId, productPrefix);



      if (isSimple) {

        const result = {

          sku: new SkuVO(this.formatVariantSku(productPrefix, startVariantSeq)).getValue(),

        };



        console.log('[SKU_TRACE] ProductSkuService.preview SIMPLE existing product', result);



        return result;

      }



      const variantInputs = input.variants?.length

        ? input.variants

        : [{ variantName: input.productName }];



      const result = {

        skus: variantInputs.map((variant, index) => ({

          tempId: variant.tempId,

          sku: new SkuVO(

            this.formatVariantSku(productPrefix, startVariantSeq + index),

          ).getValue(),

        })),

      };



      console.log('[SKU_TRACE] ProductSkuService.preview VARIABLE existing product', result);



      return result;

    }



    const productSequence = await this.peekNextProductSequence(context);

    const productPrefix = await this.buildProductPrefixForSequence(context, productSequence);

    console.log('[SKU_TRACE] ProductSkuService.preview new product sequence', {
      productSequence,
      productPrefix,
    });



    if (isSimple) {

      const result = {

        sku: new SkuVO(this.formatVariantSku(productPrefix, 1)).getValue(),

      };



      console.log('[SKU_TRACE] ProductSkuService.preview SIMPLE result', JSON.stringify(result));



      return result;

    }



    const variantInputs = input.variants?.length

      ? input.variants

      : [{ variantName: input.productName }];



    const result = {

      skus: variantInputs.map((variant, index) => ({

        tempId: variant.tempId,

        sku: new SkuVO(this.formatVariantSku(productPrefix, index + 1)).getValue(),

      })),

    };



    console.log('[SKU_TRACE] ProductSkuService.preview VARIABLE result', JSON.stringify(result));



    return result;

  }



  async resolveVariantSku(params: {

    brandId: string;

    customerType: CustomerType;

    productId: string;

    existingVariant?: Variant | null;

    variantIndex?: number;

    productSequence?: number;

    tx?: Prisma.TransactionClient;

  }): Promise<string> {

    if (params.existingVariant?.sku) {

      return new SkuVO(params.existingVariant.sku).getValue();

    }



    const context: SkuContext = {

      brandId: params.brandId,

      customerType: params.customerType,

    };



    let productPrefix: string;

    let variantSequence: number;



    if (params.productSequence !== undefined && params.variantIndex !== undefined) {

      productPrefix = await this.buildProductPrefixForSequence(context, params.productSequence);

      variantSequence = params.variantIndex + 1;

    } else if (params.variantIndex !== undefined && params.productSequence === undefined) {

      productPrefix = await this.resolveProductPrefixForProduct(

        params.productId,

        context,

        params.tx,

      );

      variantSequence = params.variantIndex + 1;

    } else {

      productPrefix = await this.resolveProductPrefixForProduct(

        params.productId,

        context,

        params.tx,

      );

      variantSequence = await this.peekNextVariantSequence(

        params.productId,

        productPrefix,

        params.tx,

      );

    }



    return new SkuVO(this.formatVariantSku(productPrefix, variantSequence)).getValue();

  }



  async allocateProductSequenceForCreate(

    context: SkuContext,

    tx?: Prisma.TransactionClient,

  ): Promise<number> {

    return this.allocateNextProductSequence(context, tx);

  }

}

