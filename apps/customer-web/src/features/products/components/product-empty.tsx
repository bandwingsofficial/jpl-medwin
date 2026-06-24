export function ProductEmpty() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <h2 className="text-xl font-semibold text-gray-900">
        No Products Found
      </h2>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        We could not find any products for this
        category right now.
      </p>
    </div>
  );
}