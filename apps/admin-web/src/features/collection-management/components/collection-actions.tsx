"use client";

import {
  Eye,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import {
  Collection,
} from "@/features/collection-management/types/collection.types";

interface Props {
  collection: Collection;

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

export function CollectionActions({
  collection,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: Props) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        size="icon"
        variant="secondary"
        onClick={() =>
          onView(collection)
        }
      >
        <Eye size={14} />
      </Button>

      <Button
        size="icon"
        variant="secondary"
        onClick={() =>
          onEdit(collection)
        }
      >
        <Pencil size={14} />
      </Button>

      <Button
        size="icon"
        variant="secondary"
        onClick={() =>
          onToggleStatus(collection)
        }
      >
        <Power size={14} />
      </Button>

      <Button
        size="icon"
        variant="secondary"
        disabled={
          collection.status ===
          "ACTIVE"
        }
        onClick={() =>
          onDelete(collection)
        }
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );
}