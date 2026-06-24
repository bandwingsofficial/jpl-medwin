"use client";

import Image from "next/image";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";

import {
  CreateBannerImageInput,
} from "@/features/banner-management/types/banner.types";

import {
  useProduct,
} from "@/features/product-management/hooks/use-product";

import { BannerType } from "@/features/banner-management/types/banner.types";
import { toast } from "sonner";

import {
  validateBannerImage,
} from "@/features/banner-management/utils/banner-image-validator";

interface Props {
  bannerType: BannerType;

  images: CreateBannerImageInput[];

  onChange: (
    images: CreateBannerImageInput[]
  ) => void;
}

export function BannerImageUploader({
  bannerType,
  images,
  onChange,
}: Props) {
  const {
    productsQuery,
  } = useProduct();

  const products =
    productsQuery.data?.data ?? [];

 const handleFileChange = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const files =
    event.target.files;

  if (!files?.length) {
    return;
  }

  const validImages: CreateBannerImageInput[] =
    [];

  for (
    let index = 0;
    index < files.length;
    index++
  ) {
    const file =
      files[index];

    let ruleKey:
      | "HOME_BANNER"
      | "SUB_CATEGORY_BANNER"
      | "PROMOTIONAL_BANNER"
      | "PRODUCT_BANNER"
      | "CATEGORY_BANNER_HORIZONTAL";

    switch (
      bannerType
    ) {
      case "HOME_BANNER":
        ruleKey =
          "HOME_BANNER";
        break;

      case "SUB_CATEGORY_BANNER":
        ruleKey =
          "SUB_CATEGORY_BANNER";
        break;

      case "PROMOTIONAL_BANNER":
        ruleKey =
          "PROMOTIONAL_BANNER";
        break;

      case "PRODUCT_BANNER":
        ruleKey =
          "PRODUCT_BANNER";
        break;

      default:
        ruleKey =
          "CATEGORY_BANNER_HORIZONTAL";
    }

    try {
      const validation =
        await validateBannerImage(
          file,
          ruleKey
        );

      if (
        !validation.isValid
      ) {
        toast.error(
          validation.error ||
            "Invalid image."
        );

        continue;
      }

      validImages.push({
        file,

        productId: "",

        sortOrder:
          images.length +
          validImages.length,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to validate image."
      );

      continue;
    }
  }

  if (
    validImages.length === 0
  ) {
    toast.error(
      "No valid images were uploaded."
    );

    event.target.value =
      "";

    return;
  }

  onChange([
    ...images,
    ...validImages,
  ]);

  toast.success(
    `${validImages.length} image(s) uploaded successfully.`
  );

  event.target.value =
    "";
};
  const updateProduct = (
    index: number,
    value: string
  ) => {
    const updated =
      [...images];

    updated[
      index
    ].productId = value;

    onChange(updated);
  };

  const updateSortOrder = (
    index: number,
    value: number
  ) => {
    const updated =
      [...images];

    updated[
      index
    ].sortOrder = value;

    onChange(updated);
  };

  const removeImage = (
    index: number
  ) => {
    onChange(
      images.filter(
        (
          _,
          currentIndex
        ) =>
          currentIndex !==
          index
      )
    );
  };

  return (
    <div className="space-y-5">

      {/* FILE PICKER */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Banner Images
          <span className="text-red-500 ml-1">
            *
          </span>
        </label>

        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={
            handleFileChange
          }
        />
      </div>

      {/* IMAGE GRID */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-4
        "
      >
        {images.map(
          (
            image,
            index
          ) => (
            <div
              key={index}
              className="
                border
                rounded-xl
                p-3
                space-y-3
                bg-white
              "
            >
              {/* SMALLER IMAGE */}

              <Image
                src={URL.createObjectURL(
                  image.file
                )}
                alt="Banner Preview"
                width={300}
                height={150}
                className="
                  rounded-lg
                  object-cover
                  w-full
                  h-28
                "
              />

              {/* PRODUCT */}

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Product
                  <span className="text-red-500 ml-1">
                    *
                  </span>
                </label>

                <Select
                  value={
                    image.productId
                  }
                  onChange={(
                    e
                  ) =>
                    updateProduct(
                      index,
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Product
                  </option>

                  {products.map(
                    (
                      product
                    ) => (
                      <option
                        key={
                          product.id
                        }
                        value={
                          product.id
                        }
                      >
                        {
                          product.name
                        }
                      </option>
                    )
                  )}
                </Select>
              </div>

              {/* SORT ORDER */}

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Sort Order
                  <span className="text-red-500 ml-1">
                    *
                  </span>
                </label>

                <Input
                  type="number"
                  min={0}
                  value={
                    image.sortOrder
                  }
                  onChange={(
                    e
                  ) =>
                    updateSortOrder(
                      index,
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                />
              </div>

              {/* ACTIONS */}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() =>
                    removeImage(
                      index
                    )
                  }
                >
                  Remove
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  className="flex-1"
                  onClick={() =>
                    document
                      .getElementById(
                        "banner-image-picker"
                      )
                      ?.click()
                  }
                >
                  Add More
                </Button>
              </div>
            </div>
          )
        )}
      </div>

      {/* HIDDEN PICKER FOR ADD MORE */}

      <input
        id="banner-image-picker"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={
          handleFileChange
        }
      />
    </div>
  );
}