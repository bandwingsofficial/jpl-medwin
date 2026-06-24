import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";

import { FloatingCartBar } from "@/features/cart/components/floating-cart-bar";

import { Toast } from "@/shared/components/ui/toast";

// ✅ Imported your WhatsApp button component
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
          {children}

          <FloatingCartBar />

          <Toast />

          {/* ✅ Floating WhatsApp button added securely at the bottom */}
          <WhatsappButton />
        </QueryProvider>
      </body>
    </html>
  );
}