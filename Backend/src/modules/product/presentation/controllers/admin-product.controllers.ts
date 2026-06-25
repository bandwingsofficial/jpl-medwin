import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
  UseGuards,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { multerConfig } from '@/modules/upload/infrastructure/multer.config';
import { excelMulterConfig } from '@/modules/upload/infrastructure/excel-multer.config';
import { ImportMode } from '../../application/dtos/import-products.dto';
import { UploadImageUseCase } from '@/modules/upload/application/upload-image.usecase';

// ================= PRODUCT USE CASES =================

import { CreateProductUseCase } from '../../../product/application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../../product/application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../../product/application/use-cases/delete-product.use-case';

import { GetProductsUseCase } from '../../../product/application/use-cases/get-products.use-case';
import { GetProductDetailUseCase } from '../../../product/application/use-cases/get-product-detail.use-case';

import { UpdateProductStatusUseCase } from '../../../product/application/use-cases/update-product-status.use-case';
import { PreviewProductImportUseCase } from '../../application/use-cases/preview-product-import.use-case';
import { ImportProductsUseCase } from '../../application/use-cases/import-products.use-case';
import { ExportProductsUseCase } from '../../application/use-cases/export-products.use-case';

// ================= VARIANT USE CASES =================

// import { AddVariantUseCase } from '../../../product/application/use-cases/add-variant.usecase';
// import { UpdateVariantUseCase } from '../../../product/application/use-cases/update-variant.use-case';
// import { DeleteVariantUseCase } from '../../../product/application/use-cases/delete-variant.use-case';
import { GetVariantsUseCase } from '../../../product/application/use-cases/get-variants.use-case';
import { UpdateVariantStatusUseCase } from '../../../product/application/use-cases/update-variant-status.use-case';
import { RestoreVariantUseCase } from '../../../product/application/use-cases/restore-variant.use-case';

// ================= DTO =================

import { CreateProductDto } from '../../application/dtos/create-product.dto';
import { UpdateProductDto } from '../../application/dtos/update-product.dto';

