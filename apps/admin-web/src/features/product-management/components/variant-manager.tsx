"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import {
  Trash2,
  Plus,
  Upload,
  ImageIcon,
  ArrowUp,
  ArrowDown,
  Copy,
} from "lucide-react";

import { createEmptyVariant, getVariantSkuPlaceholder } from "../utils/product-form.utils";
import { getFieldError } from "@/shared/lib/extract-api-error";

type FieldError = { field: string; message: string };

interface VariantImage {
  url?: string;
  file?: File;
  isDeleted?: boolean;
  isNew?: boolean;
}

interface VariantData {
  id?: string;
  sku: string;
  name: string;
  purchasePrice: number | string;
  sellingPrice: number | string;
  mrp: number | string;
  quantity: number | string;
  averageRating?: number | string;
  reviewCount?: number | string;
  isWeighted?: boolean;
  warrantyMonths?: number | string;
  attributes?: Record<string, any>;
  existingMainImage?: string;
  mainFile?: File | null;
  images?: VariantImage[];
  isDeleted?: boolean;
  isPersisted?: boolean;
}

interface Props {
  variants: VariantData[];
  onChange: (variants: VariantData[]) => void;
  isEditMode?: boolean;
  fieldErrors?: FieldError[];
}

export function VariantManager({
  variants,
  onChange,
  isEditMode = false,
  fieldErrors = [],
}: Props) {
  const visibleVariants = variants.filter((variant) => !variant.isDeleted);

  const emitChange = (nextVariants: VariantData[]) => {
    onChange(nextVariants);
  };

  const addVariant = () => {
    emitChange([...variants, createEmptyVariant()]);
  };

  const removeVariant = (id?: string) => {
    if (!id) {
      return;
    }

    const target = variants.find((variant) => variant.id === id);

    if (isEditMode && target?.isPersisted) {
      emitChange(
        variants.map((variant) =>
          variant.id === id
            ? {
                ...variant,
                isDeleted: true,
              }
            : variant,
        ),
      );
      return;
    }

    emitChange(variants.filter((variant) => variant.id !== id));
  };

  const duplicateVariant = (id?: string) => {
    const source = variants.find((variant) => variant.id === id);

    if (!source) {
      return;
    }

    const clone: VariantData = {
      ...source,
      id: crypto.randomUUID(),
      sku: "",
      name: `${source.name} Copy`,
      mainFile: null,
      existingMainImage: "",
      images: [],
      isDeleted: false,
      isPersisted: false,
    };

    emitChange([...variants, clone]);
  };

  const moveVariant = (id: string | undefined, direction: "up" | "down") => {
    const visible = [...visibleVariants];
    const index = visible.findIndex((variant) => variant.id === id);

    if (index === -1) {
      return;
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= visible.length) {
      return;
    }

    [visible[index], visible[swapIndex]] = [visible[swapIndex], visible[index]];

    const deleted = variants.filter((variant) => variant.isDeleted);

    const reordered = [...visible, ...deleted];

    emitChange(reordered);
  };

  const updateVariant = (id: string | undefined, field: keyof VariantData, value: any) => {
    const next = variants.map((variant) =>
      variant.id === id
        ? {
            ...variant,
            [field]: value,
          }
        : variant,
    );

    emitChange(next);
  };

  const handleVariantMainImage = (variantId: string | undefined, file: File | null) => {
    updateVariant(variantId, "mainFile", file);
  };

  const handleVariantGallery = (variantId: string | undefined, files: File[]) => {
    const variant = variants.find((item) => item.id === variantId);

    if (!variant) {
      return;
    }

    const existingImages = Array.isArray(variant.images) ? variant.images : [];
    const mappedFiles = files.map((file) => ({ file, isNew: true }));

    updateVariant(variantId, "images", [...existingImages, ...mappedFiles]);
  };

  const removeGalleryImage = (variantId: string | undefined, index: number) => {
    const variant = variants.find((item) => item.id === variantId);

    if (!variant?.images) {
      return;
    }

    const updatedImages = [...variant.images];
    const target = updatedImages[index];

    if (!target) {
      return;
    }

    if (target.url) {
      updatedImages[index] = { ...target, isDeleted: true };
    } else {
      updatedImages.splice(index, 1);
    }

    updateVariant(variantId, "images", updatedImages);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Variants</h3>
          {getFieldError(fieldErrors, "variants") && (
            <p className="text-xs text-red-500 mt-1">{getFieldError(fieldErrors, "variants")}</p>
          )}
        </div>

        <Button type="button" onClick={addVariant} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
          <Plus className="h-4 w-4" />
          Add Variant
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b">
              <th className="pb-3 pr-2">Order</th>
              <th className="pb-3 pr-2">SKU</th>
              <th className="pb-3 px-2">Variant Name</th>
              <th className="pb-3 px-2">Purchase Price</th>
              <th className="pb-3 px-2">Selling Price</th>
              <th className="pb-3 px-2">MRP</th>
              <th className="pb-3 px-2">Quantity</th>
              <th className="pb-3 px-2 text-center">Main Image</th>
              <th className="pb-3 px-2 text-center">Gallery</th>
              <th className="pb-3 pl-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {visibleVariants.length === 0 && (
              <tr>
                <td colSpan={10} className="py-8 text-center text-sm text-gray-400 italic">
                  No variants added yet.
                </td>
              </tr>
            )}

            {visibleVariants.map((variant, index) => {
              const visibleGallery = (variant.images || []).filter((img) => !img.isDeleted);

              return (
                <tr key={variant.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 pr-2">
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="sm" disabled={index === 0} onClick={() => moveVariant(variant.id, "up")}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={index === visibleVariants.length - 1}
                        onClick={() => moveVariant(variant.id, "down")}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>

                  <td className="py-3 pr-2 min-w-[140px]">
                    <Input
                      readOnly
                      className="h-9 text-xs w-full bg-gray-50 font-mono"
                      placeholder={getVariantSkuPlaceholder(variant)}
                      value={variant.sku || ""}
                    />
                  </td>

                  <td className="py-3 px-2 min-w-[180px]">
                    <Input
                      className={`h-9 text-xs ${getFieldError(fieldErrors, `variants[${index}].name`) ? "border-red-500" : ""}`}
                      placeholder="Enter name"
                      value={variant.name}
                      onChange={(e) => updateVariant(variant.id, "name", e.target.value)}
                    />
                    {getFieldError(fieldErrors, `variants[${index}].name`) && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {getFieldError(fieldErrors, `variants[${index}].name`)}
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-2 min-w-[130px]">
                    <Input
                      type="number"
                      className={`h-9 text-xs ${getFieldError(fieldErrors, `variants[${index}].purchasePrice`) ? "border-red-500" : ""}`}
                      placeholder="Optional"
                      value={variant.purchasePrice}
                      onChange={(e) => updateVariant(variant.id, "purchasePrice", e.target.value)}
                    />
                    {getFieldError(fieldErrors, `variants[${index}].purchasePrice`) && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {getFieldError(fieldErrors, `variants[${index}].purchasePrice`)}
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-2 min-w-[130px]">
                    <Input
                      type="number"
                      className={`h-9 text-xs ${getFieldError(fieldErrors, `variants[${index}].sellingPrice`) ? "border-red-500" : ""}`}
                      placeholder="Required"
                      value={variant.sellingPrice}
                      onChange={(e) => updateVariant(variant.id, "sellingPrice", e.target.value)}
                    />
                    {getFieldError(fieldErrors, `variants[${index}].sellingPrice`) && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {getFieldError(fieldErrors, `variants[${index}].sellingPrice`)}
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-2 min-w-[130px]">
                    <Input
                      type="number"
                      className={`h-9 text-xs ${getFieldError(fieldErrors, `variants[${index}].mrp`) ? "border-red-500" : ""}`}
                      placeholder="Optional"
                      value={variant.mrp}
                      onChange={(e) => updateVariant(variant.id, "mrp", e.target.value)}
                    />
                    {getFieldError(fieldErrors, `variants[${index}].mrp`) && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {getFieldError(fieldErrors, `variants[${index}].mrp`)}
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-2 min-w-[100px]">
                    <Input
                      type="number"
                      className={`h-9 text-xs ${getFieldError(fieldErrors, `variants[${index}].quantity`) ? "border-red-500" : ""}`}
                      placeholder="Optional"
                      value={variant.quantity}
                      onChange={(e) => updateVariant(variant.id, "quantity", e.target.value)}
                    />
                    {getFieldError(fieldErrors, `variants[${index}].quantity`) && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {getFieldError(fieldErrors, `variants[${index}].quantity`)}
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-2 text-center">
                    <div className="space-y-2">
                      {(variant.mainFile || variant.existingMainImage) && (
                        <img
                          src={
                            variant.mainFile
                              ? URL.createObjectURL(variant.mainFile)
                              : variant.existingMainImage
                          }
                          className="w-14 h-14 rounded-lg object-cover border mx-auto"
                          alt={variant.name}
                        />
                      )}

                      <div className="relative inline-block">
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={(e) =>
                            handleVariantMainImage(variant.id, e.target.files?.[0] || null)
                          }
                        />
                        <div className="p-2 rounded-md border bg-white border-gray-200 text-gray-400">
                          <Upload className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-2">
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        {visibleGallery.map((image, imageIndex) => (
                          <div key={imageIndex} className="relative group/image">
                            <img
                              src={
                                image.url
                                  ? image.url
                                  : URL.createObjectURL(image.file as File)
                              }
                              className="w-12 h-12 rounded-md object-cover border"
                              alt=""
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(variant.id, imageIndex)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/image:opacity-100"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="relative inline-block">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) =>
                            handleVariantGallery(variant.id, Array.from(e.target.files || []))
                          }
                        />
                        <Button type="button" variant="secondary" size="sm" className="gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Gallery
                        </Button>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 pl-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => duplicateVariant(variant.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeVariant(variant.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
