import { z } from "zod";

export const couponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Coupon code is required")
      .max(30),

    discountType: z.enum([
      "PERCENTAGE",
      "FIXED",
    ]),

    discountValue: z
  .number({
    error: "Discount value is required",
  })
  .positive("Discount value must be greater than 0"),

    minimumOrderAmount: z
      .number()
      .min(0),

    maximumDiscountAmount: z
      .number()
      .min(0),

    usageLimit: z
      .number()
      .min(1),

    perUserLimit: z
      .number()
      .min(1),

    isPublic: z.boolean(),

    startsAt: z.string(),

    expiresAt: z.string(),
  })

  .superRefine((data, ctx) => {
    /**
     * Percentage validation
     */
    if (
      data.discountType === "PERCENTAGE" &&
      data.discountValue > 100
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message:
          "Percentage discount cannot exceed 100%",
      });
    }

    /**
     * Expiry validation
     */
    if (
      new Date(data.expiresAt) <=
      new Date(data.startsAt)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiresAt"],
        message:
          "Expiry date must be after start date",
      });
    }
  });

export type CouponFormValues = z.infer<
  typeof couponSchema
>;