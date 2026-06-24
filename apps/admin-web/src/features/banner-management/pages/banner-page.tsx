"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";

import {
  Banner,
} from "@/features/banner-management/types/banner.types";

import {
  useBanners,
} from "@/features/banner-management/hooks/use-banners";

import {
  useBannerActions,
} from "@/features/banner-management/hooks/use-banner-actions";

import {
  BannerTable,
} from "@/features/banner-management/components/banner-table";

import {
  CreateBannerDialog,
} from "@/features/banner-management/components/create-banner-dialog";

import {
  EditBannerDialog,
} from "@/features/banner-management/components/edit-banner-dialog";

import {
  DeleteBannerDialog,
} from "@/features/banner-management/components/delete-banner-dialog";

export function BannerPage() {
  const {
    banners,
    isLoading,
    refresh,
  } = useBanners();

  const {
    activateBanner,
    deactivateBanner,
  } =
    useBannerActions();

  const router =
    useRouter();

  const [
    createOpen,
    setCreateOpen,
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
    selectedBanner,
    setSelectedBanner,
  ] =
    useState<Banner | null>(
      null
    );

  async function handleToggleStatus(
    banner: Banner
  ) {
    if (
      banner.status ===
      "ACTIVE"
    ) {
      await deactivateBanner(
        banner.id
      );

      refresh();

      return;
    }

    await activateBanner(
      banner.id
    );

    refresh();
  }

  function handleEdit(
    banner: Banner
  ) {
    setSelectedBanner(
      banner
    );

    setEditOpen(true);
  }

  function handleDelete(
    banner: Banner
  ) {
    setSelectedBanner(
      banner
    );

    setDeleteOpen(true);
  }

  function handleView(
    banner: Banner
  ) {
    router.push(
      `/banners/${banner.id}`
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="
              animate-text-shine
              bg-gradient-to-r 
              from-[#001f3f] 
              via-[#0d9488] 
              to-[#001f3f] 
              bg-clip-text 
              text-[28px] 
              font-bold 
              text-transparent
            ">
            Banners
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage platform banners
          </p>
        </div>

        <Button
          onClick={() =>
            setCreateOpen(
              true
            )
          }
        >
          Create Banner
        </Button>
      </div>

      <BannerTable
        data={banners}
        isLoading={
          isLoading
        }
        onView={
          handleView
        }
        onEdit={
          handleEdit
        }
        onDelete={
          handleDelete
        }
        onToggleStatus={
          handleToggleStatus
        }
      />

      <CreateBannerDialog
        open={createOpen}
        onOpenChange={
          setCreateOpen
        }
      />

      <EditBannerDialog
        open={editOpen}
        banner={
          selectedBanner
        }
        onOpenChange={
          setEditOpen
        }
      />

      <DeleteBannerDialog
        open={deleteOpen}
        banner={
          selectedBanner
        }
        onOpenChange={
          setDeleteOpen
        }
      />
    </div>
  );
}