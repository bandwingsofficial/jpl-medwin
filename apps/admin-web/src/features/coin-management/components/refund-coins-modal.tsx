"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";

import { Input } from "@/shared/components/ui/input";

import { Label } from "@/shared/components/ui/label";

import { useRefundCoins } from "@/features/coin-management/hooks/use-coin-wallet";

interface Props {
  userId: string;
}

interface FormValues {
  orderId: string;

  coins: number;

  reason: string;
}

export const RefundCoinsModal =
  ({
    userId,
  }: Props) => {
    const {
      register,

      handleSubmit,

      reset,

      watch,

      formState: {
        errors,
      },
    } = useForm<FormValues>();

    const {
      mutate,
      isPending,
    } =
      useRefundCoins();

    const onSubmit = (
      values: FormValues
    ) => {
      mutate(
        {
          userId,

          orderId:
            values.orderId,

          coins: Number(
            values.coins
          ),

          reason:
            values.reason,
        },

        {
          onSuccess:
            () => {
              reset();
            },
        }
      );
    };

    const orderId =
      watch("orderId");

    const coins =
      watch("coins");

    const reason =
      watch("reason");

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
          Refund Coins
        </h3>

        <div
          className="
            flex
            flex-col
            gap-2
          "
        >
          <Label>
            Order ID
          </Label>

          <Input
            placeholder="Enter redeemed order ID"
            {...register(
              "orderId",
              {
                required:
                  "Order ID is required",
              }
            )}
          />

          {errors.orderId && (
            <p className="text-xs text-red-500">
              {errors.orderId.message}
            </p>
          )}
        </div>

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
            placeholder="Enter refundable coins"
            {...register(
              "coins",
              {
                required:
                  "Coins are required",

                min: {
                  value: 1,
                  message:
                    "Coins must be greater than 0",
                },
              }
            )}
          />

          {errors.coins && (
            <p className="text-xs text-red-500">
              {errors.coins.message}
            </p>
          )}
        </div>

        <div
          className="
            flex
            flex-col
            gap-2
          "
        >
          <Label>
            Reason
          </Label>

          <Input
            placeholder="Reason for refund"
            {...register(
              "reason",
              {
                required:
                  "Reason is required",
              }
            )}
          />

          {errors.reason && (
            <p className="text-xs text-red-500">
              {errors.reason.message}
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Refund is allowed only for valid redeemed
          transactions that have not already been refunded.
        </p>

        <Button
          type="submit"
          disabled={
            isPending ||
            !orderId ||
            !coins ||
            !reason
          }
        >
          {isPending
            ? "Processing..."
            : "Refund Coins"}
        </Button>
      </form>
    );
  };