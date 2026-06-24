import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  private readonly bucket = process.env.AWS_S3_BUCKET!;
  private readonly region = process.env.AWS_REGION!;
  private readonly cdn = process.env.AWS_CLOUDFRONT_URL; // 🔥 NEW

  constructor() {
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  // =======================
  // 📤 UPLOAD FILE
  // =======================

  async uploadFile(file: Express.Multer.File, folder: string, filename: string) {
    const key = `${folder}/${filename}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,

        // 🔥 optional but recommended
        CacheControl: 'public, max-age=31536000', // 1 year cache
      }),
    );

    return {
      key,
      url: this.getFileUrl(key),
    };
  }

  // =======================
  // 🗑 DELETE FILE
  // =======================

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (!fileUrl) return;

      const key = this.extractKeyFromUrl(fileUrl);

      if (!key) {
        console.warn('⚠️ S3 delete skipped: key not found');
        return;
      }

      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      console.log('🗑 S3 deleted:', key);
    } catch (error) {
      console.error('❌ S3 delete error:', error);
      // don't throw → safe flow
    }
  }

  // =======================
  // 🔗 GET URL (CDN FIRST)
  // =======================

  private getFileUrl(key: string): string {
    // 🔥 USE CLOUDFRONT IF AVAILABLE
    if (this.cdn) {
      return `${this.cdn}/${key}`;
    }

    // fallback to S3
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  // =======================
  // 🧠 EXTRACT KEY FROM URL
  // =======================

  private extractKeyFromUrl(fileUrl: string): string {
    try {
      const url = new URL(fileUrl);

      // works for BOTH:
      // ✅ S3 URL
      // ✅ CloudFront URL
      return decodeURIComponent(url.pathname.replace(/^\/+/, ''));
    } catch {
      console.error('❌ Invalid file URL:', fileUrl);
      return '';
    }
  }
}
