import { Product } from "@/features/product-management/types/product.type";

export interface AssignProductFormData {
  productId: string;
}

export interface AssignProductModalProps {
  open: boolean;

  collectionId: string;

  onClose: () => void;
}

export interface ProductOption {
  id: string;
  name: string;
  product: Product;
}