import { ProductImageBundle, VariantImageBundle } from '../types/product-s3-image.types';

const PLACEHOLDER_IMAGE_HOSTS = [
  'picsum.photos',
  'via.placeholder.com',
  'placehold.co',
  'placeholder.com',
  'dummyimage.com',
];

export function isPlaceholderImageUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) {
    return true;
  }

  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return PLACEHOLDER_IMAGE_HOSTS.some((host) => hostname.includes(host));
  } catch {
    return false;
  }
}

export function filterRealImageUrls(urls: string[]): string[] {
  return urls.filter((url) => !isPlaceholderImageUrl(url));
}

export function pickImportMainImage(
  s3Url: string | null,
  excelUrl: string | null | undefined,
): string | null {
  if (s3Url) {
    return s3Url;
  }

  if (isPlaceholderImageUrl(excelUrl)) {
    return null;
  }

  return excelUrl ?? null;
}

export function pickImportGalleryImages(s3Gallery: string[], excelGallery: string[]): string[] {
  if (s3Gallery.length > 0) {
    return s3Gallery;
  }

  return filterRealImageUrls(excelGallery);
}

export function mergeProductImageBundle(
  s3Bundle: ProductImageBundle,
  excelMain: string | null,
  excelGallery: string[],
): ProductImageBundle {
  return {
    mainImage: pickImportMainImage(s3Bundle.mainImage, excelMain),
    galleryImages: pickImportGalleryImages(s3Bundle.galleryImages, excelGallery),
  };
}

export function mergeVariantImageBundle(
  s3Bundle: VariantImageBundle,
  excelMain: string | null,
  excelGallery: string[],
  productBundle: ProductImageBundle,
): VariantImageBundle {
  const mainImage = pickImportMainImage(s3Bundle.mainImage, excelMain) ?? productBundle.mainImage;

  const galleryImages = (() => {
    const fromS3 = s3Bundle.galleryImages;
    const fromExcel = filterRealImageUrls(excelGallery);

    if (fromS3.length > 0) {
      return fromS3;
    }

    if (fromExcel.length > 0) {
      return fromExcel;
    }

    return productBundle.galleryImages;
  })();

  return {
    mainImage,
    galleryImages,
  };
}
