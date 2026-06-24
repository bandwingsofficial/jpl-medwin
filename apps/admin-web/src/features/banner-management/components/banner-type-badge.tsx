"use client";

import { Badge } from "@/shared/components/ui/badge";

import {
  BannerType,
} from "@/features/banner-management/types/banner.types";

interface Props {
  type: BannerType;
}

export function BannerTypeBadge({
  type,
}: Props) {
  return (
    <Badge>
      {type.replaceAll("_", " ")}
    </Badge>
  );
}