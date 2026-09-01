import { BulkContactPage } from "@/features/static-pages/pages/bulk-contact-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Contact",
  description:
    "Contact JPL Medwin for bulk orders of dental and medical equipment across India.",
};
export default function Page() {
  return <BulkContactPage />;
}