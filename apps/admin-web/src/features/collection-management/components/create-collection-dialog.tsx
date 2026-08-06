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
  CollectionForm,
} from "./collection-form";

import {
  useCreateCollection,
} from "@/features/collection-management/hooks/use-collections";

import {
  CreateCollectionFormData,
} from "@/features/collection-management/validations/collection.schema";

interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
}

export function CreateCollectionDialog({
  open,
  onOpenChange,
}: Props) {
  const createCollection =
    useCreateCollection();

  async function handleSubmit(
    values: CreateCollectionFormData
  ) {
    try {
      await createCollection.mutateAsync({
        name: values.name,
        description:
          values.description,
        metaDescription:
          values.metaDescription,
        image: values.image,
      });

      toast.success(
        "Collection created successfully"
      );

      onOpenChange(false);

    } catch (error: any) {
      toast.error(
        error?.message ||
          "Failed to create collection"
      );
    }
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
        {/* Header */}

        <DialogHeader
          className="
            px-6
            py-5
            border-b
          "
        >
          <DialogTitle
            className="
              text-2xl
              font-semibold
            "
          >
            Create Collection
          </DialogTitle>

          <DialogDescription>
            Add a new collection
            for products.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}

        <div
          className="
            max-h-[70vh]
            overflow-y-auto
            px-6
            py-5
          "
        >
          <CollectionForm
            onSubmit={
              handleSubmit
            }
            isSubmitting={
              createCollection.isPending
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}