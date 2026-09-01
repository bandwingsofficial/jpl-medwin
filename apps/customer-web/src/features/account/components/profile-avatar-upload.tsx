"use client";

import Image from "next/image";

import { UserCircle2 } from "lucide-react";

interface Props {
  preview?: string | null;

  onChange: (
    file: File | null
  ) => void;
}

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function ProfileAvatarUpload({
  preview,
  onChange,
}: Props) {
  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0] || null;

    if (!file) {
      onChange(null);

      return;
    }

    // =========================================
    // FILE TYPE VALIDATION
    // =========================================

    if (
      !ACCEPTED_TYPES.includes(
        file.type
      )
    ) {
      showError(
        "Only JPG, PNG and WEBP images are allowed."
      );

      return;
    }

    // =========================================
    // FILE SIZE VALIDATION
    // =========================================

    if (file.size > MAX_FILE_SIZE) {
      showError(
        "Image size must be less than 5MB."
      );

      return;
    }

    onChange(file);
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      {/* AVATAR */}
      <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border bg-muted shadow-sm">
        {preview ? (
          <Image
            src={preview}
            alt="Profile Avatar"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <UserCircle2 className="h-16 w-16 text-muted-foreground" />
        )}
      </div>

      {/* FILE INPUT */}
      <div className="space-y-2">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={
            handleFileChange
          }
          className="block text-sm"
        />

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            JPG, PNG or WEBP
            supported
          </p>

          <p className="text-xs text-muted-foreground">
            Maximum size: 5MB
          </p>
        </div>
      </div>
    </div>
  );
}

function showError(arg0: string) {
  throw new Error("Function not implemented.");
}
