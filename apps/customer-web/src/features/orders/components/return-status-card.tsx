import { Card } from "@/shared/components/ui/card";

import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Package,
  Wallet,
} from "lucide-react";

interface Props {
  status:
    | "REQUESTED"
    | "APPROVED"
    | "REJECTED"
    | "PICKED_UP"
    | "COMPLETED";

  createdAt?: string;
  updatedAt?: string;
}

export const ReturnStatusCard = ({
  status,
  createdAt,
  updatedAt,
}: Props) => {
  const config = {
    REQUESTED: {
      title: "Return Requested",
      description:
        "Your return request has been submitted and is awaiting review.",
      icon: RotateCcw,
      container:
        "border-amber-100 bg-amber-50/40",
      iconBg: "bg-amber-100",
      iconColor:
        "text-amber-600",
    },

    APPROVED: {
      title: "Return Approved",
      description:
        "Your return request has been approved.",
      icon: CheckCircle2,
      container:
        "border-green-100 bg-green-50/40",
      iconBg: "bg-green-100",
      iconColor:
        "text-green-600",
    },

    REJECTED: {
      title: "Return Rejected",
      description:
        "Your return request was rejected.",
      icon: XCircle,
      container:
        "border-red-100 bg-red-50/40",
      iconBg: "bg-red-100",
      iconColor:
        "text-red-600",
    },

    PICKED_UP: {
      title: "Item Picked Up",
      description:
        "The returned item has been collected.",
      icon: Package,
      container:
        "border-blue-100 bg-blue-50/40",
      iconBg: "bg-blue-100",
      iconColor:
        "text-blue-600",
    },

    COMPLETED: {
      title: "Return Completed",
      description:
        "Return process completed successfully.",
      icon: Wallet,
      container:
        "border-emerald-100 bg-emerald-50/40",
      iconBg:
        "bg-emerald-100",
      iconColor:
        "text-emerald-600",
    },
  };

  const current =
    config[status];

  const Icon =
    current.icon;

  return (
    <Card
      className={`rounded-3xl p-6 shadow-sm ${current.container}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${current.iconBg}`}
        >
          <Icon
            className={`h-7 w-7 ${current.iconColor}`}
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-black">
            {current.title}
          </h3>

          <p className="mt-2 text-sm text-black/60">
            {current.description}
          </p>

          {createdAt && (
            <p className="mt-3 text-sm text-black/60">
              Requested on{" "}
              {new Date(
                createdAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          )}

          {updatedAt && (
            <p className="mt-1 text-sm text-black/60">
              Last Updated{" "}
              {new Date(
                updatedAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};