"use client";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

import { BannerImageForm } from "./banner-image-form";

import { bannerService } from "@/features/banner-management/services/banner.service";

import { BannerType } from "@/features/banner-management/types/banner.types";

interface Props {
  open: boolean;
  bannerId: string;
  bannerType: BannerType;
  defaultSortOrder?: number;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddBannerImageDialog({
  open,
  bannerId,
  bannerType,
  defaultSortOrder = 0,
  onOpenChange,
  onSuccess,
}: Props) {
  async function handleSubmit(
    file: File | undefined,
    link: string,
    sortOrder: number,
  ) {
    if (!file) {
      toast.error("Image is required");
      return;
    }

    try {
      await bannerService.addImage(
        bannerId,
        file,
        link,
        sortOrder,
      );

      toast.success(
        "Banner image added successfully",
      );

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(
        "Add Banner Image Error:",
        error,
      );

      toast.error(
        "Failed to add banner image",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          w-[calc(100vw-2rem)]
          max-w-xl

          h-[calc(100dvh-2rem)]
          max-h-[calc(100dvh-2rem)]

          overflow-hidden
          p-0

          flex
          flex-col

          bg-white
        "
      >
        {/* ================================================
            FIXED HEADER
        ================================================= */}
        <DialogHeader
          className="
            shrink-0
            border-b
            bg-white
            px-6
            py-5
          "
        >
          <DialogTitle>
            Add Banner Image
          </DialogTitle>

          <DialogDescription>
            Upload an image matching the required
            banner dimensions.
          </DialogDescription>
        </DialogHeader>

        {/* ================================================
            SCROLLABLE FORM AREA
        ================================================= */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden

            overscroll-contain

            px-6
            py-5

            scrollbar-thin
            scrollbar-thumb-gray-300
            scrollbar-track-transparent
            hover:scrollbar-thumb-gray-400
          "
        >
          <BannerImageForm
            isSubmitting={false}
            bannerType={bannerType}
            defaultSortOrder={defaultSortOrder}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}