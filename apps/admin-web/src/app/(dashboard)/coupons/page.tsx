import CouponPage from "@/features/coupon-management/components/coupon-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coupons",
  description:
    "Manage and view JPL Medwin coupons, coupon details, usage statistics and coupon activity from the admin dashboard.",
};
export default function Page() {
  return <CouponPage />;
}