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
  Collection,
} from "@/features/collection-management/types/collection.types";

import {
  CollectionForm,
} from "./collection-form";

import {
  useUpdateCollection,
} from "@/features/collection-management/hooks/use-collections";

import {
  CreateCollectionFormData,
} from "@/features/collection-management/validations/collection.schema";

interface Props {
  open: boolean;

  collection: Collection | null;

  onOpenChange: (
    open: boolean
  ) => void;
}

export function EditCollectionDialog({
  open,
  collection,
  onOpenChange,
}: Props) {
  const updateCollection =
    useUpdateCollection();

  async function handleSubmit(
    values: CreateCollectionFormData
  ) {
    if (!collection) {
      return;
    }

    try {
      await updateCollection.mutateAsync({
        id: collection.id,

        payload: {
          name: values.name,
          description:
            values.description,
          metaDescription:
            values.metaDescription,
          image: values.image,
        },
      });

      toast.success(
        "Collection updated successfully"
      );

      onOpenChange(false);

    } catch (error: any) {
      toast.error(
        error?.message ||
          "Failed to update collection"
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
          max-w-2xl
          w-full
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
            Edit Collection
          </DialogTitle>

          <DialogDescription>
            Update collection
            information.
          </DialogDescription>
        </DialogHeader>

        <div
          className="
            max-h-[70vh]
            overflow-y-auto
            px-6
            py-5
          "
        >
          <CollectionForm
            collection={
              collection
            }
            onSubmit={
              handleSubmit
            }
            isSubmitting={
              updateCollection.isPending
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}