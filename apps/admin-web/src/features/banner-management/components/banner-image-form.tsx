"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

import {
  BannerType,
} from "@/features/banner-management/types/banner.types";

import {
  BANNER_DIMENSIONS,
} from "@/features/banner-management/constants/banner-dimensions.constants";

import {
  validateBannerImage,
} from "@/features/banner-management/utils/banner-image-validator";

interface Props {
  isSubmitting: boolean;

  bannerType: BannerType;

  defaultLink?: string;
  defaultImageUrl?: string;

  defaultProductId?: string;

  defaultSortOrder?: number;
  isEditMode?: boolean;

  onSubmit: (
    file: File | undefined,
    link: string,
    sortOrder: number
  ) => Promise<void>;
}

type BannerDimensionKey =
  keyof typeof BANNER_DIMENSIONS;

export function BannerImageForm({
  isSubmitting,
  bannerType,
  defaultLink = "",
   defaultImageUrl = "",
  defaultProductId = "",
  defaultSortOrder = 0,
  isEditMode = false,
  onSubmit,
}: Props) {
  const [file, setFile] =
    useState<File | undefined>();
 
    const [previewUrl, setPreviewUrl] =
  useState<string>(
    defaultImageUrl
  );

  const [
    link,
    setLink,
  ] = useState(
    defaultLink || (defaultProductId ? `/products/${defaultProductId}` : "")
  );

  const [
    sortOrder,
    setSortOrder,
  ] = useState(
    defaultSortOrder
  );

  const [
    imageError,
    setImageError,
  ] = useState("");

  const [
    imageDimensions,
    setImageDimensions,
  ] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // ============================================================
  // MAP BANNER TYPE TO DIMENSION RULE
  // ============================================================

  const getRuleKey =
    (
      type: BannerType
    ): BannerDimensionKey => {
      switch (type) {
        case "HOME_BANNER":
          return "HOME_BANNER";

        case "CATEGORY_BANNER":
          return "CATEGORY_BANNER_HORIZONTAL";

        case "SUB_CATEGORY_BANNER":
          return "SUB_CATEGORY_BANNER";

        case "PROMOTIONAL_BANNER":
          return "PROMOTIONAL_BANNER";

        case "PRODUCT_BANNER":
          return "PRODUCT_BANNER";

        default:
          return "PRODUCT_BANNER";
      }
    };

  const ruleKey =
    getRuleKey(
      bannerType
    );

  const dimensionRule =
    BANNER_DIMENSIONS[
      ruleKey
    ];

  // ============================================================
  // FILE CHANGE
  // ============================================================

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0];

    // Reset previous state
    setFile(undefined);
    setImageError("");
    setImageDimensions(null);

    if (!selectedFile) {
      return;
    }

    // ==========================================================
    // FILE TYPE
    // ==========================================================

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {
      setImageError(
        "Invalid image format. Please upload JPG, JPEG, PNG, or WEBP."
      );

      event.target.value = "";

      return;
    }

    try {
      // ========================================================
      // GET IMAGE DIMENSIONS
      // ========================================================

      const objectUrl =
        URL.createObjectURL(
          selectedFile
        );

      const image =
        new Image();

      const dimensions =
        await new Promise<{
          width: number;
          height: number;
        }>(
          (
            resolve,
            reject
          ) => {
            image.onload = () => {
              resolve({
                width:
                  image.naturalWidth,
                height:
                  image.naturalHeight,
              });

              URL.revokeObjectURL(
                objectUrl
              );
            };

            image.onerror = () => {
              URL.revokeObjectURL(
                objectUrl
              );

              reject(
                new Error(
                  "Unable to read image dimensions."
                )
              );
            };

            image.src =
              objectUrl;
          }
        );

      setImageDimensions(
        dimensions
      );

      // ========================================================
      // IMPORTANT:
      // USE THE SAME VALIDATOR AS BANNER CREATION
      // ========================================================

      const validation =
        await validateBannerImage(
          selectedFile,
          ruleKey
        );

      if (
        !validation.isValid
      ) {
        setImageError(
          validation.error ||
            `Invalid image size. Required ${dimensionRule.width} × ${dimensionRule.height}px.`
        );

        setFile(undefined);

        event.target.value = "";

        return;
      }

      // ========================================================
      // VALID IMAGE
      // ========================================================
setFile(
  selectedFile
);

setPreviewUrl(
  URL.createObjectURL(
    selectedFile
  )
);

setImageError("");

    } catch (error) {
      console.error(
        "Banner image validation error:",
        error
      );

      setFile(undefined);

      setImageError(
        error instanceof Error
          ? error.message
          : "Unable to validate image."
      );

      event.target.value = "";
    }
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      // --------------------------------------------------------
      // IMAGE
      // --------------------------------------------------------

      if (!file && !isEditMode) {
  setImageError(
    `Please upload a valid image with approximately ${dimensionRule.width} × ${dimensionRule.height}px.`
  );

  return;
}

      // --------------------------------------------------------
      // FINAL VALIDATION BEFORE API
      // --------------------------------------------------------
      // This prevents an invalid image from reaching backend
      // even if state was changed unexpectedly.
      // --------------------------------------------------------

      if (file) {
  const validation =
    await validateBannerImage(
      file,
      ruleKey
    );

  if (
    !validation.isValid
  ) {
    setImageError(
      validation.error ||
        "Invalid banner image."
    );

    setFile(undefined);

    return;
  }
}

      // --------------------------------------------------------
      // SUBMIT
      // --------------------------------------------------------

      await onSubmit(
        file,
        link.trim(),
        sortOrder
      );
    };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <form
      className="space-y-5"
      onSubmit={
        handleSubmit
      }
    >
      {/* ====================================================== */}
      {/* IMAGE */}
      {/* ====================================================== */}

      <div className="space-y-2">
       <label className="text-sm font-medium">
  Image{" "}
  {!isEditMode && (
    <span className="text-red-500">
      *
    </span>
  )}
