"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentSuccess } from "@/features/payments/components/PaymentSuccess";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId") ?? "";
  const paymentMethod = searchParams.get("paymentMethod") ?? "";
  const isCod = paymentMethod === "COD";

  return (
    <PaymentSuccess
      orderId={orderId}
      isCod={isCod}
      open={true}
      onClose={() => router.push("/")}
    />
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}