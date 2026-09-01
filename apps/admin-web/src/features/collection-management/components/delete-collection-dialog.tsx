"use client";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

import {
  Button,
} from "@/shared/components/ui/button";

import {
  Collection,
} from "@/features/collection-management/types/collection.types";

import {
  useDeleteCollection,
} from "@/features/collection-management/hooks/use-collections";

interface Props {
  open: boolean;

  collection: Collection | null;

  onOpenChange: (
    open: boolean
  ) => void;
}

export function DeleteCollectionDialog({
  open,
  collection,
  onOpenChange,
}: Props) {
  const deleteCollection =
    useDeleteCollection();

  async function handleDelete() {
    if (!collection) {
      return;
    }

    try {
      await deleteCollection.mutateAsync(
        collection.id
      );

      toast.success(
        "Collection deleted successfully"
      );

      onOpenChange(false);

    } catch (error: any) {
      toast.error(
        error?.message ||
          "Failed to delete collection"
      );
    }
  }

  if (!collection) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent
        className="
          bg-white
          max-w-md
          rounded-2xl
          p-0
          overflow-hidden
        "
      >
        <DialogHeader
          className="
            px-6
            py-5
            border-b
          "
        >
          <DialogTitle>
            Delete Collection
          </DialogTitle>

          <DialogDescription>
            This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <div
            className="
              rounded-xl
              border
              bg-slate-50
              p-4
            "
          >
            <p className="font-semibold">
              {collection.name}
            </p>

            <p
              className="
                text-sm
                text-muted-foreground
                mt-1
              "
            >
              {collection.slug}
            </p>
          </div>

          <div
            className="
              flex
              justify-end
              gap-3
              mt-6
            "
          >
            <Button
              variant="secondary"
              onClick={() =>
                onOpenChange(
                  false
                )
              }
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={
                deleteCollection.isPending
              }
              onClick={
                handleDelete
              }
            >
              {deleteCollection.isPending
                ? "Deleting..."
                : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}