"use client";

import { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { CheckoutNavigationGuard } from "@/shared/components/checkout-navigation-guard";

type PublicShellProps = {
  children: ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <CheckoutNavigationGuard>
      <Header />

      <main>{children}</main>

      <Footer />
    </CheckoutNavigationGuard>
  );
}