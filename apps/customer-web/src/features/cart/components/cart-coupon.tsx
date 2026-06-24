"use client";

import { useState } from "react";

import { Tag, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { Input } from "@/shared/components/ui/input";

import { AppliedCoupon } from "../types/coupon.type";

import { useApplyCoupon } from "../hooks/use-apply-coupon";

import { useRemoveCoupon } from "../hooks/use-remove-coupon";

import {
  COUPON_INPUT_MAX_LENGTH,
  COUPON_MESSAGES,
} from "../constants/coupon.constants";

interface Props {
  appliedCoupon?: AppliedCoupon | null;
}

export default function CartCoupon({
  appliedCoupon,
}: Props) {
  const [couponCode, setCouponCode] =
    useState("");

  const [error, setError] =
    useState("");

  const applyCouponMutation =
    useApplyCoupon();

  const removeCouponMutation =
    useRemoveCoupon();

  /**
   * APPLY COUPON
   */
  const handleApplyCoupon =
    async () => {
      try {
        setError("");

        if (!couponCode.trim()) {
          setError(
            COUPON_MESSAGES.EMPTY_COUPON
          );

          return;
        }

        await applyCouponMutation.mutateAsync(
          couponCode.trim().toUpperCase()
        );

        setCouponCode("");
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            COUPON_MESSAGES.INVALID_COUPON
        );
      }
    };

  /**
   * REMOVE COUPON
   */
  const handleRemoveCoupon =
    async () => {
      try {
        await removeCouponMutation.mutateAsync();
      } catch (error: any) {
        console.error(error);
      }
    };

  return (
    <div
      className="
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        space-y-4
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-purple-100
            text-purple-600
          "
        >
          <Tag className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Apply Coupon
          </h3>

          <p className="text-sm text-gray-500">
            Enter coupon code to get
            discount
          </p>
        </div>
      </div>

      {/* APPLIED COUPON */}
      {appliedCoupon ? (
        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-emerald-200
            bg-emerald-50
            px-4
            py-3
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className="
                  rounded-md
                  bg-emerald-600
                  px-2
                  py-1
                  text-xs
                  font-bold
                  tracking-wide
                  text-white
                "
              >
                {
                  appliedCoupon.couponCode
                }
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-emerald-700
                "
              >
                Applied
              </span>
            </div>

            <p
              className="
                mt-1
                text-sm
                text-emerald-700
              "
            >
              You saved ₹
              {appliedCoupon.discount}
            </p>
          </div>

          <button
            onClick={handleRemoveCoupon}
            disabled={
              removeCouponMutation.isPending
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-gray-500
              transition-all
              hover:bg-white
              hover:text-red-500
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <>
          {/* INPUT */}
          <div className="flex gap-3">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) =>
                setCouponCode(
                  e.target.value
                )
              }
              maxLength={
                COUPON_INPUT_MAX_LENGTH
              }
              className="h-12 uppercase"
            />

            <Button
              type="button"
              onClick={handleApplyCoupon}
              loading={
                applyCouponMutation.isPending
              }
              className="
                h-12
                min-w-[120px]
              "
            >
              Apply
            </Button>
          </div>

          {/* ERROR */}
          {error && (
            <p
              className="
                text-sm
                font-medium
                text-red-500
              "
            >
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}