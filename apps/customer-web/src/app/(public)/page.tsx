// src/app/(public)/page.tsx

import type { Metadata } from "next";

import HomePage from "@/features/home/pages/home-page";

export const metadata: Metadata = {
  title:
    "JPL Medwin | Dental & Medical Equipment, Instruments & Healthcare Supplies",

  description:
    "JPL Medwin is your trusted destination for dental equipment, professional dental instruments, medical equipment, surgical instruments and healthcare supplies.",

  keywords: [
    "JPL Medwin",
    "dental equipment",
    "dental instruments",
    "dental products",
    "professional dental instruments",
    "medical equipment",
    "medical instruments",
    "surgical instruments",
    "healthcare supplies",
  ],

  openGraph: {
    title:
      "JPL Medwin | Dental & Medical Equipment, Instruments & Healthcare Supplies",
    description:
      "Shop dental equipment, professional dental instruments, medical equipment, surgical instruments and healthcare supplies from JPL Medwin.",
    type: "website",
    siteName: "JPL Medwin",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "JPL Medwin | Dental & Medical Equipment, Instruments & Healthcare Supplies",
    description:
      "Shop dental equipment, professional dental instruments, medical equipment, surgical instruments and healthcare supplies from JPL Medwin.",
  },
};

export default function HomeRoute() {
  return <HomePage />;
}