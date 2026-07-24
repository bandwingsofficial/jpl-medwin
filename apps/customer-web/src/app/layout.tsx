import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";

import { LocationProvider } from "@/features/location/context/LocationProvider";

import { FloatingCartBar } from "@/features/cart/components/floating-cart-bar";

import { Toast } from "@/shared/components/ui/toast";
import { WhatsappButton } from "@/shared/components/ui/whatsapp-button";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <LocationProvider>
            {children}

            <FloatingCartBar />

            <Toast />

            <WhatsappButton />
          </LocationProvider>
        </QueryProvider>
      </body>
    </html>
  );
}