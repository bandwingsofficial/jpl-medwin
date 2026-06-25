export enum SearchType {
  PRODUCT = 'PRODUCT',
  BRAND = 'BRAND',
  CATEGORY = 'CATEGORY',
  SUB_CATEGORY = 'SUB_CATEGORY',
  MINI_CATEGORY = 'MINI_CATEGORY',
  BANNER = 'BANNER',
  BLOG = 'BLOG',
  FAQ = 'FAQ',
  PAGE = 'PAGE',
}

export const SEARCH_TYPE_VALUES = Object.values(SearchType);

export type SearchTypeType = (typeof SEARCH_TYPE_VALUES)[number];

export const isSearchType = (value: string): value is SearchType => {
  return SEARCH_TYPE_VALUES.includes(value as SearchType);
};
