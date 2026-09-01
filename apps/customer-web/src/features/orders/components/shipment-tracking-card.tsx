import {
  Truck,
  PackageCheck,
} from "lucide-react";

import { Card } from "@/shared/components/ui/card";

interface Props {
  trackingId?: string;
  courierName?: string;
  shippedAt?: string;
}

export const ShipmentTrackingCard = ({
  trackingId,
  courierName,
  shippedAt,
}: Props) => {
  return (
    <Card className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <Truck className="h-7 w-7 text-blue-600" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-black">
              Shipment Details
            </h3>

            <PackageCheck className="h-5 w-5 text-green-600" />
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p className="text-black/70">
              Courier:
              <span className="ml-2 font-semibold text-black">
                {courierName || "-"}
              </span>
            </p>

            <p className="text-black/70">
              Tracking ID:
              <span className="ml-2 font-semibold text-black">
                {trackingId || "-"}
              </span>
            </p>

            {shippedAt && (
              <p className="text-black/70">
                Shipped On:
                <span className="ml-2 font-semibold text-black">
                  {new Date(
                    shippedAt
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};