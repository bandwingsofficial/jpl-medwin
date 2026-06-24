import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">
        404
      </h1>

      <p className="text-sm text-gray-500">
        The page you are looking for does not exist.
      </p>

      <Link
        href="/dashboard"
        className="px-4 py-2 bg-purple-600 text-white rounded-md"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}