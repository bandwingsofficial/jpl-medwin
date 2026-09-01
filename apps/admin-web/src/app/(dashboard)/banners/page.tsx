import {
  BannerPage,
} from "@/features/banner-management/pages/banner-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banners",
  description:
    "Manage JPL Medwin website banners, promotional banners, product banners, category banners and other banner content from the admin dashboard.",
};

export default function Page() {
  return <BannerPage />;
}