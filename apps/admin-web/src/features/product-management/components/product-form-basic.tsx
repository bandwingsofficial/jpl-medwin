"use client";

import { useMemo } from "react";

import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

import { CategoryBrandSelector } from "./category-brand-selector";

import {
  UploadCloud,
  Trash2,
  ImageIcon,
} from "lucide-react";

import { cn } from "@/shared/lib/cn";

interface Props {
  data: any;

  onChange: (
    field: string,
    value: any
  ) => void;
}

export function ProductFormBasic({
  data,
  onChange,
}: Props) {

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

      <Section title="Basic Information">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Field
            label="Product Name"
            required
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
            label="Product Type"
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
                data.type
              }
              onChange={(e) =>
                onChange(
                  "type",
                  e.target.value
                )
              }
            >
              <option value="SIMPLE">
                SIMPLE
              </option>

              <option value="VARIABLE">
                VARIABLE
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

        <CategoryBrandSelector
          data={data}
          onChange={onChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Field
            label="Short Description"
            required
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
              placeholder="Enter short description"
            />
          </Field>

          <Field
            label="Long Description"
            required
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
            />
          </Field>

        </div>

      </Section>

      {/* ===================================== */}
      {/* MEDIA */}
      {/* ===================================== */}

      <Section title="Media">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
}: any) {

  return (
    <div className="space-y-2">

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

    </div>
  );
}