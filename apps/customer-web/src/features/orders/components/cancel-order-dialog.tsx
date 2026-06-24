
"use client";

import { useState } from "react";

import {
  AlertTriangle,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";

import { Textarea } from "@/shared/components/ui/textarea";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (
    reason: string
  ) => void;
  loading?: boolean;
}

export const CancelOrderDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
}: Props) => {
  const [reason, setReason] =
    useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-lg rounded-3xl border-0 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6">
          <DialogHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>

            <DialogTitle className="text-2xl font-bold text-black">
              Cancel Order
            </DialogTitle>

            <DialogDescription className="pt-2 text-sm text-black/60">
              This action cannot be undone.
              Refund will be initiated automatically
              if payment was successful.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-black">
              Cancellation Reason
            </label>

            <Textarea
              placeholder="Tell us why you want to cancel this order..."
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
              className="min-h-[120px] rounded-2xl border-gray-200 focus-visible:ring-red-500"
            />
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm text-orange-700">
              Orders already shipped cannot
              be cancelled.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
            >
              Close
            </Button>

            <Button
              disabled={
                !reason || loading
              }
              onClick={() =>
                onConfirm(reason)
              }
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Confirm Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};