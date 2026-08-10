import CareersPage from "@/features/static-pages/pages/Career-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore career opportunities at JPL Medwin and join our team of professionals dedicated to providing exceptional dental and medical equipment.",
};
export default function Page() {
  return <CareersPage />;
}