export const collectionQueryKeys = {
  all: ["collections"] as const,

  list: () =>
    [...collectionQueryKeys.all, "list"] as const,

  detail: (slug: string) =>
    [...collectionQueryKeys.all, slug] as const,

  products: (collectionId: string) =>
    [...collectionQueryKeys.all, collectionId, "products"] as const,
};