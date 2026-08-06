"use client";

export default function AuthError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow text-center space-y-3">
        <h2 className="text-lg font-semibold">
          Authentication Error
        </h2>

        <p className="text-sm text-gray-500">
          Something went wrong during login.
        </p>

        <button
          onClick={reset}
          className="px-4 py-2 bg-purple-600 text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}