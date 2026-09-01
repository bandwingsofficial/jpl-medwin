"use client";

import { LoginModal } from "./login-modal";
import { useAuthModal } from "@/shared/context/auth-modal-context";

export function GlobalLoginModal() {
  const {
    loginOpen,
    setLoginOpen,
  } = useAuthModal();

  return (
    <LoginModal
      open={loginOpen}
      onClose={() => setLoginOpen(false)}
    />
  );
}