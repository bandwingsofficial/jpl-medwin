// apps/customer-web/src/app/loading.tsx

export default function Loading() {
  // You can add any UI here, like a skeleton or a spinner
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-lg font-semibold">Loading Medical Records...</p>
    </div>
  );
}