"use client";

import { Badge } from "@/shared/components/ui/badge";

import {
  BannerStatus,
} from "@/features/banner-management/types/banner.types";

interface Props {
  status: BannerStatus;
}

export function BannerStatusBadge({
  status,
}: Props) {
  return (
    <Badge
      variant={
        status === "ACTIVE"
          ? "success"
          : "danger"
      }
    >
      {status}
    </Badge>
  );
}