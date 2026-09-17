import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { S3Service } from '../infrastructure/s3.service';

@Injectable()
export class UploadImageUseCase {
  constructor(private readonly s3: S3Service) {}

  // =======================
  // 📤 UPLOAD
  // =======================

  async execute(
    file: Express.Multer.File,
    folder: string,
    customKeyOrFilename?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const ext = this.getExtension(file);

    if (customKeyOrFilename) {
      if (customKeyOrFilename.includes('/')) {
        return this.s3.uploadToKey(file, customKeyOrFilename);
      }
      const filename = customKeyOrFilename.includes('.')
        ? customKeyOrFilename
        : `${customKeyOrFilename}${ext}`;
      return this.s3.uploadFile(file, folder, filename);
    }

    const filename = `${uuid()}${ext}`;

    return this.s3.uploadFile(file, folder, filename);
  }

  // =======================
  // 🗑 DELETE
  // =======================

  async delete(fileUrl?: string) {
    if (!fileUrl) return;
    await this.s3.deleteFile(fileUrl);
  }

  // =======================
  // 🧠 HELPERS
  // =======================

  getExtension(file: Express.Multer.File): string {
    // try from original name
    const ext = extname(file.originalname);

    if (ext) return ext;

    // fallback from mimetype
    const mimeMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };

    return mimeMap[file.mimetype] || '';
  }
}
