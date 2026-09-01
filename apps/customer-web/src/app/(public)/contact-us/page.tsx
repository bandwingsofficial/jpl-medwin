import { ContactUsPage } from "@/features/static-pages/pages/contact-us-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with JPL Medwin for any inquiries or support regarding our dental and medical equipment.",
};
export default function Page() {
  return <ContactUsPage />;
}