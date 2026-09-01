import CollectionsPage from "@/features/collections/pages/collection-pages";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore our curated collections of dental, medical, surgical and healthcare products at JPL Medwin.",
};
export default function Page() {
  return <CollectionsPage />;
}