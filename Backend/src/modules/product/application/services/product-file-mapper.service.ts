// src/modules/product/application/services/product-file-mapper.service.ts

import { Injectable } from '@nestjs/common';

type VariantFileInput = {
  images?: {
    id?: string;
    isDeleted?: boolean;
  }[];
};

type VariantMappedFiles = {
  mainFile?: Express.Multer.File;
  galleryFiles: Express.Multer.File[];
};

@Injectable()
export class ProductFileMapperService {
  // =======================
  // 🖼 MAP IMAGE URLS
  // =======================

  mapProductImages(urls: string[], alt?: string, startOrder = 0) {
    return urls.map((url, index) => ({
      url,
      alt,
      sortOrder: startOrder + index,
    }));
  }

  // =======================
  // 📦 MAP VARIANT FILES
  // =======================

  mapVariantFiles(
    variants: VariantFileInput[],
    files: {
      variantMainImages?: Express.Multer.File[];
      variantImages?: Express.Multer.File[];
    },
  ): (VariantFileInput & VariantMappedFiles)[] {
    let mainIndex = 0;

    let galleryIndex = 0;

    return variants.map((variant) => {
      // =======================
      // ⭐ MAIN IMAGE
      // =======================

      const mainFile = files.variantMainImages?.[mainIndex++];

      // =======================
      // 🖼 NEW GALLERY IMAGE COUNT
      // =======================

      const galleryCount =
        variant.images?.filter((image) => !image.id && image.isDeleted !== true).length ?? 0;

      // =======================
      // 🖼 GALLERY FILES
      // =======================

      const galleryFiles =
        files.variantImages?.slice(galleryIndex, galleryIndex + galleryCount) ?? [];

      galleryIndex += galleryCount;

      return {
        ...variant,
        mainFile,
        galleryFiles,
      };
    });
  }
}