</label>

        {/* REQUIRED DIMENSION */}

        <div
          className="
            rounded-xl
            border
            border-teal-100
            bg-teal-50/60
            px-3
            py-2.5
          "
        >
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              text-teal-600
            "
          >
            Required Size
          </p>

          <p
            className="
              mt-0.5
              text-sm
              font-semibold
              text-gray-800
            "
          >
            {dimensionRule.width} ×{" "}
            {dimensionRule.height}px
          </p>

          <p
            className="
              mt-0.5
              text-[11px]
              text-gray-500
            "
          >
            Allowed tolerance: ±
            {dimensionRule.tolerance}px
          </p>
        </div>
{/* EXISTING / SELECTED IMAGE PREVIEW */}

{previewUrl && (
  <div className="space-y-2">
    <p className="text-xs font-medium text-gray-600">
      {file
        ? "New Image Preview"
        : "Current Image"}
    </p>

    <div className="overflow-hidden rounded-lg border bg-gray-50">
      <img
        src={previewUrl}
        alt="Banner preview"
        className="block h-auto max-h-64 w-full object-contain"
      />
    </div>
  </div>
)}
        {/* FILE INPUT */}

        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={
            handleFileChange
          }
          disabled={
            isSubmitting
          }
        />
        

        {/* SELECTED IMAGE SIZE */}

        {imageDimensions && (
          <div
            className={`
              rounded-lg
              px-3
              py-2
              text-xs
              ${
                imageError
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-700"
              }
            `}
          >
            Uploaded image:{" "}
            <span className="font-semibold">
              {
                imageDimensions.width
              }{" "}
              ×{" "}
              {
                imageDimensions.height
              }
              px
            </span>
          </div>
        )}

        {/* ERROR */}

        {imageError && (
          <div
            className="
              rounded-lg
              border
              border-red-100
              bg-red-50
              px-3
              py-2.5
            "
          >
            <p className="text-xs text-red-600 whitespace-pre-line">
              {imageError}
            </p>
          </div>
        )}
      </div>

      {/* ====================================================== */}
      {/* LINK */}
      {/* ====================================================== */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Link
        </label>

        <Input
          type="text"
          placeholder="https://example.com or /products/product-slug"
          value={link}
          onChange={(
            event
          ) =>
            setLink(
              event.target.value
            )
          }
          disabled={
            isSubmitting
          }
        />
      </div>

      {/* ====================================================== */}
      {/* SORT ORDER */}
      {/* ====================================================== */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Sort Order Number
        </label>

        <Input
          type="number"
          min={0}
          value={
            sortOrder
          }
          onChange={(
            event
          ) =>
            setSortOrder(
              Number(
                event.target.value
              )
            )
          }
          disabled={
            isSubmitting
          }
        />

        <p className="text-xs text-muted-foreground">
          Sequential display position for this image (e.g., 0 for first, 1 for second). Existing images will shift automatically.
        </p>
      </div>

      {/* ====================================================== */}
      {/* SUBMIT */}
      {/* ====================================================== */}

      <Button
        type="submit"
        loading={
          isSubmitting
        }
        className="w-full"
        disabled={
  (!file && !isEditMode) ||
  !!imageError ||
  isSubmitting
}
      >
        Save Image
      </Button>
    </form>
  );
}