"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

import { ProductDescriptions } from "@/features/products/types/product.type";

interface ProductFaq {
  question: string;
  answer: string;
}

interface ProductDescriptionProps {
   features?: string[];

  descriptions?: ProductDescriptions;

  packing?: string[];

  directionOfUse?: string[];

  additionalInfo?: string[];

  faq?: ProductFaq[];
}

export function ProductDescription({
  features = [],
  descriptions,
  packing = [],
  directionOfUse = [],
  additionalInfo = [],
  faq = [],
}: ProductDescriptionProps) {
  /*
   |--------------------------------------------------------------------------
   | EXPANSION STATES FOR LISTS (SHOW MORE / SHOW LESS)
   |--------------------------------------------------------------------------
   */
  const [showAllPacking, setShowAllPacking] = useState(false);
  const [showAllDirection, setShowAllDirection] = useState(false);
  const [showAllAdditional, setShowAllAdditional] = useState(false);
  const [showAllFaq, setShowAllFaq] = useState(false);

  /*
   |--------------------------------------------------------------------------
   | FILTER EMPTY VALUES
   |--------------------------------------------------------------------------
   */
const filteredFeatures = features.filter(
  (item) => item?.trim()
);

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
    if (filteredFeatures.length > 0) {
  items.push({
    id: "features",
    label: "Key Features",
  });
}
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
    filteredFeatures,
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
   | REUSABLE LIST WITH 4-6 LIMIT & TOGGLE BUTTON
   |--------------------------------------------------------------------------
   */

  const renderList = (
    items: string[],
    isExpanded: boolean,
    setIsExpanded: (val: boolean | ((prev: boolean) => boolean)) => void
  ) => {
    const limit = 5; // Display 4-6 items initially (set to 5)
    const hasMore = items.length > limit;
    const displayedItems = isExpanded ? items : items.slice(0, limit);

    return (
      <div className="space-y-4">
        <ul className="space-y-3 sm:space-y-4">
          {displayedItems.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="
                flex
                items-start
                gap-2.5
                sm:gap-3
              "
            >
              <CheckCircle2
                className="
                  mt-0.5
                  h-4
                  w-4
                  sm:h-5
                  sm:w-5
                  shrink-0
                  text-emerald-600
                "
              />

              <p
                className="
                  text-xs
                  sm:text-[15px]
                  leading-6
                  sm:leading-7
                  text-gray-700
                "
              >
              {item.replace(/^\d+\.\s*/, "")}
              </p>
            </li>
          ))}
        </ul>

        {hasMore && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="
              flex
              items-center
              gap-1.5
              pt-2
              text-xs
              sm:text-sm
              font-semibold
              text-violet-600
              transition-colors
              hover:text-violet-700
            "
          >
            <span>{isExpanded ? "Show Less" : `View More (${items.length - limit} more)`}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
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
  px-5
  py-4
  sm:px-7
  sm:py-5
  text-sm
  sm:text-base
  font-bold
  tracking-[-0.01em]
  transition-all
  duration-200

  ${
    isActive
      ? "border-violet-600 text-violet-700"
      : "border-transparent text-slate-600 hover:text-slate-900"
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
          px-4
          py-5
          sm:px-6
          sm:py-8

          md:px-8
        "
      >{/* KEY FEATURES */}
{activeTab === "features" && (
  <div className="max-w-4xl">
    {renderList(
      filteredFeatures,
      true,
      () => undefined
    )}
  </div>
)}
        {/* DESCRIPTION */}
        {activeTab ===
          "description" && (
          <div
            className="
              max-w-5xl
              space-y-4
              sm:space-y-6
            "
          >
            <div>
              <div
                className="
                  mt-1
                  space-y-3
                  sm:space-y-1
                  text-xs
                  sm:text-[15px]
                  leading-6
                  sm:leading-8
                  text-gray-700
                "
              >
               {!!descriptions?.short && (
  <div className="flex items-start gap-2.5 sm:gap-3">
    <CheckCircle2
      className="
        mt-0.5
        h-4
        w-4
        shrink-0
        text-emerald-600
        sm:h-5
        sm:w-5
      "
    />

    <p>
      {descriptions.short}
    </p>
  </div>
)}

               {!!descriptions?.long && (
  <div className="flex items-start gap-2.5 sm:gap-3">
    <CheckCircle2
      className="
        mt-0.5
        h-4
        w-4
        shrink-0
        text-emerald-600
        sm:h-5
        sm:w-5
      "
    />

    <div className="whitespace-pre-line">
      {descriptions.long}
    </div>
  </div>
)}
              </div>
            </div>
          </div>
        )}

        {/* PACKING DETAILS */}
        {activeTab === "packing" && (
          <div className="max-w-4xl">
            {renderList(filteredPacking, showAllPacking, setShowAllPacking)}
          </div>
        )}

        {/* DIRECTION OF USE */}
        {activeTab ===
          "direction" && (
          <div className="max-w-4xl">
            {renderList(
              filteredDirection,
              showAllDirection,
              setShowAllDirection
            )}
          </div>
        )}

        {/* ADDITIONAL INFO */}
        {activeTab ===
          "additional" && (
          <div className="max-w-4xl">
            {renderList(
              filteredAdditionalInfo,
              showAllAdditional,
              setShowAllAdditional
            )}
          </div>
        )}

        {/* FAQ */}
        {activeTab === "faq" && (() => {
          const faqLimit = 5;
          const hasMoreFaq = filteredFaq.length > faqLimit;
          const displayedFaq = showAllFaq ? filteredFaq : filteredFaq.slice(0, faqLimit);

          return (
            <div className="max-w-4xl space-y-4 sm:space-y-6">
              <div className="space-y-4 sm:space-y-6">
                {displayedFaq.map(
                  (item, index) => (
                    <div
                      key={`${item.question}-${index}`}
                      className="
                        rounded-xl
                        border
                        border-gray-200
                        p-4
                        sm:p-5
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
                          gap-2.5
                          sm:gap-3
                        "
                      >
                        <HelpCircle
                          className="
                            mt-0.5
                            h-4
                            w-4
                            sm:h-5
                            sm:w-5
                            shrink-0
                            text-violet-600
                          "
                        />

                        <h3
                          className="
                            text-xs
                            sm:text-[15px]
                            font-semibold
                            leading-6
                            sm:leading-7
                            text-gray-900
                          "
                        >
                          {item.question}
                        </h3>
                      </div>

                      {/* ANSWER */}
                      <div
                        className="
                          mt-2.5
                          sm:mt-3
                          flex
                          items-start
                          gap-2.5
                          sm:gap-3
                          pl-6
                          sm:pl-8
                        "
                      >
                        <CheckCircle2
                          className="
                            mt-0.5
                            h-4
                            w-4
                            sm:h-5
                            sm:w-5
                            shrink-0
                            text-emerald-600
                          "
                        />

                        <p
                          className="
                            text-xs
                            sm:text-[15px]
                            leading-6
                            sm:leading-7
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

              {hasMoreFaq && (
                <button
                  type="button"
                  onClick={() => setShowAllFaq((prev) => !prev)}
                  className="
                    flex
                    items-center
                    gap-1.5
                    pt-2
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-violet-600
                    transition-colors
                    hover:text-violet-700
                  "
                >
                  <span>{showAllFaq ? "Show Less" : `View More (${filteredFaq.length - faqLimit} more)`}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showAllFaq ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          );
        })()}
      </div>
    </section>
  );
}