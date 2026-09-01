"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { useMe } from "@/features/auth/hooks/use-me";

import { PublicShell } from "@/shared/components/layout/public-shell";

// ========================================
// TYPES
// ========================================

type ProtectedLayoutProps = {
  children: ReactNode;
};

// ========================================
// COMPONENT
// ========================================

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
  } = useMe();

  // ========================================
  // HYDRATION SAFE
  // ========================================

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ========================================
  // AUTH REDIRECT
  // ========================================

  useEffect(() => {
    // wait for hydration
    if (!mounted) return;

    // wait for request completion
    if (isLoading) return;

    // redirect only on confirmed auth failure
    if (
      isError ||
      !data?.data?.user
    ) {
      router.replace("/login");
    }
  }, [
    mounted,
    isLoading,
    isError,
    data,
    router,
  ]);

  // ========================================
  // LOADING SCREEN
  // ========================================

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-black" />

          <p className="text-sm text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // BLOCK UI DURING REDIRECT
  // ========================================

  if (
    isError ||
    !data?.data?.user
  ) {
    return null;
  }

  // ========================================
  // AUTHENTICATED UI
  // ========================================

  return (
    <PublicShell>
      {children}
    </PublicShell>
  );
}