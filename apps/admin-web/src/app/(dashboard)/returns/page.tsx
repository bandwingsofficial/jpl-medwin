import ReturnsPage from "@/features/order-management/components/returns-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns",
  description:
    "Manage and view JPL Medwin returns, return details, and return activity from the admin dashboard.",
};
export default function Page() {
  return <ReturnsPage />;
}