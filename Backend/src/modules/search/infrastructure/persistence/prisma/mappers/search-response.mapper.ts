import { SearchType } from '../../../../domain/enums/search-type.enum';
import { SearchResult } from '../../../../application/types/search-result.type';

export class SearchResponseMapper {
  // =======================
  // PRODUCT
  // =======================

  static fromProduct(
    product: {
      id: string;
      name: string;
      slug: string;
    },
  ): SearchResult {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      type: SearchType.PRODUCT,
    };
  }

  // =======================
  // BRAND
  // =======================

  static fromBrand(
    brand: {
      id: string;
      name: string;
      slug: string;
    },
  ): SearchResult {
    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      type: SearchType.BRAND,
    };
  }

  // =======================
  // CATEGORY
  // =======================

  static fromCategory(
    category: {
      id: string;
      name: string;
      slug: string;
    },
  ): SearchResult {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      type: SearchType.CATEGORY,
    };
  }

  // =======================
  // SUB CATEGORY
  // =======================

  static fromSubCategory(
    subCategory: {
      id: string;
      name: string;
      slug: string;
    },
  ): SearchResult {
    return {
      id: subCategory.id,
      name: subCategory.name,
      slug: subCategory.slug,
      type: SearchType.SUB_CATEGORY,
    };
  }

  // =======================
  // MINI CATEGORY
  // =======================

  static fromMiniCategory(
    miniCategory: {
      id: string;
      name: string;
      slug: string;
    },
  ): SearchResult {
    return {
      id: miniCategory.id,
      name: miniCategory.name,
      slug: miniCategory.slug,
      type: SearchType.MINI_CATEGORY,
    };
  }
}