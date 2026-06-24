"use client";

import { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Power,
  Eye,
} from "lucide-react";

import { Collection } from "@/features/collection-management/types/collection.types";

import { Button } from "@/shared/components/ui/button";
import { Loader } from "@/shared/components/ui/loader";
import { EmptyState } from "@/shared/components/ui/empty-state";

import { CollectionStatusBadge } from "./collection-status-badge";

interface Props {
  data: Collection[];

  isLoading: boolean;

  onView: (
    collection: Collection
  ) => void;

  onEdit: (
    collection: Collection
  ) => void;

  onDelete: (
    collection: Collection
  ) => void;

  onToggleStatus: (
    collection: Collection
  ) => void;
}

export function CollectionTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: Props) {
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  if (isLoading) {
    return <Loader />;
  }

  if (!data.length) {
    return (
      <EmptyState title="No collections found" />
    );
  }

  const totalPages = Math.ceil(
    data.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedData = data.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-5 py-3 text-left">
              Image
            </th>

            <th className="px-5 py-3 text-left">
              Name
            </th>

            <th className="px-5 py-3 text-left">
              Slug
            </th>

            <th className="px-5 py-3 text-left">
              Status
            </th>

            <th className="px-5 py-3 text-left">
              Products
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
            (collection) => (
              <tr
                key={collection.id}
                className="border-b"
              >
                <td className="px-5 py-3">
                  <img
                    src={collection.imageUrl}
                    alt={collection.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                </td>

                <td className="px-5 py-3 font-medium">
                  {collection.name}
                </td>

                <td className="px-5 py-3">
                  {collection.slug}
                </td>

                <td className="px-5 py-3">
                  <CollectionStatusBadge
                    status={
                      collection.status
                    }
                  />
                </td>

                <td className="px-5 py-3">
                  {collection.productCount ??
                    0}
                </td>

                <td className="px-5 py-3">
                  {new Date(
                    collection.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() =>
                        onView(
                          collection
                        )
                      }
                    >
                      <Eye size={14} />
                    </Button>

                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() =>
                        onEdit(
                          collection
                        )
                      }
                    >
                      <Pencil
                        size={14}
                      />
                    </Button>

                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() =>
                        onToggleStatus(
                          collection
                        )
                      }
                    >
                      <Power
                        size={14}
                      />
                    </Button>

                    <Button
                      size="icon"
                      variant="secondary"
                      disabled={
                        collection.status ===
                        "ACTIVE"
                      }
                      onClick={() =>
                        onDelete(
                          collection
                        )
                      }
                    >
                      <Trash2
                        size={14}
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
            {startIndex + 1}
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
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    prev - 1
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
                  (prev) =>
                    prev + 1
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