

import { AlertTriangle, X } from "lucide-react";

interface CodLimitDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CodLimitDialog({
  open,
  onClose,
}: CodLimitDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cod-limit-dialog-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-7">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
            </div>

            <h2
              id="cod-limit-dialog-title"
              className="mt-4 text-lg font-bold text-slate-900"
            >
              Cash on Delivery Unavailable
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Cash on Delivery is available only for orders
              below ₹10,000.
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Please select an online payment method to continue
              with this order.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 h-11 w-full rounded-xl bg-teal-600 px-4 text-sm font-bold text-white transition-colors hover:bg-teal-700"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
