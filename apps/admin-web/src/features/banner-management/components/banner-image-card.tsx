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

export function BannerImageCard({
  image,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div
      className="
        bg-white
        border
        rounded-xl
        overflow-hidden
      "
    >
      <div className="relative aspect-video">
        <Image
          src={image.imageUrl}
          alt="Banner Image"
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-gray-500">
            Product Id
          </p>

          <p className="text-sm font-medium break-all">
            {image.productId}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Sort Order
          </p>

          <p className="text-sm font-medium">
            {image.sortOrder}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() =>
              onEdit(image)
            }
          >
            <Pencil size={14} />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            onClick={() =>
              onDelete(image)
            }
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}