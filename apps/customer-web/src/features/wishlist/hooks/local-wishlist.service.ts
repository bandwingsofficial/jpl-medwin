import { Product } from "@/features/products/types/product.type";

const STORAGE_KEY = "guest-wishlist";

class LocalWishlistService {
  private getItems(): Product[] {
    if (typeof window === "undefined") {
      return [];
    }

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data) as Product[];
    } catch {
      return [];
    }
  }

  private saveItems(
    items: Product[]
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );
  }

  getAll(): Product[] {
    return this.getItems();
  }

  getCount(): number {
    return this.getItems().length;
  }

  exists(
    productId: string
  ): boolean {
    return this.getItems().some(
      (product) =>
        product.id === productId
    );
  }

  add(
    product: Product
  ) {
    const items = this.getItems();

    if (
      items.some(
        (item) =>
          item.id === product.id
      )
    ) {
      return;
    }

    items.push(product);

    this.saveItems(items);
  }

  remove(
    productId: string
  ) {
    const items =
      this.getItems().filter(
        (item) =>
          item.id !== productId
      );

    this.saveItems(items);
  }

  
  clear() {
    localStorage.removeItem(
      STORAGE_KEY
    );
  }
}

export const localWishlistService =
  new LocalWishlistService();