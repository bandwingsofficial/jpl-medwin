"use client";

import {
  Banner,
  BannerImage,
} from "@/features/banner-management/types/banner.types";

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

export function BannerDetailPage({
  banner,
  onAddImage,
  onEditImage,
  onDeleteImage,
}: Props) {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50/50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {banner.name}
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            <BannerStatusBadge
              status={banner.status}
            />

            <BannerTypeBadge
              type={banner.type}
            />
          </div>
        </div>

        <Button
          onClick={onAddImage}
          className="shadow-sm hover:opacity-90 transition-opacity bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2.5 rounded-lg self-start sm:self-center"
        >
          Add Image
        </Button>
      </div>

      {/* METADATA INFO PANEL */}
      <div
        className="
          bg-white
          rounded-xl
          border
          border-gray-200
          shadow-sm
          p-6
        "
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Created On
            </p>

            <p className="text-sm font-medium text-gray-700">
              {new Date(
                banner.createdAt
              ).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Last Updated
            </p>

            <p className="text-sm font-medium text-gray-700">
              {new Date(
                banner.updatedAt
              ).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          </div>
        </div>
      </div>

      {/* BANNER IMAGES GRID CONTAINER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Banner Images
          </h2>
          <span className="text-xs font-medium text-gray-500 bg-gray-200/60 px-2.5 py-1 rounded-full">
            {banner.images?.length || 0} Assets
          </span>
        </div>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >
          {banner.images?.map(
            (image) => (
              <div 
                key={image.id} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
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