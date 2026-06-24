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
  showWarning,
  showError,
  showSuccess,
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

  const { data, isLoading } =
    useProfile();

  // =========================================
  // MUTATIONS
  // =========================================

  const createMutation =
    useCreateProfile();

  const updateMutation =
    useUpdateProfile();

  // =========================================
  // PROFILE DATA
  // =========================================

  const profile = data?.data;

  // ✅ DETECT MODE

  const isEditMode = !!profile;

  // =========================================
  // AUTH FIELD DETECTION
  // =========================================

  // ✅ EMAIL LOGIN USER
  const isEmailLocked =
    !!profile?.email;

  // ✅ PHONE LOGIN USER
  const isPhoneLocked =
    !!profile?.phoneNumber;

  // =========================================
  // HYDRATION SAFE
  // =========================================

  const [mounted, setMounted] =
    useState(false);

  // =========================================
  // FORM STATES
  // =========================================

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  // ✅ PHONE NUMBER
  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState("");

  const [avatar, setAvatar] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

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

    // ✅ SET PHONE NUMBER
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
        response.data.avatarUrl ||
          null
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
        error?.response?.data
          ?.message ||
        "Failed to save profile.";

      // =========================================
      // SHOW BACKEND ERROR
      // =========================================

      showError(backendMessage);

      // =========================================
      // DEBUG
      // =========================================

    }
  }

  // =========================================
  // LOADING STATE
  // =========================================

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {isEditMode
            ? "Profile Details"
            : "Create Profile"}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {isEditMode
            ? "Update your personal information"
            : "Complete your profile information"}
        </p>
      </div>

      {/* AVATAR */}
      <ProfileAvatarUpload
        preview={preview}
        onChange={(file) => {
          setAvatar(file);

          if (file) {
            const objectUrl =
              URL.createObjectURL(
                file
              );

            setPreview(objectUrl);
          }
        }}
      />

      {/* FORM */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* NAME */}
        <div className="space-y-2">
          <Label>Name</Label>

          <Input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Enter your name"
            required
          />
        </div>

        {/* EMAIL */}
        <div className="space-y-2">
          <Label>Email</Label>

          <Input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="Enter your email"
            required
            disabled={isEmailLocked}
          />

          {isEmailLocked && (
            <p className="text-xs text-muted-foreground">
              Email linked with your login account
            </p>
          )}
        </div>

        {/* PHONE NUMBER */}
        <div className="space-y-2">
          <Label>Phone Number</Label>

          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(
                e.target.value
              )
            }
            placeholder="Enter your phone number"
            disabled={isPhoneLocked}
          />

          {isPhoneLocked && (
            <p className="text-xs text-muted-foreground">
              Phone number linked with your login account
            </p>
          )}
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
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