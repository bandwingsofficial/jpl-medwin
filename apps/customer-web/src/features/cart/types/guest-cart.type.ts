

export interface GuestCartProduct {
  id: string;
  name: string;
  slug: string;

  brand?: {
    id?: string;
    name?: string;
  };

  category?: {
    main?: string;
    sub?: string;
    mini?: string;
  };

  image: {
    main: string;
  };

  variant: {
    id: string;
    name: string;
    sku: string;

    pricing: {
      sellingPrice: number;
      mrp: number;
      purchasePrice: number;
    };

    stock: {
      quantity: number;
      inStock: boolean;
    };

    attributes: Record<string, string>;

    image: {
      main: string;
    };
  };
}