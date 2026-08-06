"use client";

import { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Power,
} from "lucide-react";

import {
  Banner,
} from "@/features/banner-management/types/banner.types";

import { Button } from "@/shared/components/ui/button";
import { Loader } from "@/shared/components/ui/loader";
import { EmptyState } from "@/shared/components/ui/empty-state";

import { BannerStatusBadge } from "./banner-status-badge";
import { BannerTypeBadge } from "./banner-type-badge";

interface Props {
  data: Banner[];

  isLoading: boolean;

  onView: (
    banner: Banner
  ) => void;

  onEdit: (
    banner: Banner
  ) => void;

  onDelete: (
    banner: Banner
  ) => void;

  onToggleStatus: (
    banner: Banner
  ) => void;
}

export function BannerTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: Props) {
  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const itemsPerPage = 10;

  if (isLoading) {
    return <Loader />;
  }

  if (!data.length) {
    return (
      <EmptyState title="No banners found" />
    );
  }

  const totalPages =
    Math.ceil(
      data.length /
        itemsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const paginatedData =
    data.slice(
      startIndex,
      startIndex +
        itemsPerPage
    );

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-5 py-3 text-left">
              Name
            </th>

            <th className="px-5 py-3 text-left">
              Type
            </th>

            <th className="px-5 py-3 text-left">
              Status
            </th>

            <th className="px-5 py-3 text-left">
              Created
            </th>

            <th className="px-5 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map(
            (banner) => (
              <tr
                key={banner.id}
                className="border-b"
              >
                <td className="px-5 py-3 font-medium">
                  {banner.name}
                </td>

                <td className="px-5 py-3">
                  <BannerTypeBadge
                    type={
                      banner.type
                    }
                  />
                </td>

                <td className="px-5 py-3">
                  <BannerStatusBadge
                    status={
                      banner.status
                    }
                  />
                </td>

                <td className="px-5 py-3">
                  {new Date(
                    banner.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month:
                        "short",
                      year:
                        "numeric",
                    }
                  )}
                </td>

                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() =>
                        onView(
                          banner
                        )
                      }
                    >
                      <Eye
                        size={
                          14
                        }
                      />
                    </Button>

                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() =>
                        onEdit(
                          banner
                        )
                      }
                    >
                      <Pencil
                        size={
                          14
                        }
                      />
                    </Button>

                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() =>
                        onToggleStatus(
                          banner
                        )
                      }
                    >
                      <Power
                        size={
                          14
                        }
                      />
                    </Button>

                    <Button
                      size="icon"
                      variant="secondary"
                      disabled={
                        banner.status ===
                        "ACTIVE"
                      }
                      onClick={() =>
                        onDelete(
                          banner
                        )
                      }
                    >
                      <Trash2
                        size={
                          14
                        }
                      />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <span className="text-xs">
            Showing{" "}
            {startIndex +
              1}
            {" - "}
            {Math.min(
              startIndex +
                itemsPerPage,
              data.length
            )}
          </span>

          <div className="flex gap-2">
            <Button
              size="icon"
              disabled={
                currentPage ===
                1
              }
              onClick={() =>
                setCurrentPage(
                  (
                    prev
                  ) =>
                    prev -
                    1
                )
              }
            >
              <ChevronLeft
                size={14}
              />
            </Button>

            <Button
              size="icon"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (
                    prev
                  ) =>
                    prev +
                    1
                )
              }
            >
              <ChevronRight
                size={14}
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}