import {
  Package,
  Truck,
  CheckCircle2,
  Wallet,
  XCircle,
  BadgeCheck,
  CreditCard,
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";

interface OrderStatusBadgeProps {
  status:
    | "PENDING_PAYMENT"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "REFUNDED"
    | "CANCELLED"
    | "CONFIRMED";
}

export const OrderStatusBadge = ({
  status,
}: OrderStatusBadgeProps) => {
  const statusConfig = {
    PENDING_PAYMENT: {
      label: "Pending Payment",
      icon: CreditCard,
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-700",
    },

    PROCESSING: {
      label: "Order Processing",
      icon: Package,
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
    },

    SHIPPED: {
      label: "Shipped",
      icon: Truck,
      className:
        "border-purple-200 bg-purple-50 text-purple-700",
    },

    DELIVERED: {
      label: "Delivered",
      icon: CheckCircle2,
      className:
        "border-green-200 bg-green-50 text-green-700",
    },

    REFUNDED: {
      label: "Refunded",
      icon: Wallet,
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    CANCELLED: {
      label: "Cancelled",
      icon: XCircle,
      className:
        "border-red-200 bg-red-50 text-red-700",
    },

    CONFIRMED: {
      label: "Confirmed",
      icon: BadgeCheck,
      className:
        "border-cyan-200 bg-cyan-50 text-cyan-700",
    },
  } as const;

  const config =
    statusConfig[status];

  const Icon =
    config.icon;

  return (
    <Badge
      className={`
        flex items-center gap-1.5
        rounded-full
        border
        px-3 py-1
        text-xs font-semibold
        shadow-sm
        ${config.className}
      `}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
};