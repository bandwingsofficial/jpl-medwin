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

  onOpenChange: (
    open: boolean
  ) => void;
}

export function CreateBannerDialog({
  open,
  onOpenChange,
}: Props) {
  const {
    createBanner,
    isSubmitting,
  } =
    useBannerActions();

  async function handleSubmit(
    values: CreateBannerFormData
  ) {
    try {
      await createBanner({
        name: values.name,
        type: values.type,
        images: values.images,
      });

      toast.success(
        "Banner created successfully"
      );

      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.message ||
          "Failed to create banner"
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
      <DialogContent
        className="
          bg-white
          max-w-4xl
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
            Create Banner
          </DialogTitle>

          <DialogDescription>
            Create a new banner with images.
          </DialogDescription>
        </DialogHeader>

        <div
          className="
            max-h-[80vh]
            overflow-y-auto
            px-6
            py-5
          "
        >
          <BannerForm
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