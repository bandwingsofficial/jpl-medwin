interface ProductErrorProps {
  message?: string;
}

export function ProductError({
  message,
}: ProductErrorProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
      <h2 className="text-xl font-semibold text-red-600">
        Failed To Load Products
      </h2>

      <p className="mt-2 max-w-md text-sm text-red-500">
        {message ||
          "Something went wrong while fetching products."}
      </p>
    </div>
  );
}