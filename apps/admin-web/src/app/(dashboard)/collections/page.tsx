import {
  CollectionPage,
} from "@/features/collection-management/pages/collection-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Manage and view JPL Medwin collections, collection information, product associations and collection activity from the admin dashboard.",
};
export default function Page() {
  return <CollectionPage />;
}