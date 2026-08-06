"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Something went wrong
        </h1>

        <p className="text-sm text-gray-500">
          An unexpected error occurred. Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}