"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  House,
  PackageX,
  X,
} from "lucide-react";

interface ProductErrorProps {
  message?: string;
}

export function ProductError({
  message,
}: ProductErrorProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <PackageX className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Unable to Load Products
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Request failed
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close error dialog"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-5 py-5">
          <p className="text-sm font-medium leading-6 text-slate-700">
            The products could not be loaded.
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {
              "Something went wrong while fetching the products. Please go back and try again."}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />

            Go Back
          </button>

          <button
            type="button"
            onClick={handleGoHome}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-teal-700 active:scale-[0.98]"
          >
            <House className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />

            Home
          </button>
        </div>
      </div>
    </div>
  );
}