"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAuthModal } from "@/shared/context/auth-modal-context";

export const useAuthGuard = () => {
  /*
   |--------------------------------------------------------------------------
   | AUTH
   |--------------------------------------------------------------------------
   */

  const { isAuthenticated } =
    useAuth();

  /*
   |--------------------------------------------------------------------------
   | LOGIN MODAL
   |--------------------------------------------------------------------------
   */

  const { setLoginOpen } =
    useAuthModal();

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

      setLoginOpen(true);

      return false;
    }

    return true;
  };

  return {
    isAuthenticated,

    requireAuth,
  };
};

function showError(
  message: string
) {
  console.error(message);
}