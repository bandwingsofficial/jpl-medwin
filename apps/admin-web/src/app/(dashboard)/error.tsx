"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Dashboard Error
        </h2>

        <p className="text-sm text-gray-500">
          Failed to load dashboard data.
        </p>

        <button
          onClick={reset}
          className="px-4 py-2 bg-purple-600 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    </div>
  );
}