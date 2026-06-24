"use client";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";

import {
  BannerImage,
} from "@/features/banner-management/types/banner.types";

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

export function DeleteBannerImageDialog({
  open,
  image,
  onOpenChange,
  onSuccess,
}: Props) {
  if (!image) {
    return null;
  }

  async function handleDelete() {
    try {
      await bannerService.deleteImage(
        image.id
      );

      toast.success(
        "Image deleted successfully"
      );

      onSuccess();

      onOpenChange(false);
    } catch {
      toast.error(
        "Failed to delete image"
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
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle>
            Delete Image
          </DialogTitle>

          <DialogDescription>
            Are you sure you want
            to delete this image?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() =>
              onOpenChange(
                false
              )
            }
          >
            Cancel
          </Button>

          <Button
            onClick={
              handleDelete
            }
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}