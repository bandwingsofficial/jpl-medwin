"use client";

import { Button } from "@/shared/components/ui/button";

import { useExpireCoins } from "@/features/coin-management/hooks/use-coin-wallet";

export const ExpireCoinsModal =
  () => {
    const {
      mutate,

      isPending,
    } =
      useExpireCoins();

    return (
      <div
        className="
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
          Expire Coins
        </h3>

        <p
          className="
            mt-2
            text-sm
            text-muted-foreground
          "
        >
          Trigger manual coin
          expiration process.
        </p>

        <Button
          onClick={() =>
            mutate()
          }
          disabled={
            isPending
          }
          className="
            mt-4
          "
        >
          {isPending
            ? "Processing..."
            : "Expire Coins"}
        </Button>
      </div>
    );
  };