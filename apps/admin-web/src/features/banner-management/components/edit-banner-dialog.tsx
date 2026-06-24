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
  Banner,
} from "@/features/banner-management/types/banner.types";

import {
  BannerForm,
} from "@/features/banner-management/components/banner-form";

import {
  useBannerActions,
} from "@/features/banner-management/hooks/use-banner-actions";

import {
  CreateBannerFormData,
} from "@/features/banner-management/validations/banner.schema";

interface Props {
  open: boolean;

  banner: Banner | null;

  onOpenChange: (
    open: boolean
  ) => void;
}

export function EditBannerDialog({
  open,
  banner,
  onOpenChange,
}: Props) {
  const {
    updateBanner,
    isSubmitting,
  } =
    useBannerActions();

  async function handleSubmit(
    values: CreateBannerFormData
  ) {
    if (!banner) {
      return;
    }

    try {
      await updateBanner(
        banner.id,
        {
          name: values.name,
          type: values.type,
        }
      );

      toast.success(
        "Banner updated successfully"
      );

      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.message ||
          "Failed to update banner"
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
          max-w-2xl
          w-full
          rounded-2xl
          p-0
          overflow-hidden
        "
      >
        <DialogHeader
          className="
            px-6
            py-5
            border-b
          "
        >
          <DialogTitle
            className="
              text-2xl
              font-semibold
            "
          >
            Edit Banner
          </DialogTitle>

          <DialogDescription>
            Update banner details.
          </DialogDescription>
        </DialogHeader>

        <div
          className="
            px-6
            py-5
          "
        >
          <BannerForm
            banner={banner}
            onSubmit={
              handleSubmit
            }
            isSubmitting={
              isSubmitting
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}