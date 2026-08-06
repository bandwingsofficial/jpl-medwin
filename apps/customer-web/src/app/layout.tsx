import type { Metadata } from "next";

import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";

import { LocationProvider } from "@/features/location/context/LocationProvider";

import { FloatingCartBar } from "@/features/cart/components/floating-cart-bar";

import { Toast } from "@/shared/components/ui/toast";
import { WhatsappButton } from "@/shared/components/ui/whatsapp-button";
import { AuthModalProvider } from "@/shared/context/auth-modal-context";

export const metadata: Metadata = {
  title: "JPL Medwin",
  description: "JPL Medwin",
  icons: [
  {
    rel: "icon",
    url: "/Metadata/Jpl_Meta1.png",
    type: "image/png",
  },
],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthModalProvider>
            <LocationProvider>
              {children}

              <FloatingCartBar />

              <Toast />

              <WhatsappButton />
            </LocationProvider>
          </AuthModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}