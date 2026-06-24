"use client";

import { useState } from "react";

import {
  BannerImage,
} from "@/features/banner-management/types/banner.types";

import {
  useBanner,
} from "@/features/banner-management/hooks/use-banner";

import {
  BannerDetailPage,
} from "@/features/banner-management/pages/banner-detail-page";

import {
  AddBannerImageDialog,
} from "@/features/banner-management/components/add-banner-image-dialog";

import {
  EditBannerImageDialog,
} from "@/features/banner-management/components/edit-banner-image-dialog";

import {
  DeleteBannerImageDialog,
} from "@/features/banner-management/components/delete-banner-image-dialog";

import { Loader } from "@/shared/components/ui/loader";

import { EmptyState } from "@/shared/components/ui/empty-state";

interface Props {
  bannerId: string;
}

export function BannerDetailContainer({
  bannerId,
}: Props) {
  const {
    banner,
    isLoading,
    refresh,
  } = useBanner(
    bannerId
  );

  const [
    addOpen,
    setAddOpen,
  ] = useState(false);

  const [
    editOpen,
    setEditOpen,
  ] = useState(false);

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    selectedImage,
    setSelectedImage,
  ] =
    useState<BannerImage | null>(
      null
    );

  if (isLoading) {
    return <Loader />;
  }

  if (!banner) {
    return (
      <EmptyState title="Banner not found" />
    );
  }

  return (
    <>
      <BannerDetailPage
        banner={banner}
        onAddImage={() =>
          setAddOpen(true)
        }
        onEditImage={(
          image
        ) => {
          setSelectedImage(
            image
          );

          setEditOpen(true);
        }}
        onDeleteImage={(
          image
        ) => {
          setSelectedImage(
            image
          );

          setDeleteOpen(true);
        }}
      />

      <AddBannerImageDialog
        open={addOpen}
        bannerId={banner.id}
        onSuccess={refresh}
        onOpenChange={
          setAddOpen
        }
      />

      <EditBannerImageDialog
        open={editOpen}
        image={
          selectedImage
        }
        onSuccess={refresh}
        onOpenChange={
          setEditOpen
        }
      />

      <DeleteBannerImageDialog
        open={deleteOpen}
        image={
          selectedImage
        }
        onSuccess={refresh}
        onOpenChange={
          setDeleteOpen
        }
      />
    </>
  );
}