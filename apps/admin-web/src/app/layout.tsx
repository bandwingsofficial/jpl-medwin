import "./globals.css";

import { Providers } from "@/providers";

import { Toast } from "@/shared/components/ui/toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}

          <Toast />
        </Providers>
      </body>
    </html>
  );
}