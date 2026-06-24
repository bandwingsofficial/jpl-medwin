import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";

interface Props {
  status: string;
}

export default function OrderStatusBadge({
  status,
}: Props) {
  /*
  |------------------------------------------------------------------
  | STATUS CONFIG
  |------------------------------------------------------------------
  */

  const statusConfig: Record<
    string,
    {
      label: string;
      className: string;
      icon: any;
    }
  > = {
    PENDING_PAYMENT: {
      label: "Pending",
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: Clock3,
    },

    PROCESSING: {
      label: "Processing",
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
      icon: AlertCircle,
    },

    CONFIRMED: {
      label: "Confirmed",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: PackageCheck,
    },

    SHIPPED: {
      label: "Shipped",
      className:
        "bg-purple-50 text-purple-700 border-purple-200",
      icon: Truck,
    },

    DELIVERED: {
      label: "Delivered",
      className:
        "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle2,
    },

    REFUNDED: {
      label: "Refunded",
      className:
        "bg-orange-50 text-orange-700 border-orange-200",
      icon: Wallet,
    },

    CANCELLED: {
      label: "Cancelled",
      className:
        "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    },
  };

  /*
  |------------------------------------------------------------------
  | FALLBACK
  |------------------------------------------------------------------
  */

  const item = statusConfig[status] ?? {
    label: status,
    className:
      "bg-gray-50 text-gray-700 border-gray-200",
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