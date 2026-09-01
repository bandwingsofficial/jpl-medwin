"use client";

import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import {
  Collection,
} from "@/features/collection-management/types/collection.types";

import {
  useRestoreCollection,
} from "@/features/collection-management/hooks/use-collections";

interface Props {
  open: boolean;
  collection: Collection | null;
  onOpenChange: (open: boolean) => void;
}

export function RestoreCollectionDialog({
  open,
  collection,
  onOpenChange,
}: Props) {
  const restoreCollection =
    useRestoreCollection();

  async function handleRestore() {
    if (!collection) {
      return;
    }

    try {
      await restoreCollection.mutateAsync(
        collection.id
      );

      toast.success(
        "Collection restored successfully"
      );

      onOpenChange(false);
    } catch (error) {
      const apiError =
        error as {
          message?: string;
        };

      toast.error(
        apiError.message ??
          "Failed to restore collection"
      );
    }
  }

  if (!collection) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Restore Collection
          </DialogTitle>

          <DialogDescription>
            This collection will become
            active again and available
            for product assignments.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border p-4">
          <p className="font-medium">
            {collection.name}
          </p>

          <p className="text-xs text-muted-foreground">
            {collection.slug}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            disabled={
              restoreCollection.isPending
            }
            onClick={handleRestore}
          >
            {restoreCollection.isPending
              ? "Restoring..."
              : "Restore"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}