"use client";

import { useEffect, useState } from "react";
import { Brand } from "../types/brand.type";
import {
  useCreateBrand,
  useUpdateBrand,
} from "../hooks/use-brand";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Loader2 } from "lucide-react";
import { showError, showSuccess } from "@/shared/store/toast.store";

export default function BrandForm({
  initialData,
  onClose,
}: {
  initialData: Brand | null;
  onClose: () => void;
}) {
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();

  const isEdit = !!initialData;
  const isLoading =
    createMutation.isPending || updateMutation.isPending;

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | string>();
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setImage(initialData.imageUrl);
      setPreview(initialData.imageUrl);
    } else {
      setName("");
      setDescription("");
      setImage(undefined);
      setPreview(null);
    }
  }, [initialData]);

  // 🔥 IMAGE PREVIEW
  const handleImageChange = (file?: File) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 🔥 VALIDATION
  const validate = () => {
    if (!name.trim()) return "Name is required";
    return "";
  };

  const handleSubmit = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    const payload = {
      name,
      image,
      description,
    };

    const onSuccess = () => {
  showSuccess(
    isEdit
      ? "Brand updated"
      : "Brand created"
  );

  onClose();
};

const onError = () => {
  showError(
    "Something went wrong"
  );
};
    if (isEdit) {
      updateMutation.mutate(
        { id: initialData!.id, ...payload },
        { onSuccess, onError }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess,
        onError,
      });
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl bg-white rounded-xl shadow-xl">
      
      {/* HEADER */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Brand" : "Create Brand"}
        </h2>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* ERROR MESSAGE */}
        {error && (
          <div className="text-sm text-red-500">{error}</div>
        )}

        {/* NAME */}
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            placeholder="Enter brand name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* IMAGE */}
        <div className="space-y-2">
          <Label>Image</Label>

          <input
            type="file"
            className="block w-full text-sm border rounded-md p-2 cursor-pointer"
            onChange={(e) =>
              handleImageChange(e.target.files?.[0])
            }
          />

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-20 h-20 rounded-md border object-cover"
            />
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <Label>Description</Label>
          <textarea
            className="w-full border rounded-md p-2 text-sm"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 py-4 border-t flex justify-end gap-3">
        <Button
          onClick={onClose}
          disabled={isLoading}
          className="bg-gray-200 text-black hover:bg-gray-300"
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading && (
            <Loader2 size={16} className="animate-spin" />
          )}
          {isLoading
            ? "Saving..."
            : isEdit
            ? "Update"
            : "Create"}
        </Button>
      </div>
    </div>
  );
}