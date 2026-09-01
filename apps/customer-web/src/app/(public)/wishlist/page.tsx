import { WishlistPage } from "@/features/wishlist/pages/wishlist-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
  description:
    "View and manage your wishlist items at JPL Medwin.",
};
export default function Page() {
  return (
    <WishlistPage />
  );
}