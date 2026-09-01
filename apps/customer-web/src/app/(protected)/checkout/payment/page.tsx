"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentLoader } from "@/features/payments/components/PaymentLoader";

export default function PaymentPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/checkout");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <PaymentLoader />
    </div>
  );
}