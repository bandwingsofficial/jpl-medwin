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
} from "@/features/banner-management/types/banner.types";

import {
  BannerImageForm,
} from "./banner-image-form";

import {
  bannerService,
} from "@/features/banner-management/services/banner.service";

interface Props {
  open: boolean;

  image: BannerImage | null;

  onOpenChange: (
    open: boolean
  ) => void;

  onSuccess: () => void;
}

export function EditBannerImageDialog({
  open,
  image,
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
    } catch {
      toast.error(
        "Failed to update image"
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="bg-white max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Edit Banner Image
          </DialogTitle>

          <DialogDescription>
            Update image
          </DialogDescription>
        </DialogHeader>

        <BannerImageForm
          defaultProductId={
            image.productId
          }
          defaultSortOrder={
            image.sortOrder
          }
          isSubmitting={
            false
          }
          onSubmit={
            handleSubmit
          }
        />
      </DialogContent>
    </Dialog>
  );
}