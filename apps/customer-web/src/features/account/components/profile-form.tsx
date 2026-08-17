"use client";

import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import {
  useCreateProfile,
  useProfile,
  useUpdateProfile,
} from "@/features/account/hooks/use-profile";

import {
  showError,
} from "@/shared/store/toast.store";

import { ProfileAvatarUpload } from "./profile-avatar-upload";
import { ProfileSkeleton } from "./profile-skelton";

interface Props {
  onSuccess?: () => void;
}

export function ProfileForm({
  onSuccess,
}: Props) {
  // =========================================
  // PROFILE QUERY
  // =========================================

  const { data, isLoading } = useProfile();

  // =========================================
  // MUTATIONS
  // =========================================

  const createMutation = useCreateProfile();
  const updateMutation = useUpdateProfile();

  // =========================================
  // PROFILE DATA
  // =========================================

  const profile = data?.data;

  // DETECT MODE
  const isEditMode = !!profile;

  // =========================================
  // AUTH FIELD DETECTION
  // =========================================

  const isEmailLocked = !!profile?.email;
  const isPhoneLocked = !!profile?.phoneNumber;

  // =========================================
  // HYDRATION SAFE
  // =========================================

  const [mounted, setMounted] = useState(false);

  // =========================================
  // FORM STATES
  // =========================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState("");

  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // =========================================
  // HYDRATION FIX
  // =========================================

  useEffect(() => {
    setMounted(true);
  }, []);

  // =========================================
  // SET PROFILE DATA
  // =========================================

  useEffect(() => {
    if (!profile) return;

    setName(profile.name || "");
    setEmail(profile.email || "");

    setPhoneNumber(
      profile.phoneNumber || ""
    );

    setPreview(
      profile.avatarUrl || null
    );
  }, [profile]);

  // =========================================
  // CLEANUP OBJECT URL
  // =========================================

  useEffect(() => {
    return () => {
      if (
        preview &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // =========================================
  // HYDRATION SAFE RENDER
  // =========================================

  if (!mounted) {
    return <ProfileSkeleton />;
  }

  // =========================================
  // LOADING STATE
  // =========================================

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // =========================================
  // SUBMIT HANDLER
  // =========================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      let response;

      // =========================================
      // CREATE PROFILE
      // =========================================

      if (!isEditMode) {
        response =
          await createMutation.mutateAsync({
            name,
            email,
            phoneNumber,
            avatar,
          });
      }

      // =========================================
      // UPDATE PROFILE
      // =========================================

      else {
        response =
          await updateMutation.mutateAsync({
            name,
            email,
            phoneNumber,
            avatar,
          });
      }

      // =========================================
      // UPDATE IMAGE PREVIEW
      // =========================================

      setPreview(
        response.data.avatarUrl || null
      );

      // =========================================
      // RESET FILE
      // =========================================

      setAvatar(null);

      // =========================================
      // CALLBACK
      // =========================================

      onSuccess?.();
    } catch (error: any) {
      // =========================================
      // EXACT BACKEND MESSAGE
      // =========================================

      const backendMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to save profile.";

      // =========================================
      // SHOW BACKEND ERROR
      // =========================================

      showError(backendMessage);
    }
  }

  // =========================================
  // SUBMITTING STATE
  // =========================================

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        min-w-0
        space-y-6
        sm:space-y-8
      "
    >
      {/* HEADER */}
      <div className="min-w-0">
        <h2
          className="
            text-xl
            font-semibold
            tracking-tight
            sm:text-2xl
          "
        >
          {isEditMode
            ? "Profile Details"
            : "Create Profile"}
        </h2>

        <p
          className="
            mt-1
            text-sm
            leading-5
            text-muted-foreground
            sm:leading-normal
          "
        >
          {isEditMode
            ? "Update your personal information"
            : "Complete your profile information"}
        </p>
      </div>

      {/* AVATAR */}
      <div className="w-full min-w-0">
        <ProfileAvatarUpload
          preview={preview}
          onChange={(file) => {
            setAvatar(file);

            if (file) {
              const objectUrl =
                URL.createObjectURL(file);

              setPreview(objectUrl);
            }
          }}
        />
      </div>

      {/* FORM */}
      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-5
          md:grid-cols-2
        "
      >
        {/* NAME */}
        <div className="min-w-0 space-y-2">
          <Label>Name</Label>

          <Input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter your name"
            required
            className="
              w-full
              min-w-0
              text-[16px]
              sm:text-sm
            "
          />
        </div>

        {/* EMAIL */}
        <div className="min-w-0 space-y-2">
          <Label>Email</Label>

          <Input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            required
            disabled={isEmailLocked}
            className="
              w-full
              min-w-0
              text-[16px]
              sm:text-sm
            "
          />

          {isEmailLocked && (
            <p
              className="
                text-xs
                leading-5
                text-muted-foreground
              "
            >
              Email linked with your login account
            </p>
          )}
        </div>

        {/* PHONE NUMBER */}
        <div className="min-w-0 space-y-2">
          <Label>Phone Number</Label>

          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value)
            }
            placeholder="Enter your phone number"
            disabled={isPhoneLocked}
            className="
              w-full
              min-w-0
              text-[16px]
              sm:text-sm
            "
          />

          {isPhoneLocked && (
            <p
              className="
                text-xs
                leading-5
                text-muted-foreground
              "
            >
              Phone number linked with your login account
            </p>
          )}
        </div>
      </div>

      {/* ACTION */}
      <div
        className="
          flex
          w-full
          justify-stretch
          sm:justify-end
        "
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full
            sm:w-auto
          "
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Profile"
              : "Create Profile"}
        </Button>
      </div>
    </form>
  );
}
