"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { Loader2 } from "lucide-react";

import {
  showWarning,
} from "@/shared/store/toast.store";

import { useProfile } from "@/features/account/hooks/use-profile";

interface Props {
  onClick: () => Promise<void>;

  disabled?: boolean;

  text?: string;
}

export const RazorpayButton = ({
  onClick,
  disabled = false,
  text = "Proceed to Payment",
}: Props) => {
  /*
   |------------------------------------------------------------------
   | ROUTER
   |------------------------------------------------------------------
   */

  const router = useRouter();

  /*
   |------------------------------------------------------------------
   | PROFILE
   |------------------------------------------------------------------
   */

  const { data, isLoading } =
    useProfile();

  /*
   |------------------------------------------------------------------
   | PROFILE DATA
   |------------------------------------------------------------------
   */

  const profile = data?.data;

  /*
   |------------------------------------------------------------------
   | LOADING
   |------------------------------------------------------------------
   */

  const [loading, setLoading] =
    useState(false);

  /*
   |------------------------------------------------------------------
   | CLICK HANDLER
   |------------------------------------------------------------------
   */

  const handleClick =
    async () => {
      /*
       |--------------------------------------------------------------
       | PREVENT MULTIPLE CLICKS
       |--------------------------------------------------------------
       */

      if (
        loading ||
        disabled ||
        isLoading
      ) {
        return;
      }

      /*
       |--------------------------------------------------------------
       | PROFILE REQUIRED
       |--------------------------------------------------------------
       */

      if (!profile) {
        showWarning(
          "Please complete your profile before proceeding to payment."
        );

        router.push("/account");

        return;
      }

      /*
       |--------------------------------------------------------------
       | VALIDATE REQUIRED FIELDS
       |--------------------------------------------------------------
       */

      if (
        !profile?.name ||
        !profile?.email
      ) {
        showWarning(
          "Please complete your profile details before payment."
        );

        router.push("/account/profile");

        return;
      }

      /*
       |--------------------------------------------------------------
       | PAYMENT
       |--------------------------------------------------------------
       */

      try {
        setLoading(true);

        await onClick();
      } catch (error) {
        console.error(
          "RAZORPAY BUTTON ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={
        loading ||
        disabled ||
        isLoading
      }
      className="
        flex
        h-14
        w-full
        items-center
        justify-center
        rounded-2xl
        bg-teal-600
        text-base
        font-semibold
        text-white
        transition-all
        duration-200
        hover:bg-teal-700
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        text
      )}
    </button>
  );
};