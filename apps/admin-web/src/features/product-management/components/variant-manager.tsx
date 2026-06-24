"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import {
  Trash2,
  Plus,
  Upload,
  Settings,
  ImageIcon,
} from "lucide-react";

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
}

interface Props {
  variants: VariantData[];

  onChange: (
    variants: VariantData[]
  ) => void;
}

export function VariantManager({
  variants,
  onChange,
}: Props) {

  // =========================================
  // ADD VARIANT
  // =========================================

  const addVariant =
    () => {

      const newVariant: VariantData = {

        id:
          crypto.randomUUID(),

        sku: "",

        name: "",

        purchasePrice: "",

        sellingPrice: "",

        mrp: "",

        quantity: "",

        averageRating: 0,

        reviewCount: 0,

        isWeighted: false,

        warrantyMonths: 0,

        attributes: {},

        existingMainImage: "",

        mainFile: null,

        images: [],
      };

      onChange([
        ...variants,
        newVariant,
      ]);
    };

  // =========================================
  // REMOVE VARIANT
  // =========================================

  const removeVariant =
    (id?: string) => {

      onChange(
        variants.filter(
          (v) =>
            v.id !== id
        )
      );
    };

  // =========================================
  // UPDATE VARIANT
  // =========================================

  const updateVariant =
    (
      id: string | undefined,
      field: keyof VariantData,
      value: any
    ) => {

      onChange(
        variants.map((v) =>
          v.id === id
            ? {
                ...v,
                [field]: value,
              }
            : v
        )
      );
    };

  // =========================================
  // MAIN IMAGE
  // =========================================

  const handleVariantMainImage =
    (
      variantId: string | undefined,
      file: File | null
    ) => {

      updateVariant(
        variantId,
        "mainFile",
        file
      );
    };

  // =========================================
  // GALLERY IMAGES
  // =========================================

  const handleVariantGallery =
    (
      variantId: string | undefined,
      files: File[]
    ) => {

      const variant =
        variants.find(
          (v) =>
            v.id === variantId
        );

      if (!variant) {
        return;
      }

      const existingImages =
        Array.isArray(
          variant.images
        )
          ? variant.images
          : [];

      const mappedFiles =
        files.map(
          (file) => ({
            file,
            isNew: true,
          })
        );

      updateVariant(
        variantId,
        "images",
        [
          ...existingImages,
          ...mappedFiles,
        ]
      );
    };

  // =========================================
  // REMOVE GALLERY IMAGE
  // =========================================

  const removeGalleryImage =
    (
      variantId: string | undefined,
      index: number
    ) => {

      const variant =
        variants.find(
          (v) =>
            v.id === variantId
        );

      if (
        !variant ||
        !variant.images
      ) {

        return;
      }

      const updatedImages =
        [...variant.images];

      const target =
        updatedImages[index];

      if (!target) {
        return;
      }

      // EXISTING IMAGE
      if (target.url) {

        updatedImages[
          index
        ] = {

          ...target,

          isDeleted: true,
        };
      }

      // NEW IMAGE
      else {

        updatedImages.splice(
          index,
          1
        );
      }

      updateVariant(
        variantId,
        "images",
        updatedImages
      );
    };

  return (
    <div
      className="
        bg-white border border-gray-100
        rounded-2xl p-6 shadow-sm
        space-y-4
      "
    >

      {/* HEADER */}

      <div
        className="
          flex items-center justify-between
          border-b pb-3
        "
      >

        <h3
          className="
            text-lg font-bold text-gray-800
          "
        >
          Variants
        </h3>

        <Button
          type="button"
          onClick={addVariant}
          size="sm"
          className="
            bg-purple-600
            hover:bg-purple-700
            text-white gap-2
          "
        >
          <Plus className="h-4 w-4" />
          Add Variant
        </Button>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table
          className="
            w-full text-left border-collapse
          "
        >

          <thead>

            <tr
              className="
                text-[11px]
                font-bold
                text-gray-400
                uppercase
                tracking-wider
                border-b
              "
            >

              <th className="pb-3 pr-2">
                SKU
              </th>

              <th className="pb-3 px-2">
                Variant Name
              </th>

              <th className="pb-3 px-2">
                Purchase Price
              </th>

              <th className="pb-3 px-2">
                Selling Price
              </th>

              <th className="pb-3 px-2">
                MRP
              </th>

              <th className="pb-3 px-2">
                Quantity
              </th>

              <th className="pb-3 px-2">
                Rating
              </th>

              <th className="pb-3 px-2">
                Reviews
              </th>

              <th className="pb-3 px-2">
                Warranty
              </th>

              <th className="pb-3 px-2">
                Attributes
              </th>

              <th className="pb-3 px-2 text-center">
                Main Image
              </th>

              <th className="pb-3 px-2 text-center">
                Gallery
              </th>

              <th className="pb-3 pl-2 text-right">
                Action
              </th>

            </tr>

          </thead>

          <tbody
            className="
              divide-y divide-gray-50
            "
          >

            {variants.length === 0 && (

              <tr>

                <td
                  colSpan={13}
                  className="
                    py-8 text-center
                    text-sm text-gray-400 italic
                  "
                >
                  No variants added yet.
                </td>

              </tr>
            )}

            {variants.map(
              (variant) => {

                const visibleGallery =
                  (
                    variant.images || []
                  ).filter(
                    (img) =>
                      !img.isDeleted
                  );

                return (

                  <tr
                    key={variant.id}
                    className="
                      group hover:bg-gray-50/50
                      transition-colors
                    "
                  >

                    {/* SKU */}

                    <td className="py-3 pr-2 min-w-[140px]">

                      <Input
    type="text"
    className="h-9 text-xs w-full"
    placeholder="Enter SKU"
    value={variant.sku || ""}
    onChange={(e) =>
      updateVariant(
        variant.id,
        "sku",
        e.target.value
      )
    }
  />


                    </td>

                    {/* NAME */}

                    <td className="py-3 px-2 min-w-[180px]">

                      <Input
                        className="h-9 text-xs"
                        placeholder="Enter name"
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "name",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    {/* PURCHASE */}

                    <td className="py-3 px-2 min-w-[130px]">

                      <Input
                        type="number"
                        className="h-9 text-xs"
                        placeholder="0.00"
                        value={
                          variant.purchasePrice
                        }
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "purchasePrice",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    {/* SELLING */}

                    <td className="py-3 px-2 min-w-[130px]">

                      <Input
                        type="number"
                        className="h-9 text-xs"
                        placeholder="0.00"
                        value={
                          variant.sellingPrice
                        }
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "sellingPrice",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    {/* MRP */}

                    <td className="py-3 px-2 min-w-[130px]">

                      <Input
                        type="number"
                        className="h-9 text-xs"
                        placeholder="0.00"
                        value={variant.mrp}
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "mrp",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    {/* QTY */}

                    <td className="py-3 px-2 min-w-[100px]">

                      <Input
                        type="number"
                        className="h-9 text-xs"
                        placeholder="0"
                        value={
                          variant.quantity
                        }
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "quantity",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    {/* RATING */}

                    <td className="py-3 px-2 min-w-[100px]">

                      <Input
                        type="number"
                        className="h-9 text-xs"
                        placeholder="0"
                        value={
                          variant.averageRating
                        }
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "averageRating",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    {/* REVIEW */}

                    <td className="py-3 px-2 min-w-[100px]">

                      <Input
                        type="number"
                        className="h-9 text-xs"
                        placeholder="0"
                        value={
                          variant.reviewCount
                        }
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "reviewCount",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    {/* WARRANTY */}

                    <td className="py-3 px-2 min-w-[130px]">

                      <Input
                        type="number"
                        className="h-9 text-xs"
                        placeholder="0"
                        value={
                          variant.warrantyMonths
                        }
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "warrantyMonths",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    {/* ATTRIBUTES */}

<td className="py-3 px-2 min-w-[250px]">

  <div className="space-y-2">

    {/* ATTRIBUTE INPUT */}

    <Input
      type="text"
      className="h-9 text-xs"
      placeholder="Enter attribute"
      value={
        variant.attributes?.tempAttribute || ""
      }
      onChange={(e) =>
        updateVariant(
          variant.id,
          "attributes",
          {
            ...variant.attributes,
            tempAttribute:
              e.target.value,
          }
        )
      }
    />

    {/* ADD BUTTON */}

    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="
        h-9 text-[10px]
        gap-1 whitespace-nowrap
      "
      onClick={() => {

        const tempValue =
          variant.attributes
            ?.tempAttribute;

        if (
          !tempValue ||
          !tempValue.trim()
        ) {
          return;
        }

        const existingItems =
          Array.isArray(
            variant.attributes
              ?.items
          )
            ? variant.attributes
                ?.items
            : [];

        updateVariant(
          variant.id,
          "attributes",
          {
            ...variant.attributes,

            items: [
              ...existingItems,
              tempValue,
            ],

            tempAttribute: "",
          }
        );
      }}
    >
      Add Attributes
    </Button>

    {/* ATTRIBUTE LIST */}

    <div className="flex flex-wrap gap-2">

      {Array.isArray(
        variant.attributes?.items
      ) &&
        variant.attributes.items.map(
          (
            attr: string,
            index: number
          ) => (

            <div
              key={index}
              className="
                flex items-center gap-1
                bg-gray-100
                px-2 py-1 rounded-md
                text-[11px]
              "
            >

              <span>{attr}</span>

              <button
                type="button"
                onClick={() => {

                 const updated =
  (
    variant.attributes?.items || []
  ).filter(
    (
      _: string,
      i: number
    ) =>
      i !== index
  );
                  updateVariant(
                    variant.id,
                    "attributes",
                    {
                      ...variant.attributes,
                      items: updated,
                    }
                  );
                }}
                className="
                  text-red-500
                  hover:text-red-700
                "
              >
                ×
              </button>

            </div>
          )
        )}

    </div>

  </div>

</td>

                    {/* MAIN IMAGE */}

                    <td className="py-3 px-2 text-center">

                      <div className="space-y-2">

                        {(variant.mainFile ||
                          variant.existingMainImage) && (

                          <img
                            src={
                              variant.mainFile
                                ? URL.createObjectURL(
                                    variant.mainFile
                                  )
                                : variant.existingMainImage
                            }
                            className="
                              w-14 h-14
                              rounded-lg object-cover
                              border mx-auto
                            "
                          />
                        )}

                        <div className="relative inline-block">

                          <input
                            type="file"
                            className="
                              absolute inset-0
                              opacity-0 cursor-pointer
                            "
                            accept="image/*"
                            onChange={(e) =>
                              handleVariantMainImage(
                                variant.id,
                                e.target
                                  .files?.[0] ||
                                  null
                              )
                            }
                          />

                          <div
                            className="
                              p-2 rounded-md border
                              bg-white border-gray-200
                              text-gray-400
                            "
                          >
                            <Upload className="h-4 w-4" />
                          </div>

                        </div>

                      </div>

                    </td>

                    {/* GALLERY */}

                    <td className="py-3 px-2">

                      <div className="space-y-2">

                        <div className="flex gap-2 flex-wrap">

                          {visibleGallery.map(
                            (
                              image,
                              index
                            ) => (

                              <div
                                key={index}
                                className="
                                  relative group
                                "
                              >

                                <img
                                  src={
                                    image.url
                                      ? image.url
                                      : URL.createObjectURL(
                                          image.file as File
                                        )
                                  }
                                  className="
                                    w-12 h-12
                                    rounded-md
                                    object-cover border
                                  "
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeGalleryImage(
                                      variant.id,
                                      index
                                    )
                                  }
                                  className="
                                    absolute -top-1 -right-1
                                    bg-red-500 text-white
                                    rounded-full p-1
                                    opacity-0
                                    group-hover:opacity-100
                                  "
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>

                              </div>
                            )
                          )}

                        </div>

                        <div className="relative inline-block">

                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="
                              absolute inset-0
                              opacity-0 cursor-pointer
                            "
                            onChange={(e) =>
                              handleVariantGallery(
                                variant.id,
                                Array.from(
                                  e.target.files || []
                                )
                              )
                            }
                          />

                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="gap-2"
                          >
                            <ImageIcon className="h-4 w-4" />
                            Gallery
                          </Button>

                        </div>

                      </div>

                    </td>

                    {/* ACTION */}

                    <td className="py-3 pl-2 text-right">

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="
                          text-red-400
                          hover:text-red-600
                          hover:bg-red-50
                        "
                        onClick={() =>
                          removeVariant(
                            variant.id
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}