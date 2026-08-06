"use client";

import { useCustomerName } from "../hooks/useCustomerName";

interface Props {
  customerId: string;
}

export function CustomerDisplayName({
  customerId,
}: Props) {
  const { data } =
    useCustomerName(customerId);

  const displayName =
    data?.name ||
    data?.phoneNumber ||
    `Customer #${customerId
      .slice(-4)
      .toUpperCase()}`;

  return (
    <p
      className="
        text-xs
        font-bold
        text-slate-800
        tracking-tight
      "
    >
      {displayName}
    </p>
  );
}