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
  Button,
} from "@/shared/components/ui/button";

import {
  Banner,
} from "@/features/banner-management/types/banner.types";

import {
  useBannerActions,
} from "@/features/banner-management/hooks/use-banner-actions";

interface Props {
  open: boolean;

  banner: Banner | null;

  onOpenChange: (
    open: boolean
  ) => void;
}

export function DeleteBannerDialog({
  open,
  banner,
  onOpenChange,
}: Props) {
  const {
    deleteBanner,
    isSubmitting,
  } =
    useBannerActions();

  async function handleDelete() {
    if (!banner) {
      return;
    }

    try {
      await deleteBanner(
        banner.id
      );

      toast.success(
        "Banner deleted successfully"
      );

      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.message ||
          "Failed to delete banner"
      );
    }
  }

  if (!banner) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent
        className="
          bg-white
          max-w-md
        "
      >
        <DialogHeader>
          <DialogTitle>
            Delete Banner
          </DialogTitle>

          <DialogDescription>
            Are you sure you want
            to delete
            <span className="font-semibold">
              {" "}
              {banner.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4">
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
            loading={
              isSubmitting
            }
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