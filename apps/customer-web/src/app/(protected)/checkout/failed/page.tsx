"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PaymentFailed } from "@/features/payments/components/PaymentFailed";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") || "";

  const handleRetry = () => {
    router.push(`/checkout/payment?orderId=${orderId}`);
  };

  return (
    /* 👉 UI ENHANCEMENT: Framed the component in a premium, structured content card wrapper layout */
    <div className="mx-auto flex min-h-[80vh] w-full max-w-3xl items-center justify-center px-4 py-10 select-none">
      <div className="w-full rounded-3xl bg-white p-8 md:p-12 border border-gray-100 shadow-sm flex flex-col items-center">
        
        {/* PASSED THROUGH TRANSACTION CONTROLLER COMPONENT */}
        <PaymentFailed onRetry={handleRetry} />

        {/* COMPACT OPTIONAL REFERENCES TRACKER STRIP */}
        {orderId && (
          <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-2 font-mono text-xs font-bold text-gray-400 tracking-wide">
            ORDER ID: <span className="text-gray-700 ml-1 font-black">{orderId}</span>
          </div>
        )}

      </div>
    </div>
  );
}