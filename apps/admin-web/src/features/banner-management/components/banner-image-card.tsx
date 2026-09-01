"use client";

import Image from "next/image";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import {
  BannerImage,
} from "@/features/banner-management/types/banner.types";

interface Props {
  image: BannerImage;

  onEdit: (
    image: BannerImage
  ) => void;

  onDelete: (
    image: BannerImage
  ) => void;
}

// =========================================
// COMPONENT
// =========================================

export function BannerImageCard({
  image,
  onEdit,
  onDelete,
}: Props) {
  const displayLink =
    image.link ||
    (image.productId
      ? `/products/${image.productId}`
      : "No link");

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-xl
        border
        border-gray-100
        bg-white
        transition-all
        duration-200
        hover:border-gray-200
        hover:shadow-md
      "
    >

      {/* ===================================== */}
      {/* BANNER IMAGE */}
      {/* ===================================== */}

      <div
        className="
          relative
          aspect-video
          overflow-hidden
          bg-gray-50
        "
      >
        <Image
          src={image.imageUrl}
          alt={
            displayLink ||
            "Banner Image"
          }
          fill
          className="
            object-cover
            transition-transform
            duration-300
            group-hover:scale-[1.02]
          "
        />
      </div>

      {/* ===================================== */}
      {/* CONTENT */}
      {/* ===================================== */}

      <div className="p-4">

        {/* LINK */}

        <div className="mb-4">

          <p
            className="
              mb-1
              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              text-gray-400
            "
          >
            Link
          </p>

          <p
            className="
              truncate
              text-sm
              font-semibold
              text-gray-900
            "
            title={displayLink}
          >
            {displayLink}
          </p>

        </div>

        {/* DIVIDER */}

        <div className="mb-3 border-t border-gray-100" />

        {/* SORT + ACTIONS */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >

          {/* SORT ORDER */}

          <div>
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-gray-400
              "
            >
              Sort Order
            </p>

            <span
              className="
                mt-1
                inline-flex
                items-center
                justify-center
                px-2.5
                py-0.5
                rounded-full
                text-xs
                font-bold
                bg-teal-50
                text-teal-700
                border
                border-teal-200
              "
            >
              #{image.sortOrder}
            </span>
          </div>

          {/* ACTIONS */}

          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >

            {/* EDIT */}

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() =>
                onEdit(image)
              }
              className="
                h-8
                w-8
                rounded-lg
                text-gray-500
                hover:bg-teal-50
                hover:text-teal-600
              "
            >
              <Pencil
                className="h-3.5 w-3.5"
              />
            </Button>

            {/* DELETE */}

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() =>
                onDelete(image)
              }
              className="
                h-8
                w-8
                rounded-lg
                text-gray-500
                hover:bg-red-50
                hover:text-red-600
              "
            >
              <Trash2
                className="h-3.5 w-3.5"
              />
            </Button>

          </div>

        </div>

      </div>

    </div>
  );
}