"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CodOrderSuccess } from "@/features/payments/components/cod-order-success";

function CodSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";

  return (
    <CodOrderSuccess
      orderId={orderId}
      open={true}
      onClose={() => router.push("/")}
    />
  );
}

export default function CodSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CodSuccessContent />
    </Suspense>
  );
}