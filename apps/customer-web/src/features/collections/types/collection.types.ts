export interface Collection {
  id: string;

  name: string;

  slug: string;

  description?: string;

  metaDescription?: string;

  imageUrl?: string;

  status: "ACTIVE" | "INACTIVE";
}