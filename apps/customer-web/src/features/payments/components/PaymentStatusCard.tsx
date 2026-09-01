import { cn } from "@/lib/utils";

import { PaymentStatus } from "../types/payment.type";

import { getPaymentStatusColor } from "../utils/payment-status";

interface Props {
  status: PaymentStatus;
}

export const PaymentStatusBadge = ({ status }: Props) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        getPaymentStatusColor(status)
      )}
    >
      {status}
    </span>
  );
};