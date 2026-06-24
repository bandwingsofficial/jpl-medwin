"use client";

import Image from "next/image";
import { useState } from "react";
import { Mail, Pencil, Phone, User2 } from "lucide-react";

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
      {/* PROFILE CARD */}
      <Card className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        {/* TOP SECTION */}
        <div className="relative border-b bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* PROFILE IMAGE */}
              <div className="relative h-28 w-28 mx-auto sm:mx-0 overflow-hidden rounded-full border-4 border-white bg-muted shadow-md flex-shrink-0">
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
                    <User2 className="h-12 w-12 text-slate-400" />
                  </div>
                )}
              </div>

              {/* TEXT */}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {isLoading
                    ? "Loading..."
                    : profile?.name || "Create Your Profile"}
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  {isProfileExists
                    ? "Manage your account information and profile settings"
                    : "Complete your profile setup to continue"}
                </p>
              </div>
            </div>

            {/* ACTION */}
            <Button
              onClick={() => setOpen(true)}
              className="gap-2 w-full sm:w-auto justify-center"
            >
              <Pencil className="h-4 w-4" />
              {isProfileExists ? "Edit Profile" : "Create Profile"}
            </Button>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
          
          {/* EMAIL */}
          <div className="rounded-2xl border bg-slate-50/70 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                Email Address
              </p>
            </div>

            <p className="break-all text-base sm:text-lg font-semibold text-slate-900">
              {profile?.email || "Not Added"}
            </p>
          </div>

          {/* PHONE NUMBER */}
          <div className="rounded-2xl border bg-slate-50/70 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                Phone Number
              </p>
            </div>

            <p className="text-base sm:text-lg font-semibold text-slate-900">
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