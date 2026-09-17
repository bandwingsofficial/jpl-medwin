jest.mock('uuid', () => ({ v4: () => 'mocked-uuid' }));

import { ProductUploadService } from './product-upload.service';
import { S3Service } from '@/modules/upload/infrastructure/s3.service';
import { UploadImageUseCase } from '@/modules/upload/application/upload-image.usecase';
import { ProductGalleryService } from './product-gallery.service';
import { Product } from '../../domain/entities/product.entity';
import { ProductImage } from '../../domain/entities/product-image.entity';
import { ImageType } from '../../domain/enums/image-type.enum';
import { ImageOwnerType } from '../../domain/enums/image-owner-type.enum';
import { ProductType } from '../../domain/enums/product-type.enum';
import { CustomerType } from '../../domain/enums/customer-type.enum';
import { ProductStatus } from '../../domain/enums/product-status.enum';

describe('Product Image Overwrite & Synchronization', () => {
  let s3Service: jest.Mocked<S3Service>;
  let uploadUseCase: jest.Mocked<UploadImageUseCase>;
  let productUploadService: ProductUploadService;
  let imageRepo: any;
  let productGalleryService: ProductGalleryService;

  beforeEach(() => {
    s3Service = {
      uploadToKey: jest.fn(),
      uploadFile: jest.fn(),
      extractKeyFromUrl: jest.fn((url: string) => {
        if (!url) return '';
        const clean = url.split('?')[0];
        try {
          const parsed = new URL(clean);
          return decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
        } catch {
          return decodeURIComponent(clean.replace(/^\/+/, ''));
        }
      }),
      listKeys: jest.fn().mockResolvedValue([]),
      getPublicUrl: jest.fn((key: string) => `https://mcj-assets.s3.ap-south-1.amazonaws.com/${key}`),
      deleteFile: jest.fn(),
      objectExists: jest.fn(),
    } as any;

    uploadUseCase = {
      getExtension: jest.fn((file: any) => '.webp'),
      execute: jest.fn(),
      delete: jest.fn(),
    } as any;

    productUploadService = new ProductUploadService(uploadUseCase, s3Service);

    imageRepo = {
      findByProduct: jest.fn(),
      create: jest.fn((img) => Promise.resolve(img)),
      update: jest.fn((img) => Promise.resolve(img)),
      setMainImageForProduct: jest.fn(),
      softDelete: jest.fn(),
    };

    productGalleryService = new ProductGalleryService(imageRepo);
  });

  const dummyFile: Express.Multer.File = {
    fieldname: 'mainImage',
    originalname: 'new-photo.webp',
    encoding: '7bit',
    mimetype: 'image/webp',
    size: 1024,
    buffer: Buffer.from('fake-image-bytes'),
    stream: null as any,
    destination: '',
    filename: '',
    path: '',
  };

  const sampleProduct = new Product(
    'PROD-123',
    'Test Product',
    'test-product',
    ProductType.SIMPLE,
    CustomerType.DOCTOR,
    'CAT-1',
    'SUB-1',
    'BRAND-1',
    ProductStatus.ACTIVE,
  );

  describe('Test 1 — Existing MAIN image replacement', () => {
    it('should overwrite the existing S3 key without generating a new UUID key', async () => {
      const existingUrl = 'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/abc123-main.webp';
      s3Service.uploadToKey.mockResolvedValueOnce({
        key: 'products/123/abc123-main.webp',
        url: existingUrl,
      });

      const uploadedUrls: string[] = [];
      const resultUrl = await productUploadService.uploadProductMainImage(
        'PROD-123',
        dummyFile,
        existingUrl,
        uploadedUrls,
        'test-product',
        'Test Product',
      );

      expect(s3Service.uploadToKey).toHaveBeenCalledWith(
        dummyFile,
        'products/123/abc123-main.webp',
      );
      expect(resultUrl).toBe(existingUrl);
      expect(uploadedUrls).toContain(existingUrl);
    });
  });

  describe('Test 2 — Existing GALLERY image replacement', () => {
    it('should overwrite the exact existing S3 key for gallery image', async () => {
      const existingGalleryUrl = 'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/gallery-old.webp';
      s3Service.uploadToKey.mockResolvedValueOnce({
        key: 'products/123/gallery-old.webp',
        url: existingGalleryUrl,
      });

      const uploadedUrls: string[] = [];
      const resultUrl = await productUploadService.uploadProductGalleryImage(
        'PROD-123',
        'IMG-GALLERY-1',
        dummyFile,
        existingGalleryUrl,
        uploadedUrls,
        'test-product',
        'Test Product',
      );

      expect(s3Service.uploadToKey).toHaveBeenCalledWith(
        dummyFile,
        'products/123/gallery-old.webp',
      );
      expect(resultUrl).toBe(existingGalleryUrl);
    });
  });

  describe('Test 3 — Add new gallery image', () => {
    it('should generate a new stable key when no existingUrl is provided', async () => {
      s3Service.uploadToKey.mockResolvedValueOnce({
        key: 'products/Test Product/gallery/NEW-IMG-ID.webp',
        url: 'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/Test%20Product/gallery/NEW-IMG-ID.webp',
      });

      const uploadedUrls: string[] = [];
      await productUploadService.uploadProductGalleryImage(
        'PROD-123',
        'NEW-IMG-ID',
        dummyFile,
        undefined,
        uploadedUrls,
        'test-product',
        'Test Product',
      );

      expect(s3Service.uploadToKey).toHaveBeenCalledWith(
        dummyFile,
        'products/Test Product/gallery/NEW-IMG-ID.webp',
      );
    });
  });

  describe('Test 4 — Remove gallery image & Test 5 — Reorder gallery images', () => {
    it('should soft-delete removed images and update sortOrder on retained images without S3 operations', async () => {
      const existingImg1 = new ProductImage(
        'IMG-1',
        'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/img1.webp',
        ImageType.GALLERY,
        ImageOwnerType.PRODUCT,
        'PROD-123',
        undefined,
        'Alt 1',
        0,
      );
      const existingImg2 = new ProductImage(
        'IMG-2',
        'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/img2.webp',
        ImageType.GALLERY,
        ImageOwnerType.PRODUCT,
        'PROD-123',
        undefined,
        'Alt 2',
        1,
      );

      imageRepo.findByProduct.mockResolvedValueOnce([existingImg1, existingImg2]);

      // Reorder IMG-2 to position 0, remove IMG-1
      await productGalleryService.sync(
        sampleProduct,
        {
          images: [
            {
              id: 'IMG-2',
              url: 'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/img2.webp?t=170000',
              sortOrder: 0,
              alt: 'Updated Alt 2',
            },
          ],
        },
      );

      // IMG-2 updated with new sortOrder and alt
      expect(imageRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'IMG-2',
          sortOrder: 0,
          alt: 'Updated Alt 2',
        }),
        undefined,
      );

      // IMG-1 soft-deleted because it was removed
      expect(imageRepo.softDelete).toHaveBeenCalledWith('IMG-1', undefined);
      expect(s3Service.uploadToKey).not.toHaveBeenCalled();
    });
  });

  describe('Test 6 — Update product without changing images', () => {
    it('should make 0 imageRepo changes and 0 S3 uploads when images match', async () => {
      const existingMain = new ProductImage(
        'MAIN-1',
        'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/main.webp',
        ImageType.MAIN,
        ImageOwnerType.PRODUCT,
        'PROD-123',
      );
      const existingGallery = new ProductImage(
        'GAL-1',
        'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/gal1.webp',
        ImageType.GALLERY,
        ImageOwnerType.PRODUCT,
        'PROD-123',
        undefined,
        'Alt 1',
        0,
      );

      imageRepo.findByProduct.mockResolvedValueOnce([existingMain, existingGallery]);

      await productGalleryService.sync(
        sampleProduct,
        {
          mainImage: 'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/main.webp?t=99999',
          images: [
            {
              id: 'GAL-1',
              url: 'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/gal1.webp?t=99999',
              sortOrder: 0,
              alt: 'Alt 1',
            },
          ],
        },
      );

      expect(imageRepo.create).not.toHaveBeenCalled();
      expect(imageRepo.softDelete).not.toHaveBeenCalled();
      expect(imageRepo.update).not.toHaveBeenCalled();
    });
  });

  describe('Test 7 — Replace multiple images in one update', () => {
    it('should overwrite existing main & gallery, preserve unchanged gallery, add new gallery, and delete removed gallery', async () => {
      const existingMain = new ProductImage(
        'MAIN-1',
        'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/main-old.webp',
        ImageType.MAIN,
        ImageOwnerType.PRODUCT,
        'PROD-123',
      );
      const existingGal1 = new ProductImage(
        'GAL-1',
        'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/gal1-old.webp',
        ImageType.GALLERY,
        ImageOwnerType.PRODUCT,
        'PROD-123',
        undefined,
        'Old Alt 1',
        0,
      );
      const existingGal2 = new ProductImage(
        'GAL-2',
        'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/gal2-unchanged.webp',
        ImageType.GALLERY,
        ImageOwnerType.PRODUCT,
        'PROD-123',
        undefined,
        'Alt 2',
        1,
      );
      const existingGal4 = new ProductImage(
        'GAL-4',
        'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/gal4-to-delete.webp',
        ImageType.GALLERY,
        ImageOwnerType.PRODUCT,
        'PROD-123',
        undefined,
        'Alt 4',
        2,
      );

      // 1. Upload replacements
      s3Service.uploadToKey.mockResolvedValueOnce({
        key: 'products/123/main-old.webp',
        url: 'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/main-old.webp',
      });
      s3Service.uploadToKey.mockResolvedValueOnce({
        key: 'products/123/gal1-old.webp',
        url: 'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/gal1-old.webp',
      });
      s3Service.uploadToKey.mockResolvedValueOnce({
        key: 'products/Test Product/gallery/GAL-3-NEW.webp',
        url: 'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/Test%20Product/gallery/GAL-3-NEW.webp',
      });

      const mainUploadUrl = await productUploadService.uploadProductMainImage(
        'PROD-123',
        dummyFile,
        existingMain.url,
      );
      expect(s3Service.uploadToKey).toHaveBeenNthCalledWith(1, dummyFile, 'products/123/main-old.webp');
      expect(mainUploadUrl).toBe('https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/main-old.webp');

      const gal1UploadUrl = await productUploadService.uploadProductGalleryImage(
        'PROD-123',
        'GAL-1',
        dummyFile,
        existingGal1.url,
      );
      expect(s3Service.uploadToKey).toHaveBeenNthCalledWith(2, dummyFile, 'products/123/gal1-old.webp');
      expect(gal1UploadUrl).toBe('https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/gal1-old.webp');

      const gal3UploadUrl = await productUploadService.uploadProductGalleryImage(
        'PROD-123',
        'GAL-3-NEW',
        dummyFile,
        undefined,
        [],
        'test-product',
        'Test Product',
      );
      expect(s3Service.uploadToKey).toHaveBeenNthCalledWith(3, dummyFile, 'products/Test Product/gallery/GAL-3-NEW.webp');

      // 2. Synchronize gallery in database
      imageRepo.findByProduct.mockResolvedValueOnce([existingMain, existingGal1, existingGal2, existingGal4]);

      await productGalleryService.sync(sampleProduct, {
        mainImage: mainUploadUrl,
        images: [
          {
            id: 'GAL-1',
            url: gal1UploadUrl,
            alt: 'Updated Alt 1',
            sortOrder: 0,
          },
          {
            id: 'GAL-2',
            url: existingGal2.url,
            alt: 'Alt 2',
            sortOrder: 1,
          },
          {
            id: 'GAL-3-NEW',
            url: gal3UploadUrl,
            alt: 'New Image 3',
            sortOrder: 2,
          },
        ],
      });

      // GAL-1 updated in place (alt updated, same ID and URL)
      expect(imageRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'GAL-1',
          url: 'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/123/gal1-old.webp',
          alt: 'Updated Alt 1',
          sortOrder: 0,
        }),
        undefined,
      );

      // GAL-3 created
      expect(imageRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'GAL-3-NEW',
          url: 'https://mcj-assets.s3.ap-south-1.amazonaws.com/products/Test%20Product/gallery/GAL-3-NEW.webp',
          alt: 'New Image 3',
          sortOrder: 2,
        }),
        undefined,
      );

      // GAL-4 soft-deleted
      expect(imageRepo.softDelete).toHaveBeenCalledWith('GAL-4', undefined);
    });
  });
});
