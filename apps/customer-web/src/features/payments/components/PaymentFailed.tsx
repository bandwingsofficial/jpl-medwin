interface Props {
  onRetry: () => void;
}

export const PaymentFailed = ({ onRetry }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-sm">
      <div className="mb-4 text-5xl">❌</div>

      <h2 className="text-2xl font-bold">
        Payment Failed
      </h2>

      <p className="mt-2 text-gray-500">
        Something went wrong while processing your payment.
      </p>

      <button
        onClick={onRetry}
        className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
      >
        Retry Payment
      </button>
    </div>
  );
};