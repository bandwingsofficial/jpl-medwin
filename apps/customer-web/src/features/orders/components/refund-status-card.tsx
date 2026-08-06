import { Card } from "@/shared/components/ui/card";

import {
  BadgeCheck,
  Wallet,
} from "lucide-react";

interface Props {
  refundedAt?: string;
}

export const RefundStatusCard = ({
  refundedAt,
}: Props) => {
  return (
    <Card className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
          <Wallet className="h-7 w-7 text-emerald-600" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-black">
              Refund Completed
            </h3>

            <BadgeCheck className="h-5 w-5 text-emerald-600" />
          </div>

          <p className="mt-2 text-sm text-black/60">
            Refund has been processed successfully.
          </p>

          {refundedAt && (
            <p className="mt-3 text-sm font-medium text-emerald-700">
              Refunded on{" "}
              {new Date(
                refundedAt
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