import type { Metadata } from "next";

import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";
import { GlobalLoginModal } from "@/features/auth/components/global-login-modal";
import { LocationProvider } from "@/features/location/context/LocationProvider";

import { FloatingCartBar } from "@/features/cart/components/floating-cart-bar";

import { Toast } from "@/shared/components/ui/toast";
import { WhatsappButton } from "@/shared/components/ui/whatsapp-button";
import { AuthModalProvider } from "@/shared/context/auth-modal-context";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "JPL Medwin",
    template: "%s | JPL Medwin",
  },

  description:
    "JPL Medwin – Shop dental equipment, professional dental instruments, medical equipment, surgical products and healthcare supplies online.",

  keywords: [
    "JPL Medwin",
    "dental equipment",
    "dental instruments",
    "dental products",
    "professional dental instruments",
    "medical equipment",
    "medical instruments",
    "surgical instruments",
    "healthcare products",
    "dental supplies",
  ],

  authors: [
    {
      name: "JPL Medwin",
    },
  ],

  creator: "JPL Medwin",
  publisher: "JPL Medwin",

  robots: {
    index: true,
    follow: true,
  },

  icons: [
    {
      rel: "icon",
      url: "/Metadata/Jpl_Meta1.png",
      type: "image/png",
    },
  ],

  openGraph: {
    title: "JPL Medwin",
    description:
      "Shop dental equipment, professional dental instruments, medical equipment, surgical products and healthcare supplies online.",
    siteName: "JPL Medwin",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "JPL Medwin",
    description:
      "Shop dental equipment, professional dental instruments, medical equipment, surgical products and healthcare supplies online.",
  },
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
              <GlobalLoginModal />
              <FloatingCartBar />

              {children}

              <Toast />

              <WhatsappButton />
            </LocationProvider>
          </AuthModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}