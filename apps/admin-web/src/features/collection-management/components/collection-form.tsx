"use client";

import { useEffect } from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Collection,
} from "@/features/collection-management/types/collection.types";

import {
  createCollectionSchema,
  CreateCollectionFormData,
} from "@/features/collection-management/validations/collection.schema";

import {
  Button,
} from "@/shared/components/ui/button";

import {
  Input,
} from "@/shared/components/ui/input";

import {
  Textarea,
} from "@/shared/components/ui/textarea";

interface Props {
  collection?: Collection;

  isSubmitting: boolean;

  onSubmit: (
    values: CreateCollectionFormData
  ) => Promise<void>;
}

export function CollectionForm({
  collection,
  isSubmitting,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
    },
  } = useForm<CreateCollectionFormData>({
    resolver: zodResolver(
      createCollectionSchema
    ),

    defaultValues: {
      name: "",
      description: "",
      metaDescription: "",
    },
  });

  useEffect(() => {
    if (!collection) {
      return;
    }

    reset({
      name: collection.name,
      description:
        collection.description,
      metaDescription:
        collection.metaDescription,
    });
  }, [collection, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* NAME */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Collection Name
        </label>

        <Input
          placeholder="Enter collection name"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* DESCRIPTION */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Description
        </label>

        <Textarea
          rows={4}
          placeholder="Enter description"
          {...register("description")}
        />

        {errors.description && (
          <p className="text-sm text-red-500">
            {
              errors.description
                .message
            }
          </p>
        )}
      </div>

      {/* META DESCRIPTION */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Meta Description
        </label>

        <Textarea
          rows={3}
          placeholder="Enter meta description"
          {...register(
            "metaDescription"
          )}
        />

        {errors.metaDescription && (
          <p className="text-sm text-red-500">
            {
              errors
                .metaDescription
                .message
            }
          </p>
        )}
      </div>

      {/* IMAGE */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Collection Image
        </label>

        <Input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (file) {
              setValue(
                "image",
                file
              );
            }
          }}
        />
      </div>

      {/* PREVIEW */}

      {collection?.imageUrl && (
        <div>
          <img
            src={collection.imageUrl}
            alt={collection.name}
            className="w-24 h-24 rounded-lg object-cover border"
          />
        </div>
      )}

      {/* SUBMIT */}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Please wait..."
          : collection
          ? "Update Collection"
          : "Create Collection"}
      </Button>
    </form>
  );
}