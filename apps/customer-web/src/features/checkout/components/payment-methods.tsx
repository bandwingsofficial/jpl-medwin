"use client";

import {
  CreditCard,
  Landmark,
  Wallet,
  Check,
} from "lucide-react";

type PaymentMethod =
  | "RAZORPAY"
  | "UPI"
  | "COD";

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (
    method: PaymentMethod,
  ) => void;
}

const PAYMENT_METHODS: {
  id: PaymentMethod;
  title: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  {
    id: "RAZORPAY",
    title: "Razorpay",
    description:
      "Cards, UPI, Wallets & Net Banking",
    icon: CreditCard,
  },
  {
    id: "COD",
    title: "Cash on Delivery",
    description:
      "Pay when your order is delivered",
    icon: Landmark,
  },
  {
    id: "UPI",
    title: "UPI Payment",
    description:
      "Pay instantly using any UPI app",
    icon: Wallet,
  },
];

export function PaymentMethods({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodsProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
      "
    >
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-bold leading-tight text-slate-900">
          Payment Method
        </h2>

        <p className="text-xs text-slate-500">
          Choose your preferred payment option
        </p>
      </div>

      {/* METHODS */}
      <div className="space-y-2.5">
        {PAYMENT_METHODS.map(
          (method) => {
            const Icon = method.icon;

            const isSelected =
              selectedMethod === method.id;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() =>
                  onSelectMethod(method.id)
                }
                className={`
                  group
                  relative
                  flex
                  w-full
                  items-center
                  gap-3.5
                  rounded-lg
                  border
                  p-3.5
                  text-left
                  transition-all
                  duration-200
                  ${
                    isSelected
                      ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600"
                      : "border-slate-200 bg-white hover:border-teal-300"
                  }
                `}
              >
                {/* ICON */}
                <div
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    transition-colors
                    ${
                      isSelected
                        ? "bg-teal-600 text-white"
                        : "bg-teal-50 text-teal-600 group-hover:bg-teal-100"
                    }
                  `}
                >
                  <Icon size={18} />
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-hidden">
                  <h3 className="truncate text-sm font-bold text-slate-900">
                    {method.title}
                  </h3>

                  <p className="text-[11px] leading-tight text-slate-500">
                    {method.description}
                  </p>
                </div>

                {/* RADIO INDICATOR */}
                <div
                  className={`
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    transition-all
                    ${
                      isSelected
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-300 bg-transparent"
                    }
                  `}
                >
                  {isSelected && (
                    <Check
                      size={12}
                      strokeWidth={4}
                    />
                  )}
                </div>
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}