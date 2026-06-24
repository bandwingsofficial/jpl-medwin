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
  BannerImageForm,
} from "./banner-image-form";

import {
  bannerService,
} from "@/features/banner-management/services/banner.service";

interface Props {
  open: boolean;

  bannerId: string;

  onOpenChange: (
    open: boolean
  ) => void;

  onSuccess: () => void;
}

export function AddBannerImageDialog({
  open,
  bannerId,
  onOpenChange,
  onSuccess,
}: Props) {
  async function handleSubmit(
    file: File | undefined,
    productId: string,
    sortOrder: number
  ) {
    if (!file) {
      toast.error(
        "Image is required"
      );

      return;
    }

    try {
      await bannerService.addImage(
        bannerId,
        file,
        productId,
        sortOrder
      );

      toast.success(
        "Image added successfully"
      );

      onSuccess();

      onOpenChange(false);
    } catch {
      toast.error(
        "Failed to add image"
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
            Add Banner Image
          </DialogTitle>

          <DialogDescription>
            Upload new image
          </DialogDescription>
        </DialogHeader>

        <BannerImageForm
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