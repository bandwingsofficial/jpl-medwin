export interface BulkOrderData {
  productName: string;
  variantName?: string;
  attributes?: Record<string, string | number> | [string, string | number][];
  productId?: string;
  variantId?: string;
  sellingPrice?: number;
  image?: string;
  productSlug?: string;
  requestedQuantity?: number;
}

export interface BulkOrderModalState extends BulkOrderData {
  isOpen: boolean;
  openBulkOrderModal: (data: BulkOrderData) => void;
  closeBulkOrderModal: () => void;
}
