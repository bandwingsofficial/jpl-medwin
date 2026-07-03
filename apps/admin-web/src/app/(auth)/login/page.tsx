"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { getAdminMe } from "@/infrastructure/api/auth.api";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await getAdminMe(); // ✅ cookie-based auth
        router.replace("/dashboard");
      } catch {
        // not logged in → stay
      }
    };

    checkSession();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <LoginForm />
    </div>
  );
}