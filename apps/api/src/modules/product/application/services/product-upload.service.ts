import { Injectable } from '@nestjs/common';

import { UploadImageUseCase } from '@/modules/upload/application/upload-image.usecase';
import { S3Service } from '@/modules/upload/infrastructure/s3.service';

@Injectable()
export class ProductUploadService {
  constructor(
    private readonly uploadUseCase: UploadImageUseCase,
    private readonly s3Service: S3Service,
  ) {}

  // =======================
  // 📤 UPLOAD PRODUCT MAIN IMAGE (STABLE KEY OVERWRITE)
  // =======================

  async uploadProductMainImage(
    productId: string,
    file: Express.Multer.File,
    existingUrl?: string | null,
    uploadedUrls?: string[],
    productSlug?: string,
    productName?: string,
  ): Promise<string> {
    const ext = this.uploadUseCase.getExtension(file);
    let targetKey: string | null = null;

    // 1. If existingUrl is provided, extract its exact S3 key and overwrite it
    if (existingUrl) {
      const extracted = this.s3Service.extractKeyFromUrl(existingUrl);
      if (extracted) {
        targetKey = extracted;
      }
    }

    // 2. If targetKey is not determined, check S3 for any existing file under product folders
    if (!targetKey) {
      const prefixes = [
        productName ? `products/${productName.trim()}` : null,
        productSlug ? `products/${productSlug.trim()}` : null,
        productId ? `products/${productId.trim()}` : null,
      ].filter(Boolean) as string[];

      for (const prefix of prefixes) {
        const keys = await this.s3Service.listKeys(prefix);
        const existingMainKey = keys.find((k) => {
          const lower = k.toLowerCase();
          const fileName = lower.split('/').pop() || '';
          return fileName.startsWith('main.') || fileName === 'main';
        });

        if (existingMainKey) {
          targetKey = existingMainKey;
          break;
        } else if (keys.length > 0) {
          // If folder exists in S3, use this folder
          targetKey = `${prefix}/main${ext}`;
          break;
        }
      }
    }

    // 3. Fallback default key for brand new main image
    if (!targetKey) {
      const folder = productName?.trim() || productSlug?.trim() || productId;
      targetKey = `products/${folder}/main${ext}`;
    }

    console.log(`📤 Overwriting / Uploading S3 main image at key: ${targetKey}`);
    const result = await this.s3Service.uploadToKey(file, targetKey);
    if (uploadedUrls) {
      uploadedUrls.push(result.url);
    }

    return existingUrl ? existingUrl.split('?')[0] : result.url;
  }

  // =======================
  // 📤 UPLOAD PRODUCT GALLERY IMAGE (STABLE KEY OVERWRITE)
  // =======================

  async uploadProductGalleryImage(
    productId: string,
    imageId: string,
    file: Express.Multer.File,
    existingUrl?: string | null,
    uploadedUrls?: string[],
    productSlug?: string,
    productName?: string,
  ): Promise<string> {
    const ext = this.uploadUseCase.getExtension(file);
    let targetKey: string | null = null;

    // 1. If existingUrl is provided (replacement of existing gallery image), overwrite exact existing key
    if (existingUrl) {
      const extracted = this.s3Service.extractKeyFromUrl(existingUrl);
      if (extracted) {
        targetKey = extracted;
      }
    }

    // 2. Fallback key for brand new gallery image
    if (!targetKey) {
      const folder = productName?.trim() || productSlug?.trim() || productId;
      targetKey = `products/${folder}/gallery/${imageId}${ext}`;
    }

    console.log(`📤 Overwriting / Uploading S3 gallery image at key: ${targetKey}`);
    const result = await this.s3Service.uploadToKey(file, targetKey);
    if (uploadedUrls) {
      uploadedUrls.push(result.url);
    }

    return existingUrl ? existingUrl.split('?')[0] : result.url;
  }

  // =======================
  // 📤 UPLOAD SINGLE FILE
  // =======================

  async uploadFile(
    uploadedUrls: string[],
    file?: Express.Multer.File,
  ): Promise<string | undefined> {
    if (!file) {
      return undefined;
    }

    const result = await this.uploadUseCase.execute(file, 'products');

    uploadedUrls.push(result.url);

    return result.url;
  }

  // =======================
  // 📤 UPLOAD MULTIPLE FILES
  // =======================

  async uploadMany(uploadedUrls: string[], files?: Express.Multer.File[]): Promise<string[]> {
    if (!files?.length) {
      return [];
    }

    const urls: string[] = [];

    for (const file of files) {
      const url = await this.uploadFile(uploadedUrls, file);

      if (url) {
        urls.push(url);
      }
    }

    return urls;
  }

  // =======================
  // 🗑 SAFE DELETE SINGLE
  // =======================

  async safeDelete(url?: string | null): Promise<void> {
    if (!url) {
      return;
    }

    try {
      await this.uploadUseCase.delete(url);
    } catch (error) {
      console.error('Failed to delete uploaded file:', url, error);
    }
  }

  // =======================
  // 🗑 SAFE DELETE MULTIPLE
  // =======================

  async safeDeleteMany(urls?: (string | null | undefined)[]): Promise<void> {
    if (!urls?.length) {
      return;
    }

    await Promise.all(urls.map((url) => this.safeDelete(url)));
  }
}
