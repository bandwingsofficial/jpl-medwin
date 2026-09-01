"use client";

import { useState } from "react";

import { Input } from "@/shared/components/ui/input";

import { Button } from "@/shared/components/ui/button";

interface WalletSearchProps {
  onSearch: (
    userId: string
  ) => void;
}

export const WalletSearch = ({
  onSearch,
}: WalletSearchProps) => {
  const [userId, setUserId] =
    useState("");

  return (
    <div
      className="
        flex
        flex-col
        gap-3

        md:flex-row
      "
    >
      <Input
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) =>
          setUserId(
            e.target.value
          )
        }
      />

      <Button
        onClick={() =>
          onSearch(
            userId.trim()
          )
        }
      >
        Search Wallet
      </Button>
    </div>
  );
};