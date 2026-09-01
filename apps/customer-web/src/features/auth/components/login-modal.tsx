"use client";

import { X } from "lucide-react";
import { LoginForm } from "./login-form";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({
  open,
  onClose,
}: LoginModalProps) {
  if (!open) return null;

  return (
   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">   <div className="relative">
       <LoginForm onClose={onClose} />

      </div>
    </div>
  );
}