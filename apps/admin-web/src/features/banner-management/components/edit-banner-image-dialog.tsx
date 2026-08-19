"use client";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

import {
  BannerImage,
  BannerType,
} from "@/features/banner-management/types/banner.types";

import { BannerImageForm } from "./banner-image-form";

import { bannerService } from "@/features/banner-management/services/banner.service";

interface Props {
  open: boolean;

  image: BannerImage | null;

  bannerType: BannerType;

  onOpenChange: (
    open: boolean
  ) => void;

  onSuccess: () => void;
}

export function EditBannerImageDialog({
  open,
  image,
  bannerType,
  onOpenChange,
  onSuccess,
}: Props) {
  if (!image) {
    return null;
  }

  async function handleSubmit(
    file: File | undefined,
    productId: string,
    sortOrder: number
  ) {
    if (!image) {
      return;
    }

    try {
      await bannerService.updateImage(
        image.id,
        {
          image: file,
          productId,
          sortOrder,
        }
      );

      toast.success(
        "Image updated successfully"
      );

      onSuccess();

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Update Banner Image Error:",
        error
      );

      toast.error(
        "Failed to update image"
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
            Edit Banner Image
          </DialogTitle>

          <DialogDescription>
            Update image
          </DialogDescription>
        </DialogHeader>

        {/* ================================================
            SCROLLABLE FORM CONTENT
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
            defaultProductId={
              image.productId
            }
            defaultSortOrder={
              image.sortOrder
            }
            isSubmitting={false}
            bannerType={bannerType}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}