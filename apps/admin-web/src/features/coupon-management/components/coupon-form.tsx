"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import {
  couponSchema,
  CouponFormValues,
} from "../validations/coupon.validation";

import { Coupon } from "../types/coupon.type";

interface Props {
  initialData?: Coupon | null;

  isLoading?: boolean;

  onSubmit: (
    values: CouponFormValues
  ) => Promise<void>;
}

export default function CouponForm({
  initialData,
  isLoading,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,

    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),

    defaultValues: {
      code: "",
      discountType: "PERCENTAGE",
      discountValue: 0,

      minimumOrderAmount: 0,
      maximumDiscountAmount: 0,

      usageLimit: 1,
      perUserLimit: 1,

      isPublic: true,

      startsAt: "",
      expiresAt: "",
    },
  });

  /**
   * EDIT MODE PREFILL
   */
  useEffect(() => {
    if (!initialData) return;

    reset({
      code: initialData.code,

      discountType:
        initialData.discountType,

      discountValue:
        initialData.discountValue,

      minimumOrderAmount:
        initialData.minimumOrderAmount,

      maximumDiscountAmount:
        initialData.maximumDiscountAmount,

      usageLimit:
        initialData.usageLimit,

      perUserLimit:
        initialData.perUserLimit,

      isPublic: initialData.isPublic,

      startsAt:
        initialData.startsAt.slice(0, 16),

      expiresAt:
        initialData.expiresAt.slice(0, 16),
    });
  }, [initialData, reset]);

  const discountType = watch(
    "discountType"
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* CODE */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Coupon Code
        </label>

        <Input
          placeholder="SAVE50"
          {...register("code")}
        />

        {errors.code && (
          <p className="text-sm text-red-500">
            {errors.code.message}
          </p>
        )}
      </div>

      {/* DISCOUNT TYPE */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Discount Type
        </label>

        <select
          {...register("discountType")}
          className="w-full border rounded-md px-3 py-2 bg-background"
        >
          <option value="PERCENTAGE">
            Percentage
          </option>

          <option value="FIXED">
            Fixed
          </option>
        </select>
      </div>

      {/* DISCOUNT VALUE */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Discount Value
        </label>

        <Input
          type="number"
          placeholder={
            discountType === "PERCENTAGE"
              ? "10"
              : "100"
          }
          {...register("discountValue", {
            valueAsNumber: true,
          })}
        />

        {errors.discountValue && (
          <p className="text-sm text-red-500">
            {errors.discountValue.message}
          </p>
        )}
      </div>

      {/* MINIMUM ORDER */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Minimum Order Amount
        </label>

        <Input
          type="number"
          {...register(
            "minimumOrderAmount",
            {
              valueAsNumber: true,
            }
          )}
        />
      </div>

      {/* MAX DISCOUNT */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Maximum Discount Amount
        </label>

        <Input
          type="number"
          {...register(
            "maximumDiscountAmount",
            {
              valueAsNumber: true,
            }
          )}
        />
      </div>

      {/* USAGE LIMIT */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Usage Limit
        </label>

        <Input
          type="number"
          {...register("usageLimit", {
            valueAsNumber: true,
          })}
        />
      </div>

      {/* PER USER LIMIT */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Per User Limit
        </label>

        <Input
          type="number"
          {...register("perUserLimit", {
            valueAsNumber: true,
          })}
        />
      </div>

      {/* PUBLIC */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register("isPublic")}
        />

        <label className="text-sm font-medium">
          Public Coupon
        </label>
      </div>

      {/* START DATE */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Starts At
        </label>

        <Input
          type="datetime-local"
          {...register("startsAt")}
        />

        {errors.startsAt && (
          <p className="text-sm text-red-500">
            {errors.startsAt.message}
          </p>
        )}
      </div>

      {/* EXPIRY DATE */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Expires At
        </label>

        <Input
          type="datetime-local"
          {...register("expiresAt")}
        />

        {errors.expiresAt && (
          <p className="text-sm text-red-500">
            {errors.expiresAt.message}
          </p>
        )}
      </div>

      {/* ACTION */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading
          ? "Please wait..."
          : initialData
          ? "Update Coupon"
          : "Create Coupon"}
      </Button>
    </form>
  );
}