"use client";

import {
  X,
  RotateCcw,
  Calendar,
  User,
  Package,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { customerApi } from "@/features/customer-management/api/customer.api";
import { useEffect, useState } from "react";
import { ReturnRequest } from "../types/return.type";

import { ReturnStatusBadge } from "./return-status-badge";

import { ReturnActions } from "./return-action";

import {
  useApproveReturn,
  useRejectReturn,
  usePickupReturn,
  useCompleteReturn,
} from "../hooks/use-returns";

interface Props {
  open: boolean;

  returnData?: ReturnRequest | null;

  loading?: boolean;

  onClose: () => void;
}

export default function ReturnDetailsDrawer({
  open,
  returnData,
  loading,
  onClose,
}: Props) {
  const approveMutation =
    useApproveReturn();

  const rejectMutation =
    useRejectReturn();

  const pickupMutation =
    usePickupReturn();

  const completeMutation =
    useCompleteReturn();
  const [customer, setCustomer] =
  useState<any>(null);
  useEffect(() => {
  if (!returnData?.userId) return;

  customerApi
    .getById(returnData.userId)
    .then((res) => {
      const customerData =
        res?.data ?? res;

      setCustomer(customerData);
    })
    .catch(console.error);
}, [returnData?.userId]);

  /*
  |--------------------------------------------------------------------------
  | CLOSED
  |--------------------------------------------------------------------------
  */

  if (!open) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        className="
          fixed inset-0
          z-[9999]
          flex justify-end
        "
      >
        <div
          className="
            absolute inset-0
            bg-black/40
          "
          onClick={() => {
  toast.info("Closing return details");
  onClose();
}}
        />

        <div
          className="
            relative
            z-[10000]
            flex h-full w-full max-w-3xl
            items-center
            justify-center
            bg-white
          "
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={34}
              className="animate-spin text-blue-600"
            />

            <p className="text-sm text-gray-500">
              Loading return details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NO DATA
  |--------------------------------------------------------------------------
  */

  if (!returnData) {
    return null;
  }

  const actionLoading =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    pickupMutation.isPending ||
    completeMutation.isPending;

  return (
    <div
      className="
        fixed inset-0
        z-[9999]
        flex justify-end
      "
    >
      {/* OVERLAY */}

      <div
        className="
          absolute inset-0
          bg-black/40
          backdrop-blur-[2px]
        "
        onClick={() => {
  toast.info("Closing return details");
  onClose();
}}
      />

      {/* DRAWER */}

      <div
        className="
          relative
          z-[10000]
          flex h-full w-full max-w-3xl
          flex-col
          overflow-hidden
          border-l
          border-gray-200
          bg-[#f8fafc]
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div
          className="
            sticky top-0
            z-30
            flex items-center justify-between
            border-b
            border-gray-200
            bg-white
            px-4 py-4
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-bold
                text-gray-900
              "
            >
              Return Details
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              {returnData.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              flex h-9 w-9
              items-center
              justify-center
              rounded-lg
              border
              border-gray-200
              bg-white
              text-gray-500
              transition-all
              hover:bg-gray-100
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-4 py-4
          "
        >
          <div className="space-y-4">
            {/* STATUS */}

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Return Status
                </p>

                <ReturnStatusBadge
                  status={returnData.status}
                />
              </div>

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Return Type
                </p>

                <span
                  className="
                    inline-flex
                    rounded-md
                    bg-blue-100
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-blue-700
                  "
                >
                  {returnData.type}
                </span>
              </div>

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Created Date
                </p>

                <p className="text-sm font-semibold text-gray-800">
                  {new Date(
                    returnData.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

            {/* RETURN INFO */}

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <RotateCcw
                  size={16}
                  className="text-orange-600"
                />

                <h3 className="text-sm font-semibold text-gray-900">
                  Return Information
                </h3>
              </div>

              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div>
                  <p className="text-gray-500">
                    Return ID
                  </p>

                  <p className="font-medium">
                    {returnData.id}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Order ID
                  </p>

                  <p className="font-medium">
                    {returnData.orderId}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Reason
                  </p>

                  <p className="font-medium">
                    {returnData.reason}
                  </p>
                </div>

                <div>
  <p className="text-gray-500">
    Customer Name
  </p>

  <p className="font-medium">
    {customer?.profile?.name || "-"}
  </p>
</div>

<div>
  <p className="text-gray-500">
    Phone Number
  </p>

  <p className="font-medium">
    {customer?.profile?.phoneNumber || "-"}
  </p>
</div>
              </div>
            </div>

            {/* TIMELINE */}

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Calendar
                  size={16}
                  className="text-purple-600"
                />

                <h3 className="text-sm font-semibold text-gray-900">
                  Return Timeline
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                {returnData.approvedAt && (
                  <div>
                    <p className="text-gray-500">
                      Approved At
                    </p>

                    <p className="font-medium">
                      {new Date(
                        returnData.approvedAt
                      ).toLocaleString()}
                    </p>
                  </div>
                )}

                {returnData.pickup
                  ?.pickedUpAt && (
                  <div>
                    <p className="text-gray-500">
                      Picked Up At
                    </p>

                    <p className="font-medium">
                      {new Date(
                        returnData.pickup
                          .pickedUpAt
                      ).toLocaleString()}
                    </p>
                  </div>
                )}

                {returnData.completedAt && (
                  <div>
                    <p className="text-gray-500">
                      Completed At
                    </p>

                    <p className="font-medium">
                      {new Date(
                        returnData.completedAt
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Package
                  size={16}
                  className="text-blue-600"
                />

                <h3 className="text-sm font-semibold text-gray-900">
                  Actions
                </h3>
              </div>

              <ReturnActions
                status={
                  returnData.status
                }
                loading={
                  actionLoading
                }
               onApprove={() => {
  toast.info("Approving return...");
  approveMutation.mutate(
    returnData.id
  );
}}
                onReject={() => {
  toast.info("Rejecting return...");
  rejectMutation.mutate(
    returnData.id
  );
}}
               onPickup={() => {
  toast.info("Processing pickup...");
  pickupMutation.mutate(
    returnData.id
  );
}}
                onComplete={() => {
  toast.info("Completing return...");
  completeMutation.mutate(
    returnData.id
  );
}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}