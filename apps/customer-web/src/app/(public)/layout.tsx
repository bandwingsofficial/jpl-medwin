import { ReactNode } from "react";
import { PublicShell } from "@/shared/components/layout/public-shell";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return <PublicShell>{children}</PublicShell>;
}