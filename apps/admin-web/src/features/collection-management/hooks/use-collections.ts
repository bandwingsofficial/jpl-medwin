"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { collectionApi } from "@/features/collection-management/api/collection.api";

import {
  CreateCollectionRequest,
  UpdateCollectionRequest,
  AssignProductRequest,
} from "@/features/collection-management/types/collection-request.types";

const COLLECTION_KEY = ["collections"];

// ==================================================
// GET COLLECTIONS
// ==================================================

export function useCollections() {
  return useQuery({
    queryKey: COLLECTION_KEY,
    queryFn: collectionApi.getCollections,
  });
}

// ==================================================
// GET COLLECTION DETAILS
// ==================================================

export function useCollection(id: string) {
  return useQuery({
    queryKey: [...COLLECTION_KEY, id],
    queryFn: () => collectionApi.getCollection(id),
    enabled: Boolean(id),
  });
}

// ==================================================
// CREATE COLLECTION
// ==================================================

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateCollectionRequest
    ) => collectionApi.createCollection(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEY,
      });
    },
  });
}

// ==================================================
// UPDATE COLLECTION
// ==================================================

export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCollectionRequest;
    }) =>
      collectionApi.updateCollection(
        id,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEY,
      });
    },
  });
}

// ==================================================
// ACTIVATE COLLECTION
// ==================================================

export function useActivateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      collectionApi.activateCollection(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEY,
      });
    },
  });
}

// ==================================================
// DEACTIVATE COLLECTION
// ==================================================

export function useDeactivateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      collectionApi.deactivateCollection(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEY,
      });
    },
  });
}

// ==================================================
// DELETE COLLECTION
// ==================================================

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      collectionApi.deleteCollection(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEY,
      });
    },
  });
}

// ==================================================
// RESTORE COLLECTION
// ==================================================

export function useRestoreCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      collectionApi.restoreCollection(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEY,
      });
    },
  });
}

// ==================================================
// ASSIGN PRODUCT
// ==================================================

export function useAssignProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      payload,
    }: {
      collectionId: string;
      payload: AssignProductRequest;
    }) =>
      collectionApi.assignProduct(
        collectionId,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEY,
      });
    },
  });
}

// ==================================================
// REMOVE PRODUCT
// ==================================================

export function useRemoveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      productId,
    }: {
      collectionId: string;
      productId: string;
    }) =>
      collectionApi.removeProduct(
        collectionId,
        productId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEY,
      });
    },
  });
}