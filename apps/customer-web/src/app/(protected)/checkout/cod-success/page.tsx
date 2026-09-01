"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { CodOrderSuccess } from "@/features/payments/components/cod-order-success";

export default function CodSuccessPage() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const orderId =
    searchParams.get("orderId") ?? "";

  return (
    <CodOrderSuccess
      orderId={orderId}
      open={true}
      onClose={() => router.push("/")}
    />
  );
}