"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import {
  Collection,
} from "@/features/collection-management/types/collection.types";

import {
  useCollections,
  useActivateCollection,
  useDeactivateCollection,
} from "@/features/collection-management/hooks/use-collections";

import {
  CollectionTable,
} from "@/features/collection-management/components/collection-table";

import {
  CreateCollectionDialog,
} from "@/features/collection-management/components/create-collection-dialog";
import { useRouter } from "next/navigation";
import {
  EditCollectionDialog,
} from "@/features/collection-management/components/edit-collection-dialog";

import {
  DeleteCollectionDialog,
} from "@/features/collection-management/components/delete-collection-dialog";

export function CollectionPage() {
  const {
    data: collections = [],
    isLoading,
  } = useCollections();

  const activateCollection =
    useActivateCollection();

  const deactivateCollection =
    useDeactivateCollection();

  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);

  const [
    editOpen,
    setEditOpen,
  ] = useState(false);
  const router = useRouter();
  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    selectedCollection,
    setSelectedCollection,
  ] = useState<Collection | null>(
    null
  );

  async function handleToggleStatus(
    collection: Collection
  ) {
    if (
      collection.status === "ACTIVE"
    ) {
      await deactivateCollection.mutateAsync(
        collection.id
      );

      return;
    }

    await activateCollection.mutateAsync(
      collection.id
    );
  }

  function handleEdit(
    collection: Collection
  ) {
    setSelectedCollection(
      collection
    );

    setEditOpen(true);
  }

  function handleDelete(
    collection: Collection
  ) {
    setSelectedCollection(
      collection
    );

    setDeleteOpen(true);
  }

  function handleView(
    collection: Collection
  ) {
    router.push(
  `/collections/${collection.id}`
);}

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="
              animate-text-shine
              bg-gradient-to-r 
              from-[#001f3f] 
              via-[#0d9488] 
              to-[#001f3f] 
              bg-clip-text 
              text-[28px] 
              font-bold 
              text-transparent
            ">
            Collections
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage product collections
          </p>
        </div>

        <Button
          onClick={() =>
            setCreateOpen(true)
          }
        >
          Create Collection
        </Button>
      </div>

      {/* TABLE */}

      <CollectionTable
        data={collections}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={
          handleToggleStatus
        }
      />

      {/* CREATE */}

      <CreateCollectionDialog
        open={createOpen}
        onOpenChange={
          setCreateOpen
        }
      />

      {/* EDIT */}

      <EditCollectionDialog
        open={editOpen}
        collection={
          selectedCollection
        }
        onOpenChange={
          setEditOpen
        }
      />

      {/* DELETE */}

      <DeleteCollectionDialog
        open={deleteOpen}
        collection={
          selectedCollection
        }
        onOpenChange={
          setDeleteOpen
        }
      />
    </div>
  );
}