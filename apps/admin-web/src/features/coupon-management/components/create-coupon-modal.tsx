"use client";

import { Modal } from "@/shared/components/ui/modal";

import { Button } from "@/shared/components/ui/button";

import CouponForm from "./coupon-form";

import { useCreateCoupon } from "../hooks/use-coupons";

import { CouponFormValues } from "../validations/coupon.validation";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateCouponModal({
  open,
  onClose,
}: Props) {
  const { mutateAsync, isPending } =
    useCreateCoupon();

  const handleSubmit = async (
    values: CouponFormValues
  ) => {
    await mutateAsync(values);

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-4xl rounded-3xl"
    >
      <div
        className="
          max-h-[90vh]
          overflow-y-auto
          bg-gradient-to-b
          from-white
          to-gray-50
        "
      >
        {/* HEADER */}
        <div
          className="
            sticky
            top-0
            z-10
            bg-white/95
            backdrop-blur-md
            border-b
            px-8
            py-6
          "
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-gray-900
                "
              >
                Create Coupon
              </h2>

              <p className="text-sm text-gray-500">
                Configure discount rules,
                usage limits, and validity
                period.
              </p>
            </div>

            <button
              onClick={onClose}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-gray-200
                bg-white
                text-gray-500
                transition-all
                hover:bg-gray-100
                hover:text-black
              "
            >
              ✕
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="px-8 py-8">
          <div
            className="
              rounded-2xl
              
            "
          >
            <CouponForm
              onSubmit={handleSubmit}
              isLoading={isPending}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            sticky
            bottom-0
            z-10
            flex
            items-center
            justify-end
            gap-3
            border-t
            bg-white/95
            backdrop-blur-md
            px-8
            py-5
          "
        >
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="min-w-[120px]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}