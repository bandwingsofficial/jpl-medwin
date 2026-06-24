"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";

interface Props {
  status:
    | "REQUESTED"
    | "APPROVED"
    | "REJECTED"
    | "PICKED_UP"
    | "COMPLETED";
}

export const ReturnStatusBadge = ({
  status,
}: Props) => {
  /*
  |--------------------------------------------------------------------------
  | STATUS CONFIG
  |--------------------------------------------------------------------------
  */

  const config = {
    REQUESTED: {
      label: "Requested",

      icon: Clock3,

      className:
        "border-amber-200 bg-amber-50 text-amber-700",
    },

    APPROVED: {
      label: "Approved",

      icon: CheckCircle2,

      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    REJECTED: {
      label: "Rejected",

      icon: XCircle,

      className:
        "border-red-200 bg-red-50 text-red-700",
    },

    PICKED_UP: {
      label: "Picked Up",

      icon: Truck,

      className:
        "border-blue-200 bg-blue-50 text-blue-700",
    },

    COMPLETED: {
      label: "Completed",

      icon: PackageCheck,

      className:
        "border-purple-200 bg-purple-50 text-purple-700",
    },
  };

  const item =
    config[status] ??
    {
      label: status,

      icon: AlertCircle,

      className:
        "border-gray-200 bg-gray-50 text-gray-700",
    };

  const Icon = item.icon;

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        ${item.className}
      `}
    >
      <Icon className="h-3.5 w-3.5" />

      <span>
        {item.label}
      </span>
    </div>
  );
};