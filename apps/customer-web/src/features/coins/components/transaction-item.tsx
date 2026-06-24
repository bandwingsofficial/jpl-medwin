"use client";

import { WalletTransaction } from "@/features/coins/types/coins.type";

interface TransactionItemProps {
  transaction: WalletTransaction;
}

export function TransactionItem({
  transaction,
}: TransactionItemProps) {
  const isEarned =
    transaction.type === "EARNED";

  const isRedeemed =
    transaction.type === "REDEEMED";

  const isExpired =
    transaction.type === "EXPIRED";

  return (
    <div
      className="
        flex
        items-start
        justify-between
        rounded-xl
        border
        p-4
      "
    >
      <div>
        <h4
          className="
            text-sm
            font-semibold
            text-black
          "
        >
          {transaction.description}
        </h4>

        <p
          className="
            mt-1
            text-xs
            text-gray-500
          "
        >
          {new Date(
            transaction.createdAt
          ).toLocaleString()}
        </p>

        
      </div>

      <div
        className={`
          text-sm
          font-semibold

          ${
            isEarned
              ? "text-green-600"
              : ""
          }

          ${
            isRedeemed
              ? "text-red-600"
              : ""
          }

          ${
            isExpired
              ? "text-orange-500"
              : ""
          }
        `}
      >
        {isEarned ? "+" : "-"}

        {transaction.coins} Coins
      </div>
    </div>
  );
}