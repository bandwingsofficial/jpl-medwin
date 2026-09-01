import { ReactNode } from "react";

import { AccountLayout } from "@/features/account/components/account-layout";

interface Props {
  children: ReactNode;
}

export default function Layout({
  children,
}: Props) {
  return (
    <AccountLayout>
      {children}
    </AccountLayout>
  );
}