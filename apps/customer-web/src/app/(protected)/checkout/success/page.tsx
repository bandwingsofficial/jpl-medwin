"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { PaymentSuccess } from "@/features/payments/components/PaymentSuccess";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId") || "";

  return (
    <PaymentSuccess
      orderId={orderId}
      open={true}
      onClose={() => router.push("/")}
    />
  );
}