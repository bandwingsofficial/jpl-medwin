"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_CART_ITEM_QUANTITY } from "@/features/bulk-order/constants/bulk-order.constants";

interface QuantitySelectorProps {
  value: number;

  min?: number;

  max?: number;

  disabled?: boolean;

  onChange: (
    value: number
  ) => void;

  onMaxReached?: () => void;
}

export function QuantitySelector({
  value,
  min = 1,
  max = MAX_CART_ITEM_QUANTITY,
  disabled,
  onChange,
  onMaxReached,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (value <= min) {
      return;
    }

    onChange(value - 1);
  };

  const increase = () => {
    if (value >= max) {
      if (onMaxReached) {
        onMaxReached();
      }
      return;
    }

    onChange(value + 1);
  };

  return (
    <div
      className="
        flex
        h-11
        items-center
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
      "
    >
      <button
        type="button"
        onClick={decrease}
        disabled={
          disabled || value <= min
        }
        className="
          flex
          h-full
          w-11
          items-center
          justify-center
          transition
          hover:bg-gray-50
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <Minus size={16} />
      </button>

      <div
        className="
          flex
          h-full
          min-w-[50px]
          items-center
          justify-center
          border-x
          border-gray-200
          px-4
          text-sm
          font-semibold
        "
      >
        {value}
      </div>

      <button
        type="button"
        onClick={increase}
        disabled={
          disabled || (value >= max && !onMaxReached)
        }
        className="
          flex
          h-full
          w-11
          items-center
          justify-center
          transition
          hover:bg-gray-50
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <Plus size={16} />
      </button>
    </div>
  );
}