"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { PaymentSuccess } from "@/features/payments/components/PaymentSuccess";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const orderId =
    searchParams.get("orderId") ?? "";

  const paymentMethod =
    searchParams.get("paymentMethod") ?? "";

  const isCod =
    paymentMethod === "COD";

  return (
    <PaymentSuccess
      orderId={orderId}
      isCod={isCod}
      open={true}
      onClose={() => router.push("/")}
    />
  );
}