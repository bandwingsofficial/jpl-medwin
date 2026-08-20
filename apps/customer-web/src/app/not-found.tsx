"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  SearchX,
  X,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/25 px-4 backdrop-blur-[2px]">
      {/* POPUP */}
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
              <SearchX className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Page Not Found
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                Error 404
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoBack}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-5 py-5">
          <p className="text-sm font-medium text-slate-700">
            The page you are looking for is not available.
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            It may have been moved, deleted, or the URL may be incorrect.
            Please go back or return to the homepage.
          </p>

          {/* ACTIONS */}
          <div className="mt-5 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Go Back
            </button>

            <button
              type="button"
              onClick={handleGoHome}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-teal-700 active:scale-[0.98]"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}