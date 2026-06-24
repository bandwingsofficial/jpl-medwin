// src/modules/product/application/services/product-upload.service.ts

import { Injectable } from '@nestjs/common';

import { UploadImageUseCase } from '@/modules/upload/application/upload-image.usecase';

@Injectable()
export class ProductUploadService {
  constructor(
    private readonly uploadUseCase: UploadImageUseCase,
  ) {}

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

    const result = await this.uploadUseCase.execute(
      file,
      'products',
    );

    uploadedUrls.push(result.url);

    return result.url;
  }

  // =======================
  // 📤 UPLOAD MULTIPLE FILES
  // =======================

  async uploadMany(
    uploadedUrls: string[],
    files?: Express.Multer.File[],
  ): Promise<string[]> {
    if (!files?.length) {
      return [];
    }

    const urls: string[] = [];

    for (const file of files) {
      const url = await this.uploadFile(
        uploadedUrls,
        file,
      );

      if (url) {
        urls.push(url);
      }
    }

    return urls;
  }

  // =======================
  // 🗑 SAFE DELETE SINGLE
  // =======================

  async safeDelete(
    url?: string | null,
  ): Promise<void> {
    if (!url) {
      return;
    }

    try {
      await this.uploadUseCase.delete(url);
    } catch (error) {
      console.error(
        'Failed to delete uploaded file:',
        url,
        error,
      );
    }
  }

  // =======================
  // 🗑 SAFE DELETE MULTIPLE
  // =======================

  async safeDeleteMany(
    urls?: (string | null | undefined)[],
  ): Promise<void> {
    if (!urls?.length) {
      return;
    }

    await Promise.all(
      urls.map((url) => this.safeDelete(url)),
    );
  }
}