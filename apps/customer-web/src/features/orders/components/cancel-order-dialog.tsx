"use client";

import { useState } from "react";

import { AlertTriangle, Loader2 } from "lucide-react";

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
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

const PREDEFINED_REASONS = [
  "I cannot find my preferred payment method",
  "I found a better price or product elsewhere",
  "I want to add or modify items",
  "I find pricing too high or unclear",
  "I am not sure about quality and return/exchange policy",
  "I am facing issues in applying coupons",
  "I am not sure about the delivery dates",
  "Others",
];

export const CancelOrderDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
}: Props) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const isOther = selectedReason === "Other";
  const finalReason = (isOther ? customReason : selectedReason).trim();
  const isValid = finalReason.length > 0;

  const handleClose = () => {
    if (loading) return;
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  const handleConfirm = () => {
    if (!isValid || loading) return;
    onConfirm(finalReason);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-0 p-0 sm:max-w-lg">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6">
          <DialogHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>

            <DialogTitle className="text-2xl font-bold text-black">
              Wait, are you sure?
            </DialogTitle>

            <DialogDescription className="pt-2 text-sm text-black/60">
              I Products in huge demand might run out of stock
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-black">
              Let us know what went wrong <span className="text-red-500">*</span>
            </label>

            <div className="space-y-2">
              {PREDEFINED_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-all ${
                    selectedReason === r
                      ? "border-red-500 bg-red-50/50 font-medium text-red-950 shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={r}
                    checked={selectedReason === r}
                    onChange={(e) => {
                      setSelectedReason(e.target.value);
                      if (e.target.value !== "Other") setCustomReason("");
                    }}
                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            {isOther && (
              <div className="mt-3">
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Please specify your reason <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Tell us why you wish to cancel this order..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="min-h-[90px] rounded-xl border-gray-200 text-sm focus-visible:ring-red-500"
                />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5">
            <p className="text-xs font-medium text-amber-800">
              Orders already shipped cannot be cancelled. Cancellation is permanent and cannot be undone.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <Button
              variant="outline"
              type="button"
              disabled={loading}
              onClick={handleClose}
              className="rounded-xl border-gray-200 text-black/70 hover:bg-gray-100 sm:w-auto"
            >
              Skip and exit
            </Button>

            <Button
              type="button"
              disabled={!isValid || loading}
              onClick={handleConfirm}
              className="rounded-xl bg-red-600 font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 sm:w-auto"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelling...
                </span>
              ) : (
                "Cancel Order"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};