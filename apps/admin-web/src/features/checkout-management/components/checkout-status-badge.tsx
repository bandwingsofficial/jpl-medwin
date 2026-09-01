"use client";

import {
  AlertCircle,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { CheckoutStatus } from "../types/checkout.type";

interface Props {
  status: CheckoutStatus | string;
  isExpired?: boolean;
}

export default function CheckoutStatusBadge({
  status,
  isExpired,
}: Props) {
  const effectiveStatus =
    status === "ACTIVE" && isExpired ? "EXPIRED" : status;

  const statusConfig: Record<
    string,
    {
      label: string;
      className: string;
      icon: any;
    }
  > = {
    ACTIVE: {
      label: "Active",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock3,
    },
    EXPIRED: {
      label: "Expired",
      className: "bg-slate-100 text-slate-700 border-slate-200",
      icon: AlertCircle,
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    FAILED: {
      label: "Failed",
      className: "bg-rose-50 text-rose-700 border-rose-200",
      icon: XCircle,
    },
  };

  const item = statusConfig[effectiveStatus] ?? {
    label: effectiveStatus,
    className: "bg-gray-50 text-gray-700 border-gray-200",
    icon: AlertCircle,
  };

  const Icon = item.icon;

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-1
        rounded-md
        border
        px-2
        py-[4px]
        text-[11px]
        font-medium
        leading-none
        whitespace-nowrap
        ${item.className}
      `}
    >
      <Icon size={12} strokeWidth={2.2} />
      <span>{item.label}</span>
    </div>
  );
}
