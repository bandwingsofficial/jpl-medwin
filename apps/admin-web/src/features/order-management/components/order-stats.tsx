"use client";

import {
  CheckCircle2,
  Package,
  RotateCcw,
  Truck,
  Wallet,
} from "lucide-react";

interface OrderStatsProps {
  totalOrders: number;

  confirmedOrders: number;

  deliveredOrders: number;

  refundedOrders: number;

  returnedOrders: number;
}

export const OrderStats = ({
  totalOrders,

  confirmedOrders,

  deliveredOrders,

  refundedOrders,

  returnedOrders,
}: OrderStatsProps) => {
  return (
    <div className="overflow-x-auto scrollbar-hide">

      <div className="flex min-w-max gap-3">

        {/* TOTAL ORDERS */}

        <div className="min-w-[220px] rounded-xl border border-gray-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-gray-500">
                Total Orders
              </p>

              <h3 className="mt-1 text-xl font-bold text-gray-900">
                {totalOrders}
              </h3>
            </div>

            <div className="rounded-lg bg-blue-100 p-2">
              <Package
                size={18}
                className="text-blue-600"
              />
            </div>

          </div>
        </div>

        {/* CONFIRMED */}

        <div className="min-w-[220px] rounded-xl border border-gray-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-gray-500">
                Confirmed
              </p>

              <h3 className="mt-1 text-xl font-bold text-green-600">
                {confirmedOrders}
              </h3>
            </div>

            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle2
                size={18}
                className="text-green-600"
              />
            </div>

          </div>
        </div>

        {/* DELIVERED */}

        <div className="min-w-[220px] rounded-xl border border-gray-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-gray-500">
                Delivered
              </p>

              <h3 className="mt-1 text-xl font-bold text-emerald-600">
                {deliveredOrders}
              </h3>
            </div>

            <div className="rounded-lg bg-emerald-100 p-2">
              <Truck
                size={18}
                className="text-emerald-600"
              />
            </div>

          </div>
        </div>

        {/* REFUNDED */}

        <div className="min-w-[220px] rounded-xl border border-gray-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-gray-500">
                Refunded
              </p>

              <h3 className="mt-1 text-xl font-bold text-orange-600">
                {refundedOrders}
              </h3>
            </div>

            <div className="rounded-lg bg-orange-100 p-2">
              <Wallet
                size={18}
                className="text-orange-600"
              />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};