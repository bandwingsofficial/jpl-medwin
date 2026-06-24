export const PaymentLoader = () => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

      <p className="text-sm text-gray-500">
        Processing your payment...
      </p>
    </div>
  );
};