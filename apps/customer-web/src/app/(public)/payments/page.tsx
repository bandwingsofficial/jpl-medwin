import { PaymentPage } from "@/features/static-pages/pages/payment-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments",
  description:
    "Learn about secure and convenient payment options available at JPL Medwin for purchasing dental equipment, medical instruments and healthcare products online.",
};

export default function Page() {
  return <PaymentPage />;
}