"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Input,
} from "@/shared/components/ui/input";

import {
  Button,
} from "@/shared/components/ui/button";

import {
  Select,
} from "@/shared/components/ui/select";

import {
  Banner,
  CreateBannerImageInput,
} from "@/features/banner-management/types/banner.types";

import {
  BANNER_TYPES,
} from "@/features/banner-management/constants/banner.constants";

import {
  createBannerSchema,
  CreateBannerFormData,
} from "@/features/banner-management/validations/banner.schema";

import {
  BannerImageUploader,
} from "@/features/banner-management/components/banner-image-uploader";

// Import the dimensions guide component
import { BannerDimensionsGuide } from "@/features/banner-management/components/banner-dimensions-guide";

interface Props {
  banner?: Banner;

  isSubmitting: boolean;

  onSubmit: (
    values: CreateBannerFormData
  ) => Promise<void>;
}

export function BannerForm({
  banner,
  isSubmitting,
  onSubmit,
}: Props) {
  const [
    images,
    setImages,
  ] = useState<
    CreateBannerImageInput[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {
      errors,
    },
  } =
    useForm<CreateBannerFormData>({
      resolver:
        zodResolver(
          createBannerSchema
        ),

      defaultValues: {
        name: "",

        type:
          "HOME_BANNER",

        images: [],
      },
    });

  const selectedBannerType =
    watch("type");

  useEffect(() => {
    if (!banner) {
      return;
    }

    reset({
      name: banner.name,

      type: banner.type,

      images: [],
    });
  }, [
    banner,
    reset,
  ]);

  useEffect(() => {
    setValue(
      "images",
      images
    );
  }, [
    images,
    setValue,
  ]);

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-6"
    >
      {/* NAME */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Banner Name
          <span className="text-red-500 ml-1">
            *
          </span>
        </label>

        <Input
          placeholder="Enter banner name"
          {...register(
            "name"
          )}
        />

        {errors.name && (
          <p className="text-sm text-red-500">
            {
              errors.name
                .message
            }
          </p>
        )}
      </div>

      {/* TYPE */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Banner Type
          <span className="text-red-500 ml-1">
            *
          </span>
        </label>

        <Select
          value={
            selectedBannerType
          }
          onChange={(
            event
          ) =>
            setValue(
              "type",
              event.target
                .value as CreateBannerFormData["type"]
            )
          }
        >
          {BANNER_TYPES.map(
            (
              type
            ) => (
              <option
                key={
                  type.value
                }
                value={
                  type.value
                }
              >
                {
                  type.label
                }
              </option>
            )
          )}
        </Select>

        {/* Dynamic Contextual Hint for Banner Dimensions */}
        {selectedBannerType && (
          <BannerDimensionsGuide 
            variant="inline-hint" 
            selectedType={selectedBannerType} 
          />
        )}

        {errors.type && (
          <p className="text-sm text-red-500">
            {
              errors.type
                .message
            }
          </p>
        )}
      </div>

      {/* IMAGES */}

      {!banner && (
        <BannerImageUploader
          bannerType={
            selectedBannerType
          }
          images={images}
          onChange={
            setImages
          }
        />
      )}

      {/* SUBMIT */}

      <Button
        type="submit"
        className="w-full"
        disabled={
          isSubmitting
        }
      >
        {isSubmitting
          ? "Please wait..."
          : banner
          ? "Update Banner"
          : "Create Banner"}
      </Button>
    </form>
  );
}