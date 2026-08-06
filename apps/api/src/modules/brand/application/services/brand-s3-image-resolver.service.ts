import { Injectable } from '@nestjs/common';

import { S3Service } from '@/modules/upload/infrastructure/s3.service';

const BRAND_FOLDER = 'brands';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

@Injectable()
export class BrandS3ImageResolverService {
  constructor(private readonly s3Service: S3Service) {}

  async resolveImage(slug: string): Promise<string | null> {
    for (const extension of IMAGE_EXTENSIONS) {
      const key = `${BRAND_FOLDER}/${slug}.${extension}`;

      if (await this.s3Service.objectExists(key)) {
        return this.s3Service.getPublicUrl(key);
      }
    }

    return null;
  }
}