"use client";

import { useRouter } from "next/navigation";

import { LoginModal } from "@/features/auth/components/login-modal";

export default function Page() {
  const router = useRouter();

  return (
    <LoginModal
      open={true}
      onClose={() => router.back()}
    />
  );
}