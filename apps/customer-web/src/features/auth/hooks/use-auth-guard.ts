"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/use-auth";

export const useAuthGuard = () => {
  /*
   |--------------------------------------------------------------------------
   | ROUTER
   |--------------------------------------------------------------------------
   */

  const router = useRouter();

  /*
   |--------------------------------------------------------------------------
   | AUTH
   |--------------------------------------------------------------------------
   */

  const { isAuthenticated } =
    useAuth();

  /*
   |--------------------------------------------------------------------------
   | REQUIRE AUTH
   |--------------------------------------------------------------------------
   */

  const requireAuth = () => {
    if (!isAuthenticated) {
      showError(
        "Please login first to continue."
      );

      router.push("/login");

      return false;
    }

    return true;
  };

  return {
    isAuthenticated,

    requireAuth,
  };
};

function showError(message: string) {
  console.error(message);
}