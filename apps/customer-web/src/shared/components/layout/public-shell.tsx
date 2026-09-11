"use client";

import { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { CheckoutNavigationGuard } from "@/shared/components/checkout-navigation-guard";
import AnnouncementHeader from "./header/AnnouncementHeader";

type PublicShellProps = {
  children: ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <CheckoutNavigationGuard>
      <AnnouncementHeader/> 
      <Header />

      <main>{children}</main>

      <Footer />
    </CheckoutNavigationGuard>
  );
}