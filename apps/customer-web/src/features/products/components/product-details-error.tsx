interface ProductDetailsErrorProps {
  message?: string;
}

export function ProductDetailsError({
  message,
}: ProductDetailsErrorProps) {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Failed To Load Product
        </h2>

        <p className="mt-2 text-gray-500">
          {message ||
            "Something went wrong while loading the product."}
        </p>
      </div>
    </div>
  );
}