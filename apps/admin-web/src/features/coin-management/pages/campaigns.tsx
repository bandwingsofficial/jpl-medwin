"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { CampaignForm } from "@/features/coin-management/components/campaign-form";

import { CampaignTable } from "@/features/coin-management/components/campaign-table";

export default function CoinCampaignsPage() {
  const [openForm, setOpenForm] =
    useState(false);

  return (
    <div
      className="
        flex
        flex-col
        gap-5
        p-5
      "
    >
      {/* TOP SECTION */}
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        {/* LEFT */}
        <div>
          <h1
            className="
              text-4xl
              font-bold
              tracking-tight
              text-gray-900
            "
          >
            Campaigns
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Manage promotional campaigns.
          </p>
        </div>

        {/* RIGHT */}
        <Button
          onClick={() =>
            setOpenForm(true)
          }
          className="
            h-10
            rounded-lg
            px-5
            text-sm
            font-medium
          "
        >
          Create Campaign
        </Button>
      </div>

      {/* MODAL */}
      {openForm && (
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
              max-w-6xl
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
                  Create Campaign
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-gray-500
                  "
                >
                  Configure promotional
                  campaign settings.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpenForm(false)
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
            <div
              className="
                p-5
              "
            >
              <CampaignForm
                onClose={() =>
                  setOpenForm(false)
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <CampaignTable />
    </div>
  );
}