import type { Metadata } from "next";

import {
  DashboardPage,
} from "@/features/dashboard/pages/DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "JPL Medwin admin dashboard for managing products, orders, customers, categories, brands, inventory and other business operations.",
};

export default function Page() {
  return <DashboardPage />;
}