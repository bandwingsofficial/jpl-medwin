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
                    alt="Profile"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100">
                    <User2 className="h-9 w-9 text-slate-400 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
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
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:gap-5 lg:p-6">
          {/* EMAIL */}
          <div className="min-w-0 rounded-xl border bg-slate-50/70 p-4 sm:rounded-2xl sm:p-5">
            <div className="mb-2.5 flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />

              <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                Email Address
              </p>
            </div>

            <p className="break-all text-sm font-semibold leading-5 text-slate-900 sm:text-base lg:text-lg">
              {profile?.email || "Not Added"}
            </p>
          </div>

          {/* PHONE NUMBER */}
          <div className="min-w-0 rounded-xl border bg-slate-50/70 p-4 sm:rounded-2xl sm:p-5">
            <div className="mb-2.5 flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />

              <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                Phone Number
              </p>
            </div>

            <p className="break-all text-sm font-semibold leading-5 text-slate-900 sm:text-base lg:text-lg">
              {profile?.phoneNumber || "Not Added"}
            </p>
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