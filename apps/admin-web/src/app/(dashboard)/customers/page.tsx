import { CustomerPage } from "@/features/customer-management/pages/customer-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "Manage and view JPL Medwin customers, customer accounts, contact details, order history and customer activity from the admin dashboard.",
};

export default function Page() {
  return <CustomerPage />;
}