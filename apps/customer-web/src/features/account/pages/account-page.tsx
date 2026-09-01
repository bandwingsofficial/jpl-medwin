"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Mail,
  Pencil,
  Phone,
  User2,
  Home,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Modal } from "@/shared/components/ui/modal";
import { useProfile } from "@/features/account/hooks/use-profile";
import { ProfileForm } from "@/features/account/components/profile-form";

export function AccountPage() {
  const [open, setOpen] = useState(false);

  // =========================================
  // SINGLE PROFILE QUERY
  // =========================================
  const { data, isLoading } = useProfile();
  const profile = data?.data;

  // =========================================
  // CREATE MODE
  // =========================================
  const isProfileExists = !!profile;

  return (
    <>
      {/* BREADCRUMBS */}
      <div className="mb-4 flex min-w-0 items-center gap-1.5 overflow-hidden text-xs sm:text-sm">
        <Link
          href="/"
          className="
            inline-flex
            shrink-0
            items-center
            gap-1.5
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Home</span>
        </Link>

        <ChevronRight
          className="h-3.5 w-3.5 shrink-0 text-slate-300 sm:h-4 sm:w-4"
          strokeWidth={2}
        />

        <span className="truncate font-semibold text-teal-600">
          My Account
        </span>
      </div>

      {/* PROFILE CARD */}
      <Card className="overflow-hidden rounded-2xl border bg-white shadow-sm sm:rounded-3xl">
        {/* TOP SECTION */}
        <div className="border-b bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
              {/* PROFILE IMAGE */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white bg-muted shadow-md sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                {profile?.avatarUrl ? (
  <Image
    src={profile.avatarUrl}
    alt={profile?.name || "Profile"}
    fill
    unoptimized
    className="object-cover"
  />
) : (
  <div
    className="
      flex
      h-full
      w-full
      items-center
      justify-center
      bg-teal-600
      text-white
      text-3xl
      font-bold
      uppercase
      sm:text-4xl
      lg:text-5xl
    "
  >
    {(
      profile?.name?.trim()?.charAt(0) ||
      profile?.firstName?.trim()?.charAt(0) ||
      "U"
    ).toUpperCase()}
  </div>
)}
              </div>

              {/* TEXT */}
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                  {isLoading
                    ? "Loading..."
                    : profile?.name || "Create Your Profile"}
                </h1>

                <p className="mt-1.5 max-w-2xl text-xs leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-5">
                  {isProfileExists
                    ? "Manage your account information and profile settings"
                    : "Complete your profile setup to continue"}
                </p>
              </div>
            </div>

            {/* ACTION */}
            <Button
              onClick={() => setOpen(true)}
              className="h-9 w-full gap-2 px-4 text-sm sm:w-auto"
            >
              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {isProfileExists ? "Edit Profile" : "Create Profile"}
            </Button>
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-6 p-4 sm:p-5 lg:p-6">
          {/* PERSONAL INFORMATION */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* SALUTATION */}
              <div className="min-w-0 rounded-xl border bg-slate-50/70 p-3.5 sm:rounded-2xl sm:p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Salutation
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900 sm:text-base">
                  {profile?.salutation || "Not Added"}
                </p>
              </div>

              {/* FIRST NAME */}
              <div className="min-w-0 rounded-xl border bg-slate-50/70 p-3.5 sm:rounded-2xl sm:p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  First Name
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900 sm:text-base">
                  {profile?.firstName || (profile?.name ? profile.name.split(" ")[0] : "Not Added")}
                </p>
              </div>

              {/* LAST NAME */}
              <div className="min-w-0 rounded-xl border bg-slate-50/70 p-3.5 sm:rounded-2xl sm:p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Last Name
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900 sm:text-base">
                  {profile?.lastName || (profile?.name && profile.name.split(" ").length > 1 ? profile.name.split(" ").slice(1).join(" ") : "Not Added")}
                </p>
              </div>

              {/* CUSTOMER TYPE */}
              <div className="min-w-0 rounded-xl border bg-slate-50/70 p-3.5 sm:rounded-2xl sm:p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Customer Type
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900 sm:text-base">
                  {profile?.customerType || "Not Added"}
                </p>
              </div>
            </div>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* MOBILE / PHONE (EXISTING - UNTOUCHED) */}
              <div className="min-w-0 rounded-xl border bg-slate-50/70 p-3.5 sm:rounded-2xl sm:p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">
                    Mobile / Phone
                  </p>
                </div>
                <p className="break-all text-sm font-semibold text-slate-900 sm:text-base">
                  {profile?.phoneNumber || "Not Added"}
                </p>
              </div>

              {/* WHATSAPP NUMBER (NEW) */}
              <div className="min-w-0 rounded-xl border bg-slate-50/70 p-3.5 sm:rounded-2xl sm:p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-teal-600" />
                  <p className="text-xs font-medium text-muted-foreground">
                    WhatsApp Number
                  </p>
                </div>
                <p className="break-all text-sm font-semibold text-slate-900 sm:text-base">
                  {profile?.whatsappNumber || "Not Added"}
                </p>
              </div>

              {/* EMAIL (EXISTING - UNTOUCHED) */}
              <div className="min-w-0 rounded-xl border bg-slate-50/70 p-3.5 sm:rounded-2xl sm:p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">
                    Email Address
                  </p>
                </div>
                <p className="break-all text-sm font-semibold text-slate-900 sm:text-base">
                  {profile?.email || "Not Added"}
                </p>
              </div>
            </div>
          </div>

          {/* BUSINESS INFORMATION */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Business Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* CLINIC / HOSPITAL NAME */}
              <div className="min-w-0 rounded-xl border bg-slate-50/70 p-3.5 sm:rounded-2xl sm:p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Clinic / Hospital Name
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-900 sm:text-base">
                  {profile?.clinicHospitalName || "Not Added"}
                </p>
              </div>

              {/* GST NUMBER */}
              <div className="min-w-0 rounded-xl border bg-slate-50/70 p-3.5 sm:rounded-2xl sm:p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  GST Number
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-slate-900 sm:text-base">
                  {profile?.gstNumber || "Not Added"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={isProfileExists ? "Update Profile" : "Create Profile"}
      >
        <ProfileForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}