import type { Metadata } from "next";

import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";

import { LocationProvider } from "@/features/location/context/LocationProvider";

import { FloatingCartBar } from "@/features/cart/components/floating-cart-bar";

import { Toast } from "@/shared/components/ui/toast";
import { WhatsappButton } from "@/shared/components/ui/whatsapp-button";
import { AuthModalProvider } from "@/shared/context/auth-modal-context";
import Script from "next/script";

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
      <head>
  <Script
    src="https://www.googletagmanager.com/gtag/js?id=G-RVVTP2Y7SW"
    strategy="afterInteractive"
  />

  <Script id="google-analytics" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-RVVTP2Y7SW');
    `}
  </Script>
</head>
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