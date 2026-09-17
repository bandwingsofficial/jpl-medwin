import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

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

        // 🔥 Prevents stale caching when images are overwritten
        CacheControl: 'no-cache, no-store, must-revalidate',
      }),
    );

    return {
      key,
      url: this.getPublicUrl(key),
    };
  }

  // =======================
  // 🔍 OBJECT EXISTS
  // =======================

  async objectExists(key: string): Promise<boolean> {
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      console.log('✅ FOUND');

      return true;
    } catch (error: any) {
      return false; // <-- NEVER throw here
    }
  }

  // =======================
  // 📋 LIST KEYS UNDER PREFIX
  // =======================

  async listKeys(prefix: string): Promise<string[]> {
    try {
      const response = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
        }),
      );

      return (response.Contents || []).map((obj) => obj.Key!).filter(Boolean);
    } catch (error) {
      console.error('❌ S3 listKeys error:', error);
      return [];
    }
  }

  // =======================
  // 🔗 PUBLIC URL
  // =======================

  getPublicUrl(key: string): string {
    return this.getFileUrl(key);
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
  const encodedKey = key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  if (this.cdn) {
    return `${this.cdn.replace(/\/$/, '')}/${encodedKey}`;
  }

  return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${encodedKey}`;
}

  // =======================
  // 📤 UPLOAD TO KEY (STABLE KEY OVERWRITE)
  // =======================

  async uploadToKey(
    file: Express.Multer.File,
    key: string,
    cacheControl: string = 'no-cache, no-store, must-revalidate',
  ): Promise<{ key: string; url: string }> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: cacheControl,
      }),
    );

    return {
      key,
      url: this.getPublicUrl(key),
    };
  }

  // =======================
  // 🧠 EXTRACT KEY FROM URL
  // =======================

  extractKeyFromUrl(fileUrl: string): string {
    try {
      if (!fileUrl) return '';
      const cleanUrl = fileUrl.trim().split('?')[0];

      if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        const url = new URL(cleanUrl);

        // works for BOTH:
        // ✅ Virtual-hosted S3 URL: https://bucket.s3.region.amazonaws.com/key
        // ✅ Path-style S3 URL: https://s3.region.amazonaws.com/bucket/key
        // ✅ CloudFront URL: https://cdn.example.com/key
        let pathname = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
        if (this.bucket && pathname.startsWith(`${this.bucket}/`)) {
          pathname = pathname.substring(this.bucket.length + 1);
        }
        return pathname;
      }

      // If it's already a relative S3 key path (e.g. products/123/abc.webp)
      let key = decodeURIComponent(cleanUrl.replace(/^\/+/, ''));
      if (this.bucket && key.startsWith(`${this.bucket}/`)) {
        key = key.substring(this.bucket.length + 1);
      }
      return key;
    } catch {
      console.error('❌ Invalid file URL:', fileUrl);
      return '';
    }
  }
}
