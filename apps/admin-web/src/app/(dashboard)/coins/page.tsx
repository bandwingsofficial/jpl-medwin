import  CoinPage  from "@/features/coin-management/pages/coin-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coins",
  description:
    "Manage and view JPL Medwin coins, coin transactions, rewards and coin activity from the admin dashboard.",
};
export default function Page() {
  return <CoinPage />;
}