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
  useActivateCollection,
  useDeactivateCollection,
} from "@/features/collection-management/hooks/use-collections";

interface Props {
  open: boolean;

  collection: Collection | null;

  onOpenChange: (
    open: boolean
  ) => void;
}

export function ActivateDeactivateCollectionDialog({
  open,
  collection,
  onOpenChange,
}: Props) {
  const activateCollection =
    useActivateCollection();

  const deactivateCollection =
    useDeactivateCollection();

  async function handleSubmit() {
    if (!collection) {
      return;
    }

    try {
      if (
        collection.status === "ACTIVE"
      ) {
        await deactivateCollection.mutateAsync(
          collection.id
        );

        toast.success(
          "Collection deactivated successfully"
        );
      } else {
        await activateCollection.mutateAsync(
          collection.id
        );

        toast.success(
          "Collection activated successfully"
        );
      }

      onOpenChange(false);
    } catch (error) {
      const apiError =
        error as {
          message?: string;
        };

      toast.error(
        apiError.message ??
          "Failed to update collection status"
      );
    }
  }

  const isSubmitting =
    activateCollection.isPending ||
    deactivateCollection.isPending;

  if (!collection) {
    return null;
  }

  const isActive =
    collection.status === "ACTIVE";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isActive
              ? "Deactivate Collection"
              : "Activate Collection"}
          </DialogTitle>

          <DialogDescription>
            {isActive
              ? "This collection will become unavailable."
              : "This collection will become available."}
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
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting
              ? "Please wait..."
              : isActive
              ? "Deactivate"
              : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}