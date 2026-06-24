"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/components/ui/button";

import { useCreateRewardTier } from "@/features/coin-management/hooks/use-coin-tiers";

const tierSchema = z.object({
  name: z.string().min(1),

  description:
    z.string().min(1),

  coinMultiplier:
    z.number().min(1),

  minimumLifetimeSpend:
    z.number().min(0),

  status: z.enum([
    "ACTIVE",
    "INACTIVE",
  ]),
});

type TierFormValues =
  z.infer<
    typeof tierSchema
  >;

const DEFAULT_VALUES: TierFormValues =
  {
    name: "",

    description: "",

    coinMultiplier: 2,

    minimumLifetimeSpend:
      5000,

    status: "ACTIVE",
  };

export const TierForm = () => {
  const [
    open,
    setOpen,
  ] = useState(false);

  const {
    register,

    handleSubmit,

    reset,

    formState: {
      errors,
    },
  } = useForm<TierFormValues>(
    {
      resolver:
        zodResolver(
          tierSchema
        ),

      defaultValues:
        DEFAULT_VALUES,
    }
  );

  const {
    mutate,

    isPending,
  } =
    useCreateRewardTier();

  const onSubmit = (
    values: TierFormValues
  ) => {
    mutate(values, {
      onSuccess: () => {
        reset(
          DEFAULT_VALUES
        );

        setOpen(false);
      },
    });
  };

  return (
    <>
      {/* ACTION */}
      <Button
        onClick={() =>
          setOpen(true)
        }
        className="
          h-9
          rounded-lg
          px-4
          text-sm
        "
      >
        Create Tier
      </Button>

      {/* MODAL */}
      {open && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-start
            justify-center
            overflow-y-auto
            bg-black/40
            p-4
            pt-10
          "
        >
          <div
            className="
              w-full
              max-w-4xl
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >
            {/* HEADER */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                px-5
                py-4
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    font-semibold
                    text-gray-900
                  "
                >
                  Create Reward Tier
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-gray-500
                  "
                >
                  Configure customer
                  reward tier settings.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-md
                  text-gray-500
                  transition-all
                  hover:bg-gray-100
                "
              >
                ✕
              </button>
            </div>

            {/* FORM */}
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
                  px-5
                  py-4

                  md:grid-cols-2
                "
              >
                {/* NAME */}
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
                    Tier Name
                  </label>

                  <input
                    type="text"
                    placeholder="GOLD"
                    {...register(
                      "name"
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

                  {errors.name && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-red-500
                      "
                    >
                      {
                        errors.name
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
                    Coin Multiplier
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    {...register(
                      "coinMultiplier",
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

                  {errors.coinMultiplier && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-red-500
                      "
                    >
                      {
                        errors
                          .coinMultiplier
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
                    placeholder="Gold users earn 2x coins for every successful order."
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

                {/* MINIMUM SPEND */}
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
                    Minimum Lifetime Spend
                  </label>

                  <div
                    className="
                      relative
                    "
                  >
                    <span
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-sm
                        text-gray-500
                      "
                    >
                      ₹
                    </span>

                    <input
                      type="number"
                      {...register(
                        "minimumLifetimeSpend",
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
                        pl-7
                        pr-3
                        text-sm
                        outline-none
                        transition-all
                        focus:border-purple-500
                      "
                    />
                  </div>

                  {errors.minimumLifetimeSpend && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-red-500
                      "
                    >
                      {
                        errors
                          .minimumLifetimeSpend
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* STATUS */}
                <div
                  className="
                    md:col-span-2
                  "
                >
                  <label
                    className="
                      mb-1
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >
                    Status
                  </label>

                  <select
                    {...register(
                      "status"
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
                  >
                    <option value="ACTIVE">
                      ACTIVE
                    </option>

                    <option value="INACTIVE">
                      INACTIVE
                    </option>
                  </select>
                </div>
              </div>

              {/* FOOTER */}
              <div
                className="
                  flex
                  items-center
                  justify-end
                  gap-2
                  border-t
                  px-5
                  py-3
                "
              >
                <Button
                  type="button"
                  onClick={() =>
                    setOpen(false)
                  }
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
                    : "Create Tier"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};