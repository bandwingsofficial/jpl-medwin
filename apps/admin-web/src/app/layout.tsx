import "./globals.css";

import { Providers } from "@/providers";

import { Toast } from "@/shared/components/ui/toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPL Medwin",
  description: "JPL Medwin",
  icons: {
    icon: "/Metadata/Jpl_Meta1.png",
    shortcut: "/Metadata/Jpl_Meta1.png",
    apple: "/Metadata/Jpl_Meta1.png",
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
        <Providers>
          {children}

          <Toast />
        </Providers>
      </body>
    </html>
  );
}