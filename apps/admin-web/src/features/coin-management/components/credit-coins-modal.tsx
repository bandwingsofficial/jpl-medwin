"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";

import { Input } from "@/shared/components/ui/input";

import { Label } from "@/shared/components/ui/label";

import { useCreditCoins } from "@/features/coin-management/hooks/use-coin-wallet";

interface Props {
  userId: string;
}

interface FormValues {
  coins: number;

  description: string;
}

export const CreditCoinsModal =
  ({
    userId,
  }: Props) => {
    const {
      register,

      handleSubmit,

      reset,
    } = useForm<FormValues>();

    const {
      mutate,
      isPending,
    } =
      useCreditCoins();

    const onSubmit = (
      values: FormValues
    ) => {
      mutate(
        {
          userId,

          coins: Number(
            values.coins
          ),

          type: "EARNED",

          sourceType:
            "ADMIN",

          description:
            values.description,
        },

        {
          onSuccess:
            () => {
              reset();
            },
        }
      );
    };

    return (
      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="
          flex
          flex-col
          gap-4
          rounded-lg
          border
          p-5
        "
      >
        <h3
          className="
            text-lg
            font-semibold
          "
        >
          Credit Coins
        </h3>

        <div
          className="
            flex
            flex-col
            gap-2
          "
        >
          <Label>
            Coins
          </Label>

          <Input
            type="number"
            {...register(
              "coins"
            )}
          />
        </div>

        <div
          className="
            flex
            flex-col
            gap-2
          "
        >
          <Label>
            Description
          </Label>

          <Input
            {...register(
              "description"
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={
            isPending
          }
        >
          {isPending
            ? "Processing..."
            : "Credit Coins"}
        </Button>
      </form>
    );
  };