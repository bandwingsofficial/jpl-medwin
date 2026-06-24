"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface Props {
  status:
    | "REQUESTED"
    | "APPROVED"
    | "REJECTED"
    | "PICKED_UP"
    | "COMPLETED";

  onApprove: () => void;
  onReject: () => void;
  onPickup: () => void;
  onComplete: () => void;

  loading?: boolean;
}

export const ReturnActions = ({
  status,
  onApprove,
  onReject,
  onPickup,
  onComplete,
  loading,
}: Props) => {
  if (status === "COMPLETED") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        Return Process Completed
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        Return Request Rejected
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {status === "REQUESTED" && (
        <>
          <Button
            onClick={() => {
              onApprove();
            }}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Approve
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              onReject();
            }}
            disabled={loading}
          >
            Reject
          </Button>
        </>
      )}

      {status === "APPROVED" && (
        <Button
          onClick={() => {
            onPickup();
          }}
          disabled={loading}
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Mark Picked Up
        </Button>
      )}

      {status === "PICKED_UP" && (
        <Button
          onClick={() => {
             onComplete();
          }}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Complete Return
        </Button>
      )}
    </div>
  );
};