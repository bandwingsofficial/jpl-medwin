import { PaymentStatus } from "../types/payment.type";

export const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case "SUCCESS":
      return "bg-green-100 text-green-700";

    case "FAILED":
      return "bg-red-100 text-red-700";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "REFUNDED":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};