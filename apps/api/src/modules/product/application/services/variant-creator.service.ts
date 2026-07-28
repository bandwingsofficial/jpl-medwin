import { Inject, Injectable } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';
import {
  ValidationFailedException,
  ValidationFieldError,
} from '@/common/exceptions/validation-failed.exception';



import { TOKENS } from '@/common/constants/tokens';



import { VariantRepository } from '../../domain/repositories/variant.repository';

import { ProductImageRepository } from '../../domain/repositories/product-image.repository';



import { ProductDomainService } from '../../domain/services/product-domain.service';



import { Product } from '../../domain/entities/product.entity';

import { Variant } from '../../domain/entities/variant.entity';

import { ProductImage } from '../../domain/entities/product-image.entity';



import { QuantityVO } from '../../domain/value-objects/quantity.vo';

import { ImageUrlVO } from '../../domain/value-objects/image-url.vo';



import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';

import { ImageType } from '../../domain/enums/image-type.enum';



import { ProductSlugService } from './product-slug.service';

import { ProductSkuService } from './product-sku.service';

import { ProductPricingValidator } from './product-pricing.validator';



@Injectable()

export class VariantCreatorService {

  constructor(

    @Inject(TOKENS.VARIANT_REPO)

    private readonly variantRepo: VariantRepository,



    @Inject(TOKENS.PRODUCT_IMAGE_REPO)

    private readonly imageRepo: ProductImageRepository,



    private readonly domainService: ProductDomainService,



    private readonly slugService: ProductSlugService,



    private readonly skuService: ProductSkuService,

  ) {}



  async createVariants(

    product: Product,



    variants: any[] = [],



    tx?: any,

  ): Promise<string | undefined> {

    let defaultVariantId: string | undefined;



    const productSequence = await this.skuService.allocateProductSequenceForCreate(

      {

        brandId: product.brandId,

        customerType: product.customerType,

      },

      tx,

    );



    for (let index = 0; index < variants.length; index++) {

      const v = variants[index];



      let pricing;

      try {
        pricing = ProductPricingValidator.validate({
          purchasePrice: v.purchasePrice,
          sellingPrice: v.sellingPrice,
          mrp: v.mrp,
        });
      } catch (error) {
        if (error instanceof BaseException) {
          throw new ValidationFailedException('Validation failed', [
            this.mapPricingError(error.message, v, index),
          ]);
        }

        throw error;
      }



      const sku = await this.skuService.resolveVariantSku({

        brandId: product.brandId,

        customerType: product.customerType,

        productId: product.id,

        productSequence,

        variantIndex: index,

        tx,

      });



      const existingDeletedVariant = await this.variantRepo.findBySku(sku, true, tx);



      if (existingDeletedVariant && existingDeletedVariant.isDeleted()) {

        existingDeletedVariant.restore();



        existingDeletedVariant.updateDetails({

          name: v.name,



          purchasePrice: pricing.purchasePrice,



          sellingPrice: pricing.sellingPrice,



          mrp: pricing.mrp,



          quantity: new QuantityVO(v.quantity).getValue(),



          attributes: v.attributes ?? {},



          averageRating: v.averageRating,



          reviewCount: v.reviewCount,



          isWeighted: v.isWeighted,



          warrantyMonths: v.warrantyMonths,



          priorityOrder: v.priorityOrder ?? index,

        });



        const restoredVariant = await this.variantRepo.update(existingDeletedVariant, tx);



        if (!defaultVariantId) {

          defaultVariantId = restoredVariant.id;

        }



        continue;

      }



      await this.domainService.validateVariantSku(sku);



      if (!v.name) {

        throw new Error('Variant name is required');

      }



      const slug = await this.slugService.generateVariantSlug(v.name);



      const variant = new Variant(

        crypto.randomUUID(),



        product.id,



        sku,



        v.name,



        slug,



        pricing.purchasePrice,



        pricing.sellingPrice,



        pricing.mrp,



        new QuantityVO(v.quantity).getValue(),



        v.attributes ?? {},



        v.averageRating ?? 0,



        v.reviewCount ?? 0,



        v.isWeighted ?? false,



        v.warrantyMonths ?? null,



        v.priorityOrder ?? index,

      );



      const createdVariant = await this.variantRepo.create(variant, tx);



      if (!defaultVariantId) {

        defaultVariantId = createdVariant.id;

      }



      let mainImageId: string | null = null;



      if (v.mainImage) {

        const image = await this.imageRepo.create(

          new ProductImage(

            crypto.randomUUID(),



            new ImageUrlVO(v.mainImage).getValue(),



            ImageType.MAIN,



            ImageOwnerType.VARIANT,



            undefined,



            createdVariant.id,



            v.name,



            0,

          ),



          tx,

        );



        mainImageId = image.id;

      }



      for (const img of v.images ?? []) {

        await this.imageRepo.create(

          new ProductImage(

            crypto.randomUUID(),



            new ImageUrlVO(img.url).getValue(),



            ImageType.GALLERY,



            ImageOwnerType.VARIANT,



            undefined,



            createdVariant.id,



            img.alt,



            img.sortOrder ?? 0,

          ),



          tx,

        );

      }



      if (mainImageId) {

        await this.imageRepo.setMainImageForVariant(createdVariant.id, mainImageId, tx);

      }

    }



    return defaultVariantId;

  }

  private mapPricingError(
    message: string,
    variant: { name?: string },
    index: number,
  ): ValidationFieldError {
    const label = variant.name?.trim()
      ? `Variant "${variant.name.trim()}"`
      : `Variant ${index + 1}`;

    const normalized = message.toLowerCase();

    if (normalized.includes('selling price')) {
      if (normalized.includes('greater than zero')) {
        return {
          field: `variants[${index}].sellingPrice`,
          message: `${label}: Selling Price must be greater than zero.`,
        };
      }

      if (normalized.includes('less than purchase')) {
        return {
          field: `variants[${index}].sellingPrice`,
          message: `${label}: Selling Price must be greater than or equal to Purchase Price.`,
        };
      }

      if (normalized.includes('mrp')) {
        return {
          field: `variants[${index}].sellingPrice`,
          message: `${label}: Selling Price cannot exceed MRP.`,
        };
      }

      return {
        field: `variants[${index}].sellingPrice`,
        message: `${label}: Selling Price is required.`,
      };
    }

    if (normalized.includes('negative')) {
      return {
        field: `variants[${index}].purchasePrice`,
        message: `${label}: Price cannot be negative.`,
      };
    }

    if (normalized.includes('mrp')) {
      return {
        field: `variants[${index}].mrp`,
        message: `${label}: MRP cannot be less than Selling Price.`,
      };
    }

    return {
      field: `variants[${index}].sellingPrice`,
      message: `${label}: ${message}`,
    };
  }

}

