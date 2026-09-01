import { z } from "zod";

// ========================================
// BANNER IMAGE
// ========================================

export const bannerImageSchema =
  z.object({
    file: z.instanceof(File, {
      message: "Image is required",
    }),

    link: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),

    productId: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),

    sortOrder: z
      .number()
      .min(
        0,
        "Sort order cannot be negative"
      ),
  });

// ========================================
// CREATE BANNER
// ========================================

export const createBannerSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        3,
        "Banner name must be at least 3 characters"
      )
      .max(
        100,
        "Banner name cannot exceed 100 characters"
      ),

    type: z.enum([
      "HOME_BANNER",
      "CATEGORY_BANNER",
      "SUB_CATEGORY_BANNER",
      "PROMOTIONAL_BANNER",
      "PRODUCT_BANNER",
    ]),

    priority: z
      .number()
      .int("Priority must be an integer")
      .min(1, "Priority must be at least 1")
      .optional(),

    images: z
      .array(
        bannerImageSchema
      )
      .min(
        1,
        "At least one image is required"
      ),
  });

// ========================================
// TYPES
// ========================================

export type CreateBannerFormData =
  z.infer<
    typeof createBannerSchema
  >;