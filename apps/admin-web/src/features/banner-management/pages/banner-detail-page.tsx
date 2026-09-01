"use client";

import {
  Banner,
  BannerImage,
} from "@/features/banner-management/types/banner.types";

import Link from "next/link";

import {
  ChevronRight,
  Home,
} from "lucide-react";

import {
  BannerStatusBadge,
} from "@/features/banner-management/components/banner-status-badge";

import {
  BannerTypeBadge,
} from "@/features/banner-management/components/banner-type-badge";

import {
  BannerImageCard,
} from "@/features/banner-management/components/banner-image-card";

import {
  Button,
} from "@/shared/components/ui/button";

// =========================================
// TYPES
// =========================================

interface Props {
  banner: Banner;

  onAddImage: () => void;

  onEditImage: (
    image: BannerImage
  ) => void;

  onDeleteImage: (
    image: BannerImage
  ) => void;
}

// =========================================
// COMPONENT
// =========================================

export function BannerDetailPage({
  banner,
  onAddImage,
  onEditImage,
  onDeleteImage,
}: Props) {
  return (
    <div className="space-y-5">

      {/* ===================================== */}
      {/* BREADCRUMBS */}
      {/* ===================================== */}

      <div className="flex items-center gap-2 text-sm">

        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-1.5
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          <Home className="h-4 w-4" />

          Home
        </Link>

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        <Link
          href="/banners"
          className="
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          Banners
        </Link>

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        <span
          className="
            max-w-[280px]
            truncate
            font-semibold
            text-teal-600
          "
        >
          {banner.name}
        </span>

      </div>

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-gray-100
          bg-white
          px-5
          py-4
          shadow-sm
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        {/* LEFT SIDE */}

        <div className="min-w-0">

          <div className="flex items-center gap-3">

            

            <div className="min-w-0">

              <h1
                className="
                  truncate
                  text-xl
                  font-bold
                  tracking-tight
                  text-gray-900
                  sm:text-2xl
                "
              >
                {banner.name}
              </h1>

              <div
                className="
                  mt-1.5
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >

                <BannerStatusBadge
                  status={banner.status}
                />
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <Button
          onClick={onAddImage}
          className="
            h-10
            shrink-0
            rounded-xl
            bg-teal-600
            px-5
            text-sm
            font-semibold
            text-white
            shadow-sm
            shadow-teal-600/20
            transition-all
            hover:bg-teal-700
            hover:shadow-md
            sm:self-center
          "
        >
          + Add Image
        </Button>

      </div>

      {/* ===================================== */}
      {/* BANNER IMAGES */}
      {/* ===================================== */}

      <div className="space-y-3">

        {/* SECTION HEADER */}

        <div
          className="
            flex
            items-end
            justify-between
            gap-3
          "
        >

          <div>

            <div className="flex items-center gap-2">

              <h2
                className="
                  text-base
                  font-bold
                  tracking-tight
                  text-gray-900
                  sm:text-lg
                "
              >
                Banner Images
              </h2>

              <span
                className="
                  rounded-full
                  bg-teal-50
                  px-2
                  py-0.5
                  text-[10px]
                  font-bold
                  text-teal-700
                "
              >
                {banner.images?.length || 0}
              </span>

            </div>

            <p
              className="
                mt-0.5
                text-xs
                text-gray-400
              "
            >
              Manage images associated with this banner.
            </p>

          </div>

          <span
            className="
              hidden
              rounded-lg
              border
              border-gray-100
              bg-gray-50
              px-2.5
              py-1
              text-[10px]
              font-semibold
              text-gray-500
              sm:inline-flex
            "
          >
            Assets
          </span>

        </div>

        {/* ===================================== */}
        {/* IMAGE GRID */}
        {/* ===================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          {banner.images?.map(
            (image) => (
              <div
                key={image.id}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-gray-200
                  hover:shadow-lg
                "
              >

                <BannerImageCard
                  image={image}
                  onEdit={
                    onEditImage
                  }
                  onDelete={
                    onDeleteImage
                  }
                />

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}