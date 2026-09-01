"use client";

import { useMemo, useEffect } from "react";

import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

import { CategoryBrandSelector } from "./category-brand-selector";

import { getSimpleSkuPlaceholder, createEmptyVariant } from "../utils/product-form.utils";

import {
  UploadCloud,
  Trash2,
  ImageIcon,
  FileText,
  ExternalLink,
} from "lucide-react";

import { cn } from "@/shared/lib/cn";

interface Props {
  data: any;

  onChange: (
    field: string,
    value: any
  ) => void;

  showExtendedSections?: boolean;

  isEditMode?: boolean;

  skuPreviewLoading?: boolean;

  fieldErrors?: Array<{ field: string; message: string }>;
}

export function ProductFormBasic({
  data,
  onChange,
  showExtendedSections = false,
  isEditMode = false,
  skuPreviewLoading = false,
  fieldErrors = [],
}: Props) {

  const fieldError = (field: string) =>
    fieldErrors.find((item) => item.field === field)?.message;

  const simpleVariant = data.variants?.[0] || createEmptyVariant();

  const updateSimpleVariant = (field: string, value: any) => {
    onChange("variants", [
      {
        ...simpleVariant,
        [field]: value,
      },
    ]);
  };

  useEffect(() => {
    if (data.type === "SIMPLE") {
      console.log("[SKU_TRACE] render SKU input value", data.previewSku);
    }
  }, [data.type, data.previewSku]);

  // =========================================
  // MAIN IMAGE PREVIEW
  // =========================================

  const mainImagePreview =
    useMemo(() => {

      // NEW FILE
      if (
        data.mainImage instanceof File
      ) {

        return URL.createObjectURL(
          data.mainImage
        );
      }

      // EXISTING IMAGE
      if (
        data.existingMainImage
      ) {

        return data.existingMainImage;
      }

      return null;

    }, [
      data.mainImage,
      data.existingMainImage,
    ]);

  // =========================================
  // GALLERY PREVIEW
  // =========================================

  const imagePreviews =
    useMemo(() => {

      if (
        !Array.isArray(
          data.images
        )
      ) {

        return [];
      }

      return data.images
        .filter(
          (img: any) =>
            !img?.isDeleted
        )
        .map((image: any) => {

          // EXISTING IMAGE
          if (
            image?.url
          ) {

            return {
              type: "existing",

              preview:
                image.url,

              image,
            };
          }

          // NEW FILE
          if (
            image instanceof File
          ) {

            return {
              type: "new",

              preview:
                URL.createObjectURL(
                  image
                ),

              image,
            };
          }

          // NEW OBJECT FILE
          if (
            image?.file instanceof File
          ) {

            return {
              type: "new",

              preview:
                URL.createObjectURL(
                  image.file
                ),

              image,
            };
          }

          return null;

        })
        .filter(Boolean);

    }, [data.images]);

  // =========================================
  // MAIN IMAGE CHANGE
  // =========================================

  const handleMainImage =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        e.target.files?.[0];

      if (!file) {
        return;
      }

      onChange(
        "mainImage",
        file
      );

      e.target.value = "";
    };

  // =========================================
  // ADDITIONAL IMAGES
  // =========================================

  const handleAdditionalImages =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const files =
        Array.from(
          e.target.files || []
        );

      if (!files.length) {
        return;
      }

      const existingImages =
        Array.isArray(
          data.images
        )
          ? data.images
          : [];

      const mappedFiles =
        files.map(
          (file) => ({
            file,
            isNew: true,
          })
        );

      onChange(
        "images",
        [
          ...existingImages,
          ...mappedFiles,
        ]
      );

      e.target.value = "";
    };

  // =========================================
  // REMOVE GALLERY IMAGE
  // =========================================

  const removeAdditionalImage =
    (
      index: number
    ) => {

      const previews =
        [...imagePreviews];

      const target =
        previews[index];

      if (!target) {
        return;
      }

      const updatedImages =
        [...data.images];

      // EXISTING IMAGE
      if (
        target.type ===
        "existing"
      ) {

        const existingIndex =
          updatedImages.findIndex(
            (img: any) =>
              img?.url ===
              target.image.url
          );

        if (
          existingIndex !== -1
        ) {

          updatedImages[
            existingIndex
          ] = {

            ...updatedImages[
              existingIndex
            ],

            isDeleted: true,
          };
        }
      }

      // NEW FILE
      else {

        const newIndex =
          updatedImages.findIndex(
            (img: any) =>
              img ===
                target.image ||
              img?.file ===
                target.image?.file
          );

        if (
          newIndex !== -1
        ) {

          updatedImages.splice(
            newIndex,
            1
          );
        }
      }

      onChange(
        "images",
        updatedImages
      );
    };

  // =========================================
  // REMOVE MAIN IMAGE
  // =========================================

  const removeMainImage =
    () => {

      onChange(
        "mainImage",
        null
      );

      onChange(
        "existingMainImage",
        ""
      );
    };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="space-y-6">

      {/* ===================================== */}
      {/* BASIC INFORMATION */}
      {/* ===================================== */}

      <Section title="General Information">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Field
            label="Product Name"
            required
            error={fieldError("name")}
          >
            <Input
              value={
                data.name
              }
              onChange={(e) =>
                onChange(
                  "name",
                  e.target.value
                )
              }
              placeholder="Enter product name"
            />
          </Field>

          <Field
            label="Customer Type"
            required
            error={fieldError("customerType")}
          >
            <select
              className="
                flex h-10 w-full rounded-md
                border border-input bg-background
                px-3 py-2 text-sm
                focus:ring-2
                focus:ring-purple-500
                outline-none
              "
              value={data.customerType || ""}
              onChange={(e) =>
                onChange(
                  "customerType",
                  e.target.value
                )
              }
            >
              <option value="">Select Customer Type</option>
              <option value="DOCTOR">Doctor</option>
              <option value="HOSPITAL">Hospital</option>
            </select>
          </Field>
        </div>

        <CategoryBrandSelector
          data={data}
          onChange={onChange}
          fieldErrors={fieldErrors}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Field
            label="Product Type"
            required
            error={fieldError("type")}
          >
            <select
              className="
                flex h-10 w-full rounded-md
                border border-input bg-background
                px-3 py-2 text-sm
                focus:ring-2
                focus:ring-purple-500
                outline-none
              "
              value={
                data.type || ""
              }
              onChange={(e) =>
                onChange(
                  "type",
                  e.target.value
                )
              }
            >
              <option value="">
                Select Product Type
              </option>

              <option value="SIMPLE">
                Non Variant
              </option>

              <option value="VARIABLE">
                Variant
              </option>
            </select>
          </Field>

          <Field
            label="Status"
            required
          >
            <select
              className="
                flex h-10 w-full rounded-md
                border border-input bg-background
                px-3 py-2 text-sm
                focus:ring-2
                focus:ring-purple-500
                outline-none
              "
              value={
                data.status
              }
              onChange={(e) =>
                onChange(
                  "status",
                  e.target.value
                )
              }
            >
              <option value="ACTIVE">
                ACTIVE
              </option>

              <option value="INACTIVE">
                INACTIVE
              </option>
            </select>
          </Field>

        </div>

        {showExtendedSections && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.type === "SIMPLE" && (
              <Field label="SKU">
                <div className="space-y-1">
                  <Input
                    readOnly
                    value={data.previewSku || ""}
                    placeholder={getSimpleSkuPlaceholder(data)}
                    className="bg-gray-50 font-mono h-10"
                  />
                  {!isEditMode && skuPreviewLoading && !data.previewSku && (
                    <p className="text-xs text-gray-500">
                      Generating SKU preview…
                    </p>
                  )}
                  {(data.previewSku || isEditMode) && (
                    <p className="text-xs text-gray-500">
                      Read only — SKU is generated automatically.
                    </p>
                  )}
                </div>
              </Field>
            )}

            <Field
              label="HSN Code"
              className={data.type !== "SIMPLE" ? "lg:col-span-2" : undefined}
              error={fieldError("hsnCode")}
            >
              <Input
                value={data.hsnCode || ""}
                onChange={(e) =>
                  onChange(
                    "hsnCode",
                    e.target.value
                  )
                }
                placeholder="Enter HSN code"
                className="h-10"
              />
            </Field>
          </div>
        )}

        {showExtendedSections && data.type === "SIMPLE" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Field
              label="Selling Price"
              required
              error={fieldError("variants[0].sellingPrice")}
            >
              <Input
                type="number"
                value={simpleVariant.sellingPrice ?? ""}
                onChange={(e) => updateSimpleVariant("sellingPrice", e.target.value)}
                placeholder="Required"
                className="h-10"
              />
            </Field>

            <Field
              label="Purchase Price"
              error={fieldError("variants[0].purchasePrice")}
            >
              <Input
                type="number"
                value={simpleVariant.purchasePrice ?? ""}
                onChange={(e) => updateSimpleVariant("purchasePrice", e.target.value)}
                placeholder="Optional"
                className="h-10"
              />
            </Field>

            <Field
              label="MRP"
              error={fieldError("variants[0].mrp")}
            >
              <Input
                type="number"
                value={simpleVariant.mrp ?? ""}
                onChange={(e) => updateSimpleVariant("mrp", e.target.value)}
                placeholder="Optional"
                className="h-10"
              />
            </Field>

            <Field
              label="Quantity"
              error={fieldError("variants[0].quantity")}
            >
              <Input
                type="number"
                value={simpleVariant.quantity ?? ""}
                onChange={(e) => updateSimpleVariant("quantity", e.target.value)}
                placeholder="Optional"
                className="h-10"
              />
            </Field>
          </div>
        )}

        {showExtendedSections && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Field
            label="Short Description"
          >
            <Input
              value={
                data.shortDescription
              }
              onChange={(e) =>
                onChange(
                  "shortDescription",
                  e.target.value
                )
              }
              placeholder="Enter short description (optional)"
              className="h-10"
            />
          </Field>

          <Field
            label="Long Description"
          >
            <Textarea
              value={
                data.longDescription
              }
              onChange={(e) =>
                onChange(
                  "longDescription",
                  e.target.value
                )
              }
              placeholder="Enter long description"
              rows={3}
              className="min-h-10 resize-y"
            />
          </Field>

        </div>
        )}

      </Section>

      {showExtendedSections && (
      <>
      {/* ===================================== */}
      {/* MEDIA */}
      {/* ===================================== */}

      <Section title="Media">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ================================= */}
          {/* MAIN IMAGE */}
          {/* ================================= */}

          <Field
            label="Main Image"
            required
          >

            <div className="space-y-4">

              <div
                className="
                  border-2 border-dashed border-gray-200
                  rounded-xl p-8
                  flex flex-col items-center justify-center
                  bg-gray-50/50 hover:bg-gray-50
                  transition-colors relative
                  cursor-pointer group overflow-hidden
                "
              >

                <input
                  type="file"
                  accept="image/*"
                  className="
                    absolute inset-0
                    opacity-0 cursor-pointer z-10
                  "
                  onChange={
                    handleMainImage
                  }
                />

                {!mainImagePreview ? (
                  <>
                    <UploadCloud
                      className="
                        h-10 w-10
                        text-gray-400
                        group-hover:text-purple-500
                        mb-2
                      "
                    />

                    <p className="text-sm font-medium text-gray-600">
                      Upload main image
                    </p>

                    <p className="text-xs text-gray-400">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </>
                ) : (

                  <div className="relative w-full">

                    <img
                      src={
                        mainImagePreview
                      }
                      alt="Main Preview"
                      className="
                        w-full h-64
                        object-cover
                        rounded-xl border
                      "
                    />

                    <button
                      type="button"
                      onClick={(e) => {

                        e.stopPropagation();

                        removeMainImage();

                      }}
                      className="
                        absolute top-3 right-3
                        bg-red-500 hover:bg-red-600
                        text-white p-2 rounded-full
                        shadow-lg transition-all
                      "
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>
                )}

              </div>

            </div>

          </Field>

          {/* ================================= */}
          {/* GALLERY */}
          {/* ================================= */}

          <Field
            label="Additional Images"
          >

            <div className="space-y-4">

              <div
                className="
                  border-2 border-dashed border-gray-200
                  rounded-xl p-8
                  flex flex-col items-center justify-center
                  bg-gray-50/50 hover:bg-gray-50
                  transition-colors relative
                  cursor-pointer group
                "
              >

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="
                    absolute inset-0
                    opacity-0 cursor-pointer
                  "
                  onChange={
                    handleAdditionalImages
                  }
                />

                <UploadCloud
                  className="
                    h-10 w-10
                    text-gray-400
                    group-hover:text-purple-500
                    mb-2
                  "
                />

                <p className="text-sm font-medium text-gray-600">
                  Upload multiple images
                </p>

                <p className="text-xs text-gray-400">
                  Up to 20 files allowed
                </p>

                {imagePreviews.length > 0 && (
                  <p className="mt-2 text-xs text-purple-600 font-bold">
                    ✓ {
                      imagePreviews.length
                    } images selected
                  </p>
                )}

              </div>

              {/* PREVIEW */}

              {imagePreviews.length > 0 ? (

                <div
                  className="
                    flex gap-4 overflow-x-auto pb-3
                    scroll-smooth
                  "
                >

                  {imagePreviews.map(
                    (
                      image: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="
                          relative group
                          min-w-[140px]
                          rounded-2xl
                          overflow-hidden
                          border bg-white
                          shadow-sm
                        "
                      >

                        <img
                          src={
                            image.preview
                          }
                          alt={`Preview ${index + 1}`}
                          className="
                            w-full h-32 object-cover
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeAdditionalImage(
                              index
                            )
                          }
                          className="
                            absolute top-2 right-2
                            bg-red-500 hover:bg-red-600
                            text-white
                            p-1.5 rounded-full
                            opacity-0
                            group-hover:opacity-100
                            transition-all
                          "
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                      </div>
                    )
                  )}

                </div>

              ) : (

                <div
                  className="
                    border rounded-xl p-6
                    flex flex-col items-center
                    justify-center text-gray-400
                  "
                >

                  <ImageIcon className="h-8 w-8 mb-2" />

                  <p className="text-sm">
                    No additional images selected
                  </p>

                </div>
              )}

            </div>

          </Field>

        </div>

      </Section>
      </>
      )}

      {/* =========================================
       * PRODUCT CATALOGUE ATTACHMENT
       * ========================================= */}
      <Section title="Product Catalogue / Attachment">
        <div className="space-y-5">
          {/* TOGGLE: Does this product have a catalogue? */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Does this product have a catalogue / attachment?
            </label>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="hasCatalogue"
                  value="false"
                  checked={!data.hasCatalogue}
                  onChange={() => {
                    onChange("hasCatalogue", false);
                    onChange("catalogueFile", null);
                  }}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">No</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="hasCatalogue"
                  value="true"
                  checked={Boolean(data.hasCatalogue)}
                  onChange={() => onChange("hasCatalogue", true)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Yes</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Attach a digital product brochure, manual, spec sheet, or demo video.
            </p>
          </div>

          {/* UPLOAD SECTION (WHEN YES) */}
          {Boolean(data.hasCatalogue) && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              {/* CURRENT / NEW FILE DISPLAY */}
              {(data.catalogueFile || data.catalogueFileName || data.catalogueFileUrl) ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-teal-50/60 border border-teal-200 rounded-xl gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-teal-600 text-white rounded-lg flex-shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {data.catalogueFile instanceof File
                          ? data.catalogueFile.name
                          : (data.catalogueFileName || "Product Catalogue")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {data.catalogueFile instanceof File
                          ? `${(data.catalogueFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload`
                          : data.catalogueFileSize
                          ? `${(data.catalogueFileSize / (1024 * 1024)).toFixed(2)} MB • Uploaded`
                          : "Uploaded catalogue"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                    {data.catalogueFileUrl && !(data.catalogueFile instanceof File) && (
                      <a
                        href={data.catalogueFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-white border border-teal-300 rounded-lg hover:bg-teal-50"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </a>
                    )}

                    <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <UploadCloud className="h-3.5 w-3.5 text-gray-500" />
                      Replace
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.webp,.mp4,.webm"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange("catalogueFile", file);
                            onChange("catalogueFileName", file.name);
                            onChange("catalogueFileType", file.type);
                            onChange("catalogueFileSize", file.size);
                          }
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        onChange("catalogueFile", null);
                        onChange("catalogueFileName", "");
                        onChange("catalogueFileUrl", "");
                        onChange("catalogueFileType", "");
                        onChange("catalogueFileSize", null);
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Remove catalogue file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* UPLOAD DROPZONE */
                <label className="border-2 border-dashed border-gray-200 hover:border-teal-500 hover:bg-teal-50/20 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition text-center group">
                  <div className="p-3 bg-gray-50 group-hover:bg-teal-100/50 rounded-xl mb-3 text-gray-400 group-hover:text-teal-600 transition">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Click to upload catalogue or document
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports PDF, Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx), Text, Images, and Video (.mp4) up to 50MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.webp,.mp4,.webm"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange("catalogueFile", file);
                        onChange("catalogueFileName", file.name);
                        onChange("catalogueFileType", file.type);
                        onChange("catalogueFileSize", file.size);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          )}
        </div>
      </Section>

    </div>
  );
}

function Section({
  title,
  children,
}: any) {

  return (
    <div className="space-y-4">

      <h3 className="text-lg font-bold text-gray-900">
        {title}
      </h3>

      <div
        className="
          bg-white border border-gray-100
          rounded-2xl p-6 shadow-sm
          space-y-6
        "
      >
        {children}
      </div>

    </div>
  );
}

function Field({
  label,
  children,
  required,
  className,
  error,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
  error?: string;
}) {

  return (
    <div className={cn("space-y-2", className)}>

      <label
        className="
          text-sm font-semibold
          text-gray-700
          flex items-center
        "
      >

        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}

      </label>

      {children}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

    </div>
  );
}