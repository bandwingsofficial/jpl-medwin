export class ProductResponseMapper {
  static map(product: any) {
    const variants = Array.isArray(product?.variants)
      ? product.variants
      : [];

    const images = Array.isArray(product?.images)
      ? product.images
      : [];

    // =========================
    // PRICE CALCULATION
    // =========================

    const prices = variants
      .map((v) => Number(v?.sellingPrice))
      .filter((p) => !isNaN(p));

    const minPrice =
      prices.length > 0
        ? Math.min(...prices)
        : product?.minPrice ?? null;

    const maxPrice =
      prices.length > 0
        ? Math.max(...prices)
        : product?.maxPrice ?? null;

    // =========================
    // STOCK
    // =========================

    const totalStock = variants.reduce(
      (sum, v) => sum + Number(v?.quantity ?? 0),
      0,
    );

    // =========================
    // PRODUCT IMAGES
    // =========================

    const activeImages = images.filter((i) => !i?.deletedAt);

    const mainImage =
      activeImages.find((i) => i?.type === 'MAIN')?.url ?? null;

    const gallery = activeImages
      .filter((i) => i?.type === 'GALLERY')
      .sort(
        (a, b) =>
          (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0),
      )
      .map((i) => i?.url)
      .filter(Boolean)
      .filter(
        (url, index, self) =>
          self.indexOf(url) === index,
      );

    // =========================
    // DEFAULT VARIANT
    // =========================

    const defaultVariantId =
      product?.defaultVariantId ?? null;

    // =========================
    // RESPONSE
    // =========================

    return {
      id: product?.id,

      name: product?.name,

      slug: product?.slug,

      type: product?.type ?? null,

      status: product?.status ?? null,

      currency: product?.currency ?? 'INR',

      brand: {
        id: product?.brand?.id ?? null,
        name: product?.brand?.name ?? null,
        slug: product?.brand?.slug ?? null,
      },

      category: {
        id: product?.category?.id ?? null,
        name: product?.category?.name ?? null,
        slug: product?.category?.slug ?? null,
      },

      subCategory: {
        id: product?.subCategory?.id ?? null,
        name: product?.subCategory?.name ?? null,
        slug: product?.subCategory?.slug ?? null,
      },

      miniCategory: {
        id: product?.miniCategory?.id ?? null,
        name: product?.miniCategory?.name ?? null,
        slug: product?.miniCategory?.slug ?? null,
      },

      shortDescription:
        product?.shortDescription ?? null,

      longDescription:
        product?.longDescription ?? null,

      ratings: {
        average: Number(
          product?.averageRating ?? 0,
        ),

        count: Number(
          product?.reviewCount ?? 0,
        ),
      },

      price: {
        min: minPrice,

        max: maxPrice,
      },

      stock: {
        quantity: totalStock,

        inStock: totalStock > 0,
      },

      isWeighted: Boolean(
        product?.isWeighted,
      ),

      warrantyMonths:
        product?.warrantyMonths !== undefined &&
        product?.warrantyMonths !== null
          ? Number(product.warrantyMonths)
          : null,

      images: {
        main: mainImage,

        gallery,
      },

      // =========================
      // ARRAYS
      // =========================

      features: product?.features ?? [],

      tags: product?.tags ?? [],

      displayNotes:
        product?.displayNotes ?? [],

      specifications:
        product?.specifications ?? [],

      packing: product?.packing ?? [],

      directionOfUse:
        product?.directionOfUse ?? [],

      additionalInfo:
        product?.additionalInfo ?? [],

      faq: product?.faq ?? [],

      defaultVariantId,

      createdAt: product?.createdAt,

      updatedAt: product?.updatedAt,

      deletedAt: product?.deletedAt ?? null,

      // =========================
      // VARIANTS
      // =========================

      variants: variants.map((v) => {
        const vImages = Array.isArray(v?.images)
          ? v.images
          : [];

        const activeVariantImages =
          vImages.filter((i) => !i?.deletedAt);

        const variantMainImage =
          activeVariantImages.find(
            (i) => i?.type === 'MAIN',
          )?.url ?? null;

        const variantGallery =
          activeVariantImages
            .filter(
              (i) => i?.type === 'GALLERY',
            )
            .sort(
              (a, b) =>
                (a?.sortOrder ?? 0) -
                (b?.sortOrder ?? 0),
            )
            .map((i) => i?.url)
            .filter(Boolean)
            .filter(
              (url, index, self) =>
                self.indexOf(url) === index,
            );

        return {
          id: v?.id,

          name: v?.name,

          slug: v?.slug,

          sku: v?.sku,

          status: v?.status,

          pricing: {
            sellingPrice:
              Number(v?.sellingPrice) || 0,

            mrp: Number(v?.mrp) || 0,

            purchasePrice:
              v?.purchasePrice !== undefined &&
              v?.purchasePrice !== null
                ? Number(v.purchasePrice)
                : null,
          },

          stock: {
            quantity:
              Number(v?.quantity ?? 0),

            inStock:
              Number(v?.quantity ?? 0) > 0,
          },

          attributes:
            v?.attributes ?? {},

          images: {
            main: variantMainImage,

            gallery: variantGallery,
          },

          ratings: {
            average: Number(
              v?.averageRating ?? 0,
            ),

            count: Number(
              v?.reviewCount ?? 0,
            ),
          },

          isWeighted: Boolean(
            v?.isWeighted,
          ),

          warrantyMonths:
            v?.warrantyMonths !== undefined &&
            v?.warrantyMonths !== null
              ? Number(v.warrantyMonths)
              : null,

          createdAt: v?.createdAt,

          updatedAt: v?.updatedAt,

          deletedAt: v?.deletedAt ?? null,
        };
      }),
    };
  }
}

