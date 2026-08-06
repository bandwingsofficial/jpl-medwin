"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/components/ui/button";

import { useCreateCampaign } from "@/features/coin-management/hooks/use-coin-campaigns";

const campaignSchema =
  z.object({
    title:
      z.string().min(1),

    description:
      z.string().min(1),

    bonusMultiplier:
      z.number().min(1),

    startsAt:
      z.string().min(1),

    endsAt:
      z.string().min(1),

    isActive:
      z.boolean(),
  });

type CampaignFormValues =
  z.infer<
    typeof campaignSchema
  >;

interface CampaignFormProps {
  onClose: () => void;
}

export const CampaignForm =
  ({
    onClose,
  }: CampaignFormProps) => {
    const {
      register,

      handleSubmit,

      reset,

      formState: {
        errors,
      },
    } =
      useForm<CampaignFormValues>(
        {
          resolver:
            zodResolver(
              campaignSchema
            ),

          defaultValues:
            {
              title: "",

              description:
                "",

              bonusMultiplier:
                1.5,

              startsAt:
                "",

              endsAt: "",

              isActive: true,
            },
        }
      );

    const {
      mutate,
      isPending,
    } =
      useCreateCampaign();

    const onSubmit = (
      values: CampaignFormValues
    ) => {
      mutate(
        {
          ...values,

          startsAt:
            new Date(
              values.startsAt
            ).toISOString(),

          endsAt:
            new Date(
              values.endsAt
            ).toISOString(),
        },

        {
          onSuccess:
            () => {
              reset();

              onClose();
            },
        }
      );
    };

    return (
      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
      >
        <div
          className="
            grid
            grid-cols-1
            gap-4

            md:grid-cols-2
          "
        >
          {/* TITLE */}
          <div>
            <label
              className="
                mb-1
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Campaign Title
            </label>

            <input
              type="text"
              placeholder="Diwali Offer"
              {...register(
                "title"
              )}
              className="
                h-10
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                text-sm
                outline-none
                transition-all
                focus:border-purple-500
              "
            />

            {errors.title && (
              <p
                className="
                  mt-1
                  text-xs
                  text-red-500
                "
              >
                {
                  errors.title
                    .message
                }
              </p>
            )}
          </div>

          {/* MULTIPLIER */}
          <div>
            <label
              className="
                mb-1
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Bonus Multiplier
            </label>

            <input
              type="number"
              step="0.1"
              {...register(
                "bonusMultiplier",
                {
                  valueAsNumber: true,
                }
              )}
              className="
                h-10
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                text-sm
                outline-none
                transition-all
                focus:border-purple-500
              "
            />

            {errors.bonusMultiplier && (
              <p
                className="
                  mt-1
                  text-xs
                  text-red-500
                "
              >
                {
                  errors
                    .bonusMultiplier
                    .message
                }
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label
              className="
                mb-1
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Festival rewards campaign"
              {...register(
                "description"
              )}
              className="
                w-full
                resize-none
                rounded-lg
                border
                border-gray-300
                px-3
                py-2.5
                text-sm
                outline-none
                transition-all
                focus:border-purple-500
              "
            />

            {errors.description && (
              <p
                className="
                  mt-1
                  text-xs
                  text-red-500
                "
              >
                {
                  errors
                    .description
                    .message
                }
              </p>
            )}
          </div>

          {/* START DATE */}
          <div>
            <label
              className="
                mb-1
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Starts At
            </label>

            <input
              type="datetime-local"
              {...register(
                "startsAt"
              )}
              className="
                h-10
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                text-sm
                outline-none
                transition-all
                focus:border-purple-500
              "
            />

            {errors.startsAt && (
              <p
                className="
                  mt-1
                  text-xs
                  text-red-500
                "
              >
                {
                  errors
                    .startsAt
                    .message
                }
              </p>
            )}
          </div>

          {/* END DATE */}
          <div>
            <label
              className="
                mb-1
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Ends At
            </label>

            <input
              type="datetime-local"
              {...register(
                "endsAt"
              )}
              className="
                h-10
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                text-sm
                outline-none
                transition-all
                focus:border-purple-500
              "
            />

            {errors.endsAt && (
              <p
                className="
                  mt-1
                  text-xs
                  text-red-500
                "
              >
                {
                  errors
                    .endsAt
                    .message
                }
              </p>
            )}
          </div>

          {/* ACTIVE */}
          <div
            className="
              flex
              items-center
              gap-3
              pt-7
            "
          >
            <input
              type="checkbox"
              {...register(
                "isActive"
              )}
              className="
                h-4
                w-4
                accent-purple-600
              "
            />

            <label
              className="
                text-sm
                font-medium
                text-gray-700
              "
            >
              Active Campaign
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            mt-5
            flex
            items-center
            justify-end
            gap-2
            border-t
            pt-4
          "
        >
          <Button
            type="button"
            onClick={onClose}
            className="
              h-9
              px-4
            "
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={
              isPending
            }
            className="
              h-9
              px-5
            "
          >
            {isPending
              ? "Creating..."
              : "Create Campaign"}
          </Button>
        </div>
      </form>
    );
  };