import { ProductStatus } from '../../domain/enums/product-status.enum';
import { ProductResponseMapper } from '../../infrastructure/persistence/prisma/mappers/product-response.mapper';
import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';
import { UserRole } from '@/modules/auth/domain/enums/user-role.enum';
import { Roles } from '@/modules/category/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminProductController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly updateProductStatusUseCase: UpdateProductStatusUseCase,
    private readonly getProducts: GetProductsUseCase,
    private readonly getProductDetail: GetProductDetailUseCase,

    private readonly uploadUseCase: UploadImageUseCase,
    private readonly previewImportUseCase: PreviewProductImportUseCase,
    private readonly importProductsUseCase: ImportProductsUseCase,
    private readonly exportProductsUseCase: ExportProductsUseCase,

    // 🔥 VARIANTS
    // private readonly deleteVariantUseCase: DeleteVariantUseCase,
    private readonly getVariantsUseCase: GetVariantsUseCase,
    private readonly updateVariantStatusUseCase: UpdateVariantStatusUseCase,
    private readonly restoreVariantUseCase: RestoreVariantUseCase,
  ) {}

  // ================= CREATE PRODUCT =================

  // @Post()
  // @UseInterceptors(
  //   FileFieldsInterceptor(
  //     [
  //       { name: 'mainImage', maxCount: 1 },
  //       { name: 'images', maxCount: 20 },
  //       { name: 'variantMainImages', maxCount: 20 },
  //       { name: 'variantImages', maxCount: 50 },
  //     ],
  //     multerConfig,
  //   ),
  // )
  // async create(
  //   @UploadedFiles()
  //   files: {
  //     mainImage?: Express.Multer.File[];
  //     images?: Express.Multer.File[];
  //     variantMainImages?: Express.Multer.File[];
  //     variantImages?: Express.Multer.File[];
  //   },
  //   @Body() rawDto: any,
  // ) {
  //   const uploadedUrls: string[] = [];

  //   try {
  //     // =======================
  //     // 🔥 SAFE HELPERS
  //     // =======================

  //     const parseJson = (val: any, fallback: any) => {
  //       try {
  //         return typeof val === 'string' ? JSON.parse(val) : (val ?? fallback);
  //       } catch {
  //         return fallback;
  //       }
  //     };

  //     const toBoolean = (val: any) => val === true || val === 'true';

  //     const toNumber = (val: any): number | undefined => {
  //       if (val === null || val === undefined || val === '') {
  //         return undefined;
  //       }

  //       const parsed = Number(val);

  //       return Number.isNaN(parsed) ? undefined : parsed;
  //     };

  //     // =======================
  //     // 🔥 PARSE ROOT JSON
  //     // =======================

  //     const parsedData =
  //       typeof rawDto.data === 'string' ? JSON.parse(rawDto.data) : rawDto.data || {};

  //     console.log('🔥 RAW DTO =>', rawDto);

  //     console.log('🔥 PARSED DATA =>', parsedData);

  //     // =======================
  //     // 🔥 DTO BUILD
  //     // =======================

  //     const dto: CreateProductDto = {
  //       // BASIC
  //       name: parsedData.name?.trim(),

  //       type: parsedData.type,

  //       status: parsedData.status,

  //       categoryId: parsedData.categoryId,

  //       subCategoryId: parsedData.subCategoryId,

  //       miniCategoryId: parsedData.miniCategoryId,

  //       brandId: parsedData.brandId,

  //       shortDescription: parsedData.shortDescription?.trim(),

  //       longDescription: parsedData.longDescription?.trim(),

  //       // ARRAYS
  //       features: parsedData.features || [],

  //       tags: parsedData.tags || [],

  //       displayNotes: parsedData.displayNotes || [],

  //       specifications: parsedData.specifications || [],

  //       packing: parsedData.packing || [],

  //       directionOfUse: parsedData.directionOfUse || [],

  //       additionalInfo: parsedData.additionalInfo || [],

  //       faq: parsedData.faq || [],

  //       // VARIANTS
  //       variants: (parsedData.variants || []).map((v: any) => ({
  //         ...v,

  //         purchasePrice: toNumber(v.purchasePrice),

  //         sellingPrice: toNumber(v.sellingPrice),

  //         mrp: toNumber(v.mrp),

  //         quantity: toNumber(v.quantity),

  //         attributes: v.attributes || {},
  //       })),

  //       // BOOLEAN
  //       isWeighted: toBoolean(parsedData.isWeighted),

  //       // NUMBER
  //       warrantyMonths: toNumber(parsedData.warrantyMonths),
  //     };

  //     console.log('🔥 FINAL DTO =>', dto);

  //     // =======================
  //     // 📤 UPLOAD HELPERS
  //     // =======================

  //     const uploadFile = async (file?: Express.Multer.File) => {
  //       if (!file) return undefined;

  //       const res = await this.uploadUseCase.execute(file, 'products');
  //       uploadedUrls.push(res.url);

  //       return res.url;
  //     };

  //     const uploadMany = async (files?: Express.Multer.File[]) => {
  //       if (!files?.length) return [];

  //       const results: string[] = [];

  //       for (const file of files) {
  //         const url = await uploadFile(file);
  //         if (url) results.push(url);
  //       }

  //       return results;
  //     };

  //     // =======================
  //     // 🖼 PRODUCT IMAGES
  //     // =======================

  //     const mainImage = await uploadFile(files.mainImage?.[0]);

  //     const galleryUrls = await uploadMany(files.images);

  //     const productImages = galleryUrls.map((url, i) => ({
  //       url,
  //       alt: dto.name,
  //       sortOrder: i,
  //     }));

  //     // =======================
  //     // 🔥 VARIANT FILE MAPPING
  //     // =======================

  //     let mainIndex = 0;
  //     let galleryIndex = 0;

  //     const variants = (dto.variants ?? []).map((v: any) => {
  //       const mainFile = files.variantMainImages?.[mainIndex++];

  //       const galleryCount = v.images?.length || 0;

  //       const galleryFiles =
  //         files.variantImages?.slice(galleryIndex, galleryIndex + galleryCount) || [];

  //       galleryIndex += galleryCount;

  //       return {
  //         ...v,
  //         mainFile,
  //         galleryFiles,
  //       };
  //     });

  //     // =======================
  //     // 🚀 UPLOAD VARIANT IMAGES
  //     // =======================

  //     for (const v of variants) {
  //       if (v.mainFile) {
  //         v.mainImage = await uploadFile(v.mainFile);
  //       }

  //       const galleryUrls = await uploadMany(v.galleryFiles);

  //       v.images = galleryUrls.map((url, i) => ({
  //         url,
  //         alt: v.name,
  //         sortOrder: i,
  //       }));

  //       delete v.mainFile;
  //       delete v.galleryFiles;
  //     }

  //     // =======================
  //     // 🚀 EXECUTE USECASE
  //     // =======================

  //     const product = await this.createProduct.execute({
  //       ...dto,
  //       mainImage,
  //       images: productImages,
  //       variants,
  //     });

  //     return ProductResponseMapper.map(product);
  //   } catch (err) {
  //     await this.safeDeleteMany(uploadedUrls);
  //     throw err;
  //   }
  // }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'images', maxCount: 20 },
        { name: 'variantMainImages', maxCount: 20 },
        { name: 'variantImages', maxCount: 50 },
      ],
      multerConfig,
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      mainImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
      variantMainImages?: Express.Multer.File[];
      variantImages?: Express.Multer.File[];
    },

    @Body() rawDto: any,
  ) {
    const uploadedUrls: string[] = [];

    try {
      // =======================
      // 🔥 HELPERS
      // =======================

      const parseJson = (val: any, fallback: any) => {
        try {
          if (val === undefined || val === null || val === '') {
            return fallback;
          }

          return typeof val === 'string' ? JSON.parse(val) : val;
        } catch {
          return fallback;
        }
      };

      const toBoolean = (val: any) => {
        return val === true || val === 'true';
      };

      const toNumber = (val: any): number | undefined => {
        if (val === undefined || val === null || val === '') {
          return undefined;
        }

        const parsed = Number(val);

        return Number.isNaN(parsed) ? undefined : parsed;
      };

      // =======================
      // 🔥 SUPPORT BOTH
      // raw form-data + data json
      // =======================

      const parsedData =
        typeof rawDto.data === 'string' ? JSON.parse(rawDto.data) : rawDto.data || rawDto;

      console.log('🔥 RAW DTO =>', rawDto);

      console.log('🔥 PARSED DATA =>', parsedData);

      // =======================
      // 🔥 DTO BUILD
      // =======================

      const dto: CreateProductDto = {
        // BASIC
        name: parsedData.name?.trim(),

        type: parsedData.type,

        status: parsedData.status,

        categoryId: parsedData.categoryId,

        subCategoryId: parsedData.subCategoryId,

        miniCategoryId: parsedData.miniCategoryId,

        brandId: parsedData.brandId,

        shortDescription: parsedData.shortDescription?.trim(),

        longDescription: parsedData.longDescription?.trim(),

        // ARRAYS
        features: parseJson(parsedData.features, []),

        tags: parseJson(parsedData.tags, []),

        displayNotes: parseJson(parsedData.displayNotes, []),

        specifications: parseJson(parsedData.specifications, []),

        packing: parseJson(parsedData.packing, []),

        directionOfUse: parseJson(parsedData.directionOfUse, []),

        additionalInfo: parseJson(parsedData.additionalInfo, []),

        faq: parseJson(parsedData.faq, []),

        // VARIANTS
        variants: parseJson(parsedData.variants, []).map((v: any) => ({
          ...v,

          purchasePrice: toNumber(v.purchasePrice),

          sellingPrice: toNumber(v.sellingPrice),

          mrp: toNumber(v.mrp),

          quantity: toNumber(v.quantity),

          attributes: v.attributes || {},
        })),

        // BOOLEAN
        isWeighted: toBoolean(parsedData.isWeighted),

        // NUMBER
        warrantyMonths: toNumber(parsedData.warrantyMonths),
      };

      console.log('🔥 FINAL DTO =>', dto);

      // =======================
      // 📤 UPLOAD HELPERS
      // =======================

      const uploadFile = async (file?: Express.Multer.File) => {
        if (!file) return undefined;

        const res = await this.uploadUseCase.execute(file, 'products');

        uploadedUrls.push(res.url);

        return res.url;
      };

      const uploadMany = async (files?: Express.Multer.File[]) => {
        if (!files?.length) return [];

        const results: string[] = [];

        for (const file of files) {
          const url = await uploadFile(file);

          if (url) {
            results.push(url);
          }
        }

        return results;
      };

      // =======================
      // 🖼 PRODUCT IMAGES
      // =======================

      const mainImage = await uploadFile(files.mainImage?.[0]);

      const galleryUrls = await uploadMany(files.images);

      const productImages = galleryUrls.map((url, i) => ({
        url,
        alt: dto.name,
        sortOrder: i,
      }));

      // =======================
      // 🔥 VARIANT FILE MAPPING
      // =======================

      let mainIndex = 0;

      let galleryIndex = 0;

      const variants = (dto.variants ?? []).map((v: any) => {
        const mainFile = files.variantMainImages?.[mainIndex++];

        const galleryCount = v.images?.length || 0;

        const galleryFiles =
          files.variantImages?.slice(galleryIndex, galleryIndex + galleryCount) || [];

        galleryIndex += galleryCount;

        return {
          ...v,
          mainFile,
          galleryFiles,
        };
      });

      // =======================
      // 🚀 UPLOAD VARIANT IMAGES
      // =======================

      for (const v of variants) {
        if (v.mainFile) {
          v.mainImage = await uploadFile(v.mainFile);
        }

        const galleryUrls = await uploadMany(v.galleryFiles);

        v.images = galleryUrls.map((url, i) => ({
          url,
          alt: v.name,
          sortOrder: i,
        }));

        delete v.mainFile;

        delete v.galleryFiles;
      }

      // =======================
      // 🚀 EXECUTE
      // =======================

      const product = await this.createProduct.execute({
        ...dto,
        mainImage,
        images: productImages,
        variants,
      });

      return ProductResponseMapper.map(product);
    } catch (err) {
      await this.safeDeleteMany(uploadedUrls);

      throw err;
    }
  }

  // ================= UPDATE PRODUCT =================

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'images', maxCount: 20 },

        { name: 'variantMainImages', maxCount: 20 },
        { name: 'variantImages', maxCount: 50 },
      ],
      multerConfig,
    ),
  )
  async update(
    @Param('id') id: string,

    @UploadedFiles()
    files: {
      mainImage?: Express.Multer.File[];
      images?: Express.Multer.File[];

      variantMainImages?: Express.Multer.File[];
      variantImages?: Express.Multer.File[];
    },

    @Body() rawDto: any,
  ) {
    const uploadedUrls: string[] = [];

    try {
      // =======================
      // 🔥 HELPERS
      // =======================

      const parseJson = (val: any, fallback: any) => {
        try {
          if (val === undefined || val === null || val === '') {
            return fallback;
          }

          return typeof val === 'string' ? JSON.parse(val) : val;
        } catch (err) {
          return fallback;
        }
      };

      const toBoolean = (val: any) => val === true || val === 'true';

      const toNumber = (val: any) => {
        if (val === null || val === undefined || val === '') {
          return undefined;
        }

        return Number(val);
      };

      // =======================
      // 🔥 DTO BUILD
      // =======================

      const dto: any = {
        ...rawDto,

        features: parseJson(rawDto.features, undefined),

        tags: parseJson(rawDto.tags, undefined),

        displayNotes: parseJson(rawDto.displayNotes, undefined),

        specifications: parseJson(rawDto.specifications, undefined),

        packing: parseJson(rawDto.packing, undefined),

        directionOfUse: parseJson(rawDto.directionOfUse, undefined),

        additionalInfo: parseJson(rawDto.additionalInfo, undefined),

        faq: parseJson(rawDto.faq, undefined),

        variants: (parseJson(rawDto.variants, []) ?? []).map((v: any) => {
          const mappedImages =
            v.images !== undefined
              ? parseJson(v.images, []).map((img: any, index: number) => {
                  const mapped = {
                    id: img.id,

                    url: img.url,

                    alt: img.alt,

                    // 🔥 IMPORTANT
                    isDeleted: img.isDeleted === true || img.isDeleted === 'true',

                    sortOrder: img.sortOrder ?? index,
                  };

                  return mapped;
                })
              : undefined;

          return {
            ...v,

            purchasePrice: toNumber(v.purchasePrice),

            sellingPrice: toNumber(v.sellingPrice),

            mrp: toNumber(v.mrp),

            quantity: toNumber(v.quantity),

            averageRating: v.averageRating !== undefined ? toNumber(v.averageRating) : undefined,

            reviewCount: v.reviewCount !== undefined ? toNumber(v.reviewCount) : undefined,

            isWeighted: v.isWeighted !== undefined ? toBoolean(v.isWeighted) : undefined,

            warrantyMonths: v.warrantyMonths !== undefined ? toNumber(v.warrantyMonths) : undefined,

            attributes: parseJson(v.attributes, {}),

            images: mappedImages,
          };
        }),

        isWeighted: rawDto.isWeighted !== undefined ? toBoolean(rawDto.isWeighted) : undefined,

        warrantyMonths:
          rawDto.warrantyMonths !== undefined ? toNumber(rawDto.warrantyMonths) : undefined,
      };

      // =======================
      // 📤 UPLOAD HELPERS
      // =======================

      const uploadFile = async (file?: Express.Multer.File) => {
        if (!file) {
          return undefined;
        }

        const res = await this.uploadUseCase.execute(file, 'products');

        uploadedUrls.push(res.url);
        return res.url;
      };

      const uploadMany = async (files?: Express.Multer.File[]) => {
        if (!files?.length) {
          return [];
        }

        const urls: string[] = [];

        for (const file of files) {
          const url = await uploadFile(file);

          if (url) {
            urls.push(url);
          }
        }

        return urls;
      };

      // =======================
      // 🖼 PRODUCT IMAGES
      // =======================

      const mainImage = await uploadFile(files.mainImage?.[0]);

      if (mainImage) {
        console.log('🔥 PRODUCT MAIN IMAGE UPLOADED:', mainImage);
      }

      const galleryUrls = await uploadMany(files.images);

      if (galleryUrls.length) {
        console.log('🔥 NEW PRODUCT GALLERY IMAGES:', galleryUrls);
      }

      // 🔥 EXISTING PRODUCT IMAGES
      const existingProductImages = parseJson(rawDto.imagesData, []) ?? [];

      console.log('🔥 EXISTING PRODUCT IMAGES:', existingProductImages);

      // 🔥 NEW PRODUCT GALLERY
      const uploadedProductImages = galleryUrls.map((url, i) => ({
        url,
        alt: dto.name,
        sortOrder: existingProductImages.length + i,
      }));

      // 🔥 FINAL PRODUCT GALLERY
      const productImages = [...existingProductImages, ...uploadedProductImages];

      console.log('🔥 FINAL PRODUCT GALLERY:', productImages);

      // =======================
      // 🔥 VARIANT FILE MAPPING
      // =======================

      let mainIdx = 0;
      let galleryIdx = 0;

      const variants = (dto.variants ?? []).map((v: any) => {
        const mainFile = files.variantMainImages?.[mainIdx++];

        const galleryCount = v.images?.filter((img: any) => !img.id && !img.isDeleted).length || 0;

        const galleryFiles =
          files.variantImages?.slice(galleryIdx, galleryIdx + galleryCount) ?? [];

        galleryIdx += galleryCount;

        return {
          ...v,
          mainFile,
          galleryFiles,
        };
      });

      // =======================
      // 🚀 UPLOAD VARIANT IMAGES
      // =======================

      for (const v of variants) {
        // =======================
        // MAIN IMAGE
        // =======================

        if (v.mainFile) {
          v.mainImage = await uploadFile(v.mainFile);

          console.log(`🔥 VARIANT MAIN IMAGE UPDATED (${v.id}):`, v.mainImage);
        }

        // =======================
        // GALLERY
        // =======================

        const urls = await uploadMany(v.galleryFiles);

        if (urls.length) {
          console.log(`🔥 NEW VARIANT GALLERY IMAGES (${v.id}):`, urls);
        }

        if (urls.length) {
          const uploadedImages = urls.map((url, i) => ({
            url,
            alt: v.name,
            sortOrder: (v.images?.length || 0) + i,
          }));

          v.images = [...(v.images ?? []), ...uploadedImages];
        }

        console.log(`🔥 FINAL VARIANT IMAGES (${v.id}):`, v.images);

        delete v.mainFile;
        delete v.galleryFiles;
      }

      // =======================
      // 🚀 EXECUTE
      // =======================

      console.log('\n🔥 EXECUTING UPDATE USECASE');

      const product = await this.updateProduct.execute({
        id,

        ...dto,

        mainImage,

        images: productImages,

        variants,
      });

      console.log('✅ UPDATE SUCCESS');

      return ProductResponseMapper.map(product);
    } catch (err) {
      console.log('❌ UPDATE FAILED:', err);

      await this.safeDeleteMany(uploadedUrls);

      throw err;
    }
  }

  // // ================= UPDATE VARIANT STATUS =================
  @Patch(':productId/variants/:variantId/status')
  async updateVariantStatus(
    @Param('productId')
    productId: string,

    @Param('variantId')
    variantId: string,

    @Body()
    body: {
      status: ProductStatus;
    },
  ) {
    const result = await this.updateVariantStatusUseCase.execute({
      productId,
      id: variantId,
      status: body.status,
    });

    return result;
  }

  //========================update product status endpoint=======================
  @Patch(':id/status')
  async updateProductStatus(
    @Param('id') id: string,

    @Body()
    body: {
      status: ProductStatus;
      force?: boolean;
    },
  ) {
    return this.updateProductStatusUseCase.execute({
      id,
      status: body.status,
      force: body.force,
    });
  }

  //=====================product delete endpoint========================
  @Delete(':productId')
  async deleteProduct(
    @Param('productId')
    productId: string,

    @Query('force')
    force?: string,

    @Query('preview')
    preview?: string,
  ) {
    return this.deleteProductUseCase.execute(
      productId,

      force === 'true',

      preview === 'true',
    );
  }

  // // ================= RESTORE VARIANT =================
  @Patch(':productId/variants/:variantId/restore')
  async restoreVariant(
    @Param('productId')
    productId: string,

    @Param('variantId')
    variantId: string,
  ) {
    return this.restoreVariantUseCase.execute(variantId);
  }

  // ========================
  // 📦 PREVIEW IMPORT
  // ========================

  @Post('import/preview')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'file',
          maxCount: 1,
        },
      ],
      excelMulterConfig,
    ),
  )
  async previewImport(
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
    },
  ) {
    const file = files.file?.[0];

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return this.previewImportUseCase.execute(file);
  }

  // ========================
  // 📦 IMPORT PRODUCTS
  // ========================

  @Post('import')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'file',
          maxCount: 1,
        },
      ],
      excelMulterConfig,
    ),
  )
  async importProducts(
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
    },

    @Query('mode')
    mode: ImportMode = ImportMode.SKIP,
  ) {
    const file = files.file?.[0];

    // ========================
    // 📄 FILE REQUIRED
    // ========================

    if (!file) {
      throw new BadRequestException('Excel file is required');
    }

    // ========================
    // 🔒 VALIDATE MODE
    // ========================

    if (!Object.values(ImportMode).includes(mode)) {
      throw new BadRequestException(`Invalid import mode '${mode}'`);
    }

    // ========================
    // 🚀 IMPORT
    // ========================

    return this.importProductsUseCase.execute(file, mode);
  }

  // ========================
  // 📦 EXPORT PRODUCTS
  // ========================

  @Get('export')
  async exportProducts(@Res() res: Response) {
    const { buffer } = await this.exportProductsUseCase.execute();

    const filename = `products-${Date.now()}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return res.end(buffer);
  }
  // ================= GET product + details =================

  @Get()
  getAll(
    @Query('categoryId')
    categoryId?: string,

    @Query('subCategoryId')
    subCategoryId?: string,

    @Query('miniCategoryId')
    miniCategoryId?: string,

    @Query('brandId')
    brandId?: string,

    @Query('type')
    type?: string,

    @Query('search')
    search?: string,

    @Query('tag')
    tag?: string,

    @Query('minPrice')
    minPrice?: string,

    @Query('maxPrice')
    maxPrice?: string,

    @Query('inStock')
    inStock?: string,

    @Query('status')
    status?: ProductStatus,

    @Query('includeVariants')
    includeVariants?: string,

    @Query('sortBy')
    sortBy?: 'newest' | 'oldest' | 'nameAsc' | 'nameDesc' | 'priceLowToHigh' | 'priceHighToLow',

    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,
  ) {
    return this.getProducts.execute({
      categoryId,

      subCategoryId,

      miniCategoryId,

      brandId,

      type,

      search,

      tag,

      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,

      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,

      inStock: inStock === 'true',

      status,

      includeVariants: includeVariants !== 'false',

      sortBy,

      page: page ? Number(page) : 1,

      limit: limit ? Number(limit) : 20,

      onlyActive: false,
    });
  }

  @Get(':id')
  getById(
    @Param('id')
    id: string,

    @Query('onlyActive')
    onlyActive?: string,
  ) {
    return this.getProductDetail.execute(id, onlyActive === 'true');
  }

  // ================= products VARIANT  =================
  @Get(':productId/variants')
  async getVariants(
    @Param('productId')
    productId: string,

    @Query('search')
    search?: string,

    @Query('onlyActive')
    onlyActive?: string,

    @Query('includeDeleted')
    includeDeleted?: string,

    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,
  ) {
    return this.getVariantsUseCase.execute({
      productId,

      search,

      onlyActive: onlyActive === 'true',

      includeDeleted: includeDeleted === 'true',

      page: page ? Number(page) : 1,

      limit: limit ? Number(limit) : 20,
    });
  }

  // ================= HELPERS =================

  private async safeDelete(url: string) {
    try {
      await this.uploadUseCase.delete(url);
    } catch {}
  }

  private async safeDeleteMany(urls: string[]) {
    for (const url of urls) {
      await this.safeDelete(url);
    }
  }
}
