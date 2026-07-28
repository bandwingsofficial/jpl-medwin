"use client";

import { useEffect, useRef, useState } from "react";
import { Brand } from "../types/brand.type";
import {
  useCreateBrand,
  useUpdateBrand,
} from "../hooks/use-brand";
import { brandApi } from "@/infrastructure/api/brand.api";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Loader2 } from "lucide-react";
import { showError, showSuccess } from "@/shared/store/toast.store";

const SKU_PREFIX_PATTERN = /^[A-Za-z0-9]{2,6}$/;

function normalizePrefixInput(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

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
  const [skuPrefix, setSkuPrefix] = useState("");
  const [image, setImage] = useState<File | string>();
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [skuPrefixError, setSkuPrefixError] = useState("");
  const [isCheckingPrefix, setIsCheckingPrefix] = useState(false);

  const prefixManuallyEdited = useRef(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSkuPrefix(initialData.skuPrefix || "");
      setDescription(initialData.description || "");
      setImage(initialData.imageUrl);
      setPreview(initialData.imageUrl);
      prefixManuallyEdited.current = true;
    } else {
      setName("");
      setSkuPrefix("");
      setDescription("");
      setImage(undefined);
      setPreview(null);
      prefixManuallyEdited.current = false;
    }
    setSkuPrefixError("");
    setError("");
  }, [initialData]);

  useEffect(() => {
    if (isEdit || prefixManuallyEdited.current) return;

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setSkuPrefix("");
      setSkuPrefixError("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const result = await brandApi.suggestSkuPrefix(trimmedName);
        if (!prefixManuallyEdited.current) {
          setSkuPrefix(result.skuPrefix);
        }
      } catch {
        // ignore suggest failures while typing
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [name, isEdit]);

  useEffect(() => {
    const normalized = normalizePrefixInput(skuPrefix);

    if (!normalized) {
      setSkuPrefixError("");
      return;
    }

    if (!SKU_PREFIX_PATTERN.test(normalized)) {
      setSkuPrefixError("SKU Prefix must be 2-6 alphanumeric characters");
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingPrefix(true);
      try {
        const result = await brandApi.checkSkuPrefix(
          normalized,
          isEdit ? initialData?.id : undefined,
        );

        if (result.exists) {
          setSkuPrefixError("SKU Prefix already exists.");

          if (!isEdit && !prefixManuallyEdited.current) {
            const suggestion = await brandApi.suggestSkuPrefix(name.trim());
            setSkuPrefix(suggestion.skuPrefix);
          }
        } else {
          setSkuPrefixError("");
        }
      } catch {
        setSkuPrefixError("");
      } finally {
        setIsCheckingPrefix(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [skuPrefix, name, isEdit, initialData?.id]);

  const handleImageChange = (file?: File) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePrefixChange = (value: string) => {
    prefixManuallyEdited.current = true;
    setSkuPrefix(normalizePrefixInput(value));
  };

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!skuPrefix.trim()) return "SKU Prefix is required";
    if (!SKU_PREFIX_PATTERN.test(skuPrefix)) {
      return "SKU Prefix must be 2-6 alphanumeric characters";
    }
    if (skuPrefixError) return skuPrefixError;
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
      skuPrefix,
      image,
      description,
    };

    const onSuccess = () => {
      showSuccess(isEdit ? "Brand updated" : "Brand created");
      onClose();
    };

    const onError = () => {
      showError("Something went wrong");
    };

    if (isEdit) {
      updateMutation.mutate(
        { id: initialData!.id, ...payload },
        { onSuccess, onError },
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
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Brand" : "Create Brand"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {error && (
          <div className="text-sm text-red-500">{error}</div>
        )}

        <div className="space-y-2">
          <Label>Name *</Label>
          <Input
            placeholder="Enter brand name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            SKU Prefix *
            {isCheckingPrefix && (
              <Loader2 size={14} className="animate-spin text-gray-400" />
            )}
          </Label>
          <Input
            placeholder="e.g. DMX"
            value={skuPrefix}
            onChange={(e) => handlePrefixChange(e.target.value)}
            maxLength={6}
            className={skuPrefixError ? "border-red-500" : undefined}
          />
          {skuPrefixError && (
            <p className="text-sm text-red-500">{skuPrefixError}</p>
          )}
          {!isEdit && (
            <p className="text-xs text-gray-500">
              Auto-suggested from brand name. You can edit it before saving.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Image</Label>

          <input
            type="file"
            className="block w-full text-sm border rounded-md p-2 cursor-pointer"
            onChange={(e) =>
              handleImageChange(e.target.files?.[0])
            }
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-20 h-20 rounded-md border object-cover"
            />
          )}
        </div>

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
          disabled={isLoading || !!skuPrefixError || isCheckingPrefix}
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
