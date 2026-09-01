"use client";

import { useState } from "react";

import {
  RotateCcw,
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
    type: string,
    reason: string,
    description: string
  ) => void;
  loading?: boolean;
}

export const RequestReturnDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
}: Props) => {
  const [reason, setReason] =
    useState("DAMAGED_PRODUCT");

  const [type, setType] =
    useState("REFUND");

  const [
    description,
    setDescription,
  ] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
        {/* HEADER */}

        <div className="border-b bg-amber-50 px-5 py-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <RotateCcw className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <DialogTitle className="text-lg font-bold">
                  Request Return
                </DialogTitle>

                <DialogDescription className="mt-1 text-xs">
                  Submit a return request for this order.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* BODY */}

        <div className="space-y-4 px-5 py-4">
          {/* RESOLUTION TYPE */}

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Resolution Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value
                )
              }
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                px-3
                text-sm
                outline-none
                focus:border-amber-500
              "
            >
              <option value="REFUND">
                Refund
              </option>

              <option value="REPLACEMENT">
                Replacement
              </option>
            </select>
          </div>

          {/* REASON */}

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Return Reason
            </label>

            <select
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                px-3
                text-sm
                outline-none
                focus:border-amber-500
              "
            >
              <option value="DAMAGED_PRODUCT">
                Damaged Product
              </option>

              <option value="WRONG_ITEM">
                Wrong Item
              </option>

              <option value="QUALITY_ISSUE">
                Quality Issue
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>

            <Textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="
                min-h-[90px]
                rounded-xl
                resize-none
              "
            />
          </div>

          {/* NOTE */}

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-700">
              Returns are allowed only after successful delivery.
            </p>
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-lg"
            >
              Close
            </Button>

            <Button
              disabled={
                loading ||
                !description.trim()
              }
              onClick={() =>
                onConfirm(
                  type,
                  reason,
                  description
                )
              }
              className="rounded-lg bg-amber-600 hover:bg-amber-700"
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};