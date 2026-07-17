// import { Inject, Injectable, ConflictException, BadRequestException } from '@nestjs/common';
// import { TOKENS } from '@/common/constants/tokens';

// import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

// import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
// import { VariantRepository } from '@/modules/product/domain/repositories/variant.repository';
// import { ProductImageRepository } from '@/modules/product/domain/repositories/product-image.repository';

// import { ProductDomainService } from '@/modules/product/domain/services/product-domain.service';

// import { Variant } from '@/modules/product/domain/entities/variant.entity';
// import { ProductImage } from '@/modules/product/domain/entities/product-image.entity';

// import { SkuVO } from '@/modules/product/domain/value-objects/sku.vo';
// import { PriceVO } from '@/modules/product/domain/value-objects/price.vo';
// import { QuantityVO } from '@/modules/product/domain/value-objects/quantity.vo';
// import { SlugVO } from '@/modules/category/domain/value-objects/slug.vo';
// import { ImageUrlVO } from '@/modules/product/domain/value-objects/image-url.vo';

// import { ImageOwnerType } from '@/modules/product/domain/enums/image-owner-type.enum';
// import { ImageType } from '@/modules/product/domain/enums/image-type.enum';
// import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';

// @Injectable()
// export class AddVariantUseCase {
//   constructor(
//     private readonly prisma: PrismaService,

//     @Inject(TOKENS.PRODUCT_REPO)
//     private readonly productRepo: ProductRepository,

//     @Inject(TOKENS.VARIANT_REPO)
//     private readonly variantRepo: VariantRepository,

//     @Inject(TOKENS.PRODUCT_IMAGE_REPO)
//     private readonly imageRepo: ProductImageRepository,

//     private readonly domainService: ProductDomainService,
//   ) {}

//   async execute(productId: string, input: any) {
//     // =======================
//     // 🔍 PRODUCT CHECK
//     // =======================

//     const product = await this.productRepo.findById(productId);

//     if (!product) {
//       throw new ProductNotFoundException();
//     }

//     // =======================
//     // 💰 PRICE VALIDATION
//     // =======================

//     if (input.sellingPrice > input.mrp) {
//       throw new BadRequestException('Selling price cannot exceed MRP');
//     }

//     // =======================
//     // 🔥 SLUG
//     // =======================

//     let slug = input.slug ? new SlugVO(input.slug).getValue() : new SlugVO(input.name).getValue();

//     // =======================
//     // 💾 TRANSACTION
//     // =======================

//     return this.prisma.$transaction(async (tx) => {
//       // =======================
//       // 🔥 SLUG LOGIC
//       // =======================

//       const existingSlug = await this.variantRepo.findBySlug(slug, true, tx);

//       if (!input.slug) {
//         slug = await this.generateUniqueSlug(slug);
//       } else if (existingSlug && !existingSlug.isDeleted()) {
//         throw new ConflictException('Slug already exists');
//       }

//       // =======================
//       // ♻️ CHECK DELETED SKU
//       // =======================

//       const deletedVariant = await this.variantRepo.findBySku(input.sku, true, tx);

//       // =======================
//       // ♻️ RESTORE FLOW
//       // =======================

//       if (deletedVariant && deletedVariant.isDeleted()) {
//         deletedVariant.restore();

//         deletedVariant.updateDetails({
//           name: input.name,

//           purchasePrice: new PriceVO(input.purchasePrice).getValue(),

//           sellingPrice: new PriceVO(input.sellingPrice).getValue(),

//           mrp: new PriceVO(input.mrp).getValue(),

//           quantity: new QuantityVO(input.quantity).getValue(),

//           attributes: input.attributes ?? {},

//           averageRating: input.averageRating,

//           reviewCount: input.reviewCount,

//           isWeighted: input.isWeighted,

//           warrantyMonths: input.warrantyMonths,
//         });

//         // 🔥 update slug manually
//         deletedVariant.slug = slug;

//         const updated = await this.variantRepo.update(deletedVariant, tx);

//         // =======================
//         // 🖼 IMAGES
//         // =======================

//         await this.handleImages(updated.id, updated.name, input, tx);

//         // =======================
//         // ⭐ DEFAULT VARIANT
//         // =======================

//         if (!product.defaultVariantId) {
//           product.defaultVariantId = updated.id;

//           await this.productRepo.update(product, tx);
//         }

//         return updated;
//       }

//       // =======================
//       // 🔒 SKU VALIDATION
//       // =======================

//       await this.domainService.validateVariantSku(input.sku);

//       // =======================
//       // 🆕 CREATE FLOW
//       // =======================

//       const variant = new Variant(
//         crypto.randomUUID(),

//         productId,

//         new SkuVO(input.sku).getValue(),

//         input.name,

//         slug,

//         new PriceVO(input.purchasePrice).getValue(),

//         new PriceVO(input.sellingPrice).getValue(),

//         new PriceVO(input.mrp).getValue(),

//         new QuantityVO(input.quantity).getValue(),
//       );

//       variant.updateDetails({
//         attributes: input.attributes ?? {},

//         averageRating: input.averageRating,

//         reviewCount: input.reviewCount,

//         isWeighted: input.isWeighted,

//         warrantyMonths: input.warrantyMonths,
//       });

//       const created = await this.variantRepo.create(variant, tx);

//       // =======================
//       // 🖼 IMAGES
//       // =======================

//       await this.handleImages(created.id, created.name, input, tx);

//       // =======================
//       // ⭐ DEFAULT VARIANT
//       // =======================

//       if (!product.defaultVariantId) {
//         product.defaultVariantId = created.id;

//         await this.productRepo.update(product, tx);
//       }

//       return created;
//     });
//   }

//   // =======================
//   // 🖼 IMAGE HANDLER (REUSED)
//   // =======================

//   private async handleImages(variantId: string, name: string, input: any, tx: any) {
//     let mainImageId: string | null = null;

//     if (input.mainImage) {
//       const img = await this.imageRepo.create(
//         new ProductImage(
//           crypto.randomUUID(),
//           new ImageUrlVO(input.mainImage).getValue(),
//           ImageType.MAIN,
//           ImageOwnerType.VARIANT,
//           undefined,
//           variantId,
//           name,
//           0,
//         ),
//         tx,
//       );

//       mainImageId = img.id;
//     }

//     for (const img of input.images ?? []) {
//       await this.imageRepo.create(
//         new ProductImage(
//           crypto.randomUUID(),
//           new ImageUrlVO(img.url).getValue(),
//           ImageType.GALLERY,
//           ImageOwnerType.VARIANT,
//           undefined,
//           variantId,
//           img.alt,
//           img.sortOrder ?? 0,
//         ),
//         tx,
//       );
//     }

//     if (mainImageId) {
//       await this.imageRepo.setMainImageForVariant(variantId, mainImageId, tx);
//     }
//   }

//   private async generateUniqueSlug(base: string): Promise<string> {
//     let slug = base;
//     let counter = 1;

//     while (await this.variantRepo.existsBySlug(slug)) {
//       slug = `${base}-${counter++}`;
//     }

//     return slug;
//   }
// }
