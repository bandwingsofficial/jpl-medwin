"use client";

import  { MiniCategoryPage }  from "@/features/mini-category-management/components/mini-category-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mini Categories",
  description:
    "Manage and view JPL Medwin mini categories, category information and category activity from the admin dashboard.",
};
export default function Page() {
  return <MiniCategoryPage />;
}