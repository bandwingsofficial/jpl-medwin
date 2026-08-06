import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Collection name is required"),

  description: z.string().optional(),

  metaDescription: z.string().optional(),

  image: z
    .instanceof(File)
    .optional(),
});

export const updateCollectionSchema =
  createCollectionSchema.partial();

export type CreateCollectionFormData =
  z.infer<typeof createCollectionSchema>;

export type UpdateCollectionFormData =
  z.infer<typeof updateCollectionSchema>;