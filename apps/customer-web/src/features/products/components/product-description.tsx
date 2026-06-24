"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

import { ProductDescriptions } from "@/features/products/types/product.type";

interface ProductFaq {
  question: string;
  answer: string;
}

interface ProductDescriptionProps {
  descriptions?: ProductDescriptions;

  packing?: string[];

  directionOfUse?: string[];

  additionalInfo?: string[];

  faq?: ProductFaq[];
}

export function ProductDescription({
  descriptions,
  packing = [],
  directionOfUse = [],
  additionalInfo = [],
  faq = [],
}: ProductDescriptionProps) {
  /*
   |--------------------------------------------------------------------------
   | FILTER EMPTY VALUES
   |--------------------------------------------------------------------------
   */

  const filteredPacking = packing.filter(
    (item) => item?.trim()
  );

  const filteredDirection =
    directionOfUse.filter((item) =>
      item?.trim()
    );

  const filteredAdditionalInfo =
    additionalInfo.filter((item) =>
      item?.trim()
    );

  const filteredFaq = faq.filter(
    (item) =>
      item?.question?.trim() &&
      item?.answer?.trim()
  );

  /*
   |--------------------------------------------------------------------------
   | CONTENT CHECK
   |--------------------------------------------------------------------------
   */

  const tabs = useMemo(() => {
    const items = [];

    if (descriptions?.short || descriptions?.long) {
      items.push({
        id: "description",
        label: "Description",
      });
    }

    if (filteredPacking.length > 0) {
      items.push({
        id: "packing",
        label: "Packing Details",
      });
    }

    if (filteredDirection.length > 0) {
      items.push({
        id: "direction",
        label: "Direction Of Use",
      });
    }

    if (filteredAdditionalInfo.length > 0) {
      items.push({
        id: "additional",
        label: "Additional Info",
      });
    }

    if (filteredFaq.length > 0) {
      items.push({
        id: "faq",
        label: "FAQ",
      });
    }

    return items;
  }, [
    descriptions,
    filteredPacking,
    filteredDirection,
    filteredAdditionalInfo,
    filteredFaq,
  ]);

  const [activeTab, setActiveTab] =
    useState(
      tabs[0]?.id || "description"
    );

  if (!tabs.length) {
    return null;
  }

  /*
   |--------------------------------------------------------------------------
   | REUSABLE LIST
   |--------------------------------------------------------------------------
   */

  const renderList = (items: string[]) => {
    return (
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="
              flex
              items-start
              gap-3
            "
          >
            <CheckCircle2
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
                text-emerald-600
              "
            />

            <p
              className="
                text-[15px]
                leading-7
                text-gray-700
              "
            >
              {item}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
      "
    >
      {/* TAB HEADER */}
      <div
        className="
          overflow-x-auto
          border-b
          border-gray-200
          bg-gray-50/70
        "
      >
        <div
          className="
            flex
            min-w-max
            items-center
          "
        >
          {tabs.map((tab) => {
            const isActive =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`
                  relative
                  whitespace-nowrap
                  border-b-2
                  px-6
                  py-5
                  text-sm
                  font-semibold
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "border-violet-600 text-violet-700"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div
        className="
          px-6
          py-8

          md:px-8
        "
      >
        {/* DESCRIPTION */}
        {activeTab ===
          "description" && (
          <div
            className="
              max-w-5xl
              space-y-6
            "
          >
            <div>
              <div
                className="
                  mt-1
                  space-y-1
                  text-[15px]
                  leading-8
                  text-gray-700
                "
              >
                {!!descriptions?.short && (
                  <p>
                    {descriptions.short}
                  </p>
                )}

                {!!descriptions?.long && (
                  <div className="whitespace-pre-line">
                    {descriptions.long}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PACKING DETAILS */}
        {activeTab === "packing" && (
          <div className="max-w-4xl">
            {renderList(filteredPacking)}
          </div>
        )}

        {/* DIRECTION OF USE */}
        {activeTab ===
          "direction" && (
          <div className="max-w-4xl">
            {renderList(
              filteredDirection
            )}
          </div>
        )}

        {/* ADDITIONAL INFO */}
        {activeTab ===
          "additional" && (
          <div className="max-w-4xl">
            {renderList(
              filteredAdditionalInfo
            )}
          </div>
        )}

        {/* FAQ */}
        {activeTab === "faq" && (
          <div className="max-w-4xl space-y-6">
            {filteredFaq.map(
              (item, index) => (
                <div
                  key={`${item.question}-${index}`}
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    p-5
                    transition-all
                    duration-200
                    hover:border-violet-200
                    hover:bg-violet-50/30
                  "
                >
                  {/* QUESTION */}
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <HelpCircle
                      className="
                        mt-0.5
                        h-5
                        w-5
                        shrink-0
                        text-violet-600
                      "
                    />

                    <h3
                      className="
                        text-[15px]
                        font-semibold
                        leading-7
                        text-gray-900
                      "
                    >
                      {item.question}
                    </h3>
                  </div>

                  {/* ANSWER */}
                  <div
                    className="
                      mt-3
                      flex
                      items-start
                      gap-3
                      pl-8
                    "
                  >
                    <CheckCircle2
                      className="
                        mt-0.5
                        h-5
                        w-5
                        shrink-0
                        text-emerald-600
                      "
                    />

                    <p
                      className="
                        text-[15px]
                        leading-7
                        text-gray-700
                      "
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}