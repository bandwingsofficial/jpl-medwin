"use client";

import { ProductPage } from "@/features/product-management/components/product-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Manage and view JPL Medwin products, product information, inventory details and product activity from the admin dashboard.",
};
export default function ProductsPage() {
  return <ProductPage />;
}