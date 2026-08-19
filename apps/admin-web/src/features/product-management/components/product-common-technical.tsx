"use client";

import {
  ChevronDown,
  ChevronUp,
  Info,
  Package,
} from "lucide-react";

import { useState } from "react";

import {
  ProductCommonDetailsData,
} from "./product-common-details";

// =========================================
// TYPES
// =========================================

interface ProductCommonTechnicalProps {
  product: ProductCommonDetailsData;
}

// =========================================
// SECTION
// =========================================

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Section({
  title,
  icon,
  children,
}: SectionProps) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
          {icon}
        </div>

        <h2 className="text-sm font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

// =========================================
// COMPONENT
// =========================================

export function ProductCommonTechnical({
  product,
}: ProductCommonTechnicalProps) {
  const [openFaq, setOpenFaq] =
    useState<number | null>(null);

  const specifications =
    product.specifications ?? [];

  const faqs =
    product.faq ?? [];

  const variants =
    product.variants ?? [];

  return (
    <div className="space-y-4">

      {/* ===================================== */}
      {/* TECHNICAL + OTHER INFORMATION */}
      {/* ===================================== */}

      <div className="
        grid
        grid-cols-1
        gap-4
        lg:grid-cols-2
        lg:items-start
      ">

        {/* =================================== */}
        {/* LEFT - TECHNICAL SPECIFICATIONS */}
        {/* =================================== */}

        <Section
          title="Technical Specifications"
          icon={
            <Info className="h-3.5 w-3.5" />
          }
        >

          {specifications.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-100">

              {/* TABLE HEADER */}

              <div className="
                grid
                grid-cols-[minmax(120px,0.7fr)_minmax(0,1fr)]
                border-b
                border-gray-100
                bg-gray-50/70
                px-3
                py-2.5
              ">

                <span className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-400
                ">
                  Specification
                </span>

                <span className="
                  text-right
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-400
                ">
                  Value
                </span>

              </div>

              {/* SPECIFICATIONS */}

              {specifications.map(
                (specification, index) => (
                  <div
                    key={`${specification.key}-${index}`}
                    className="
                      grid
                      grid-cols-[minmax(120px,0.7fr)_minmax(0,1fr)]
                      gap-3
                      border-b
                      border-gray-100
                      px-3
                      py-2.5
                      last:border-b-0
                    "
                  >

                    <span className="
                      break-words
                      text-xs
                      font-medium
                      text-gray-500
                    ">
                      {specification.key}
                    </span>

                    <span className="
                      break-words
                      text-right
                      text-xs
                      font-semibold
                      text-gray-800
                    ">
                      {specification.value}
                    </span>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="
              rounded-lg
              bg-gray-50
              px-3
              py-4
              text-center
            ">
              <p className="text-xs text-gray-400">
                No technical specifications available.
              </p>
            </div>
          )}

        </Section>

        {/* =================================== */}
        {/* RIGHT - OTHER INFORMATION */}
        {/* =================================== */}

        <Section
          title="Other Technical Information"
          icon={
            <Package className="h-3.5 w-3.5" />
          }
        >

          <div className="
            overflow-hidden
            rounded-lg
            border
            border-gray-100
          ">

            <InfoRow
              label="Country of Origin"
              value={
                product.countryOfOrigin ||
                "Not available"
              }
            />

            <InfoRow
              label="Currency"
              value={
                product.currency ||
                "INR"
              }
            />

            <InfoRow
              label="Total Variants"
              value={variants.length}
              last
            />

          </div>

        </Section>

      </div>

      {/* ===================================== */}
      {/* FAQ */}
      {/* ===================================== */}

      {faqs.length > 0 && (
        <Section
          title="Frequently Asked Questions"
          icon={
            <Info className="h-3.5 w-3.5" />
          }
        >

          <div className="
            divide-y
            divide-gray-100
            overflow-hidden
            rounded-lg
            border
            border-gray-100
          ">

            {faqs.map(
              (faq, index) => {
                const isOpen =
                  openFaq === index;

                return (
                  <div key={index}>

                    {/* QUESTION */}

                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(
                          isOpen
                            ? null
                            : index
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-4
                        px-3
                        py-3
                        text-left
                        transition-colors
                        hover:bg-gray-50
                      "
                    >

                      <span className="
                        text-xs
                        font-semibold
                        text-gray-800
                      ">
                        {faq.question ||
                          `Question ${index + 1}`}
                      </span>

                      {isOpen ? (
                        <ChevronUp
                          className="
                            h-4
                            w-4
                            shrink-0
                            text-gray-400
                          "
                        />
                      ) : (
                        <ChevronDown
                          className="
                            h-4
                            w-4
                            shrink-0
                            text-gray-400
                          "
                        />
                      )}

                    </button>

                    {/* ANSWER */}

                    {isOpen &&
                      faq.answer && (
                        <div className="
                          border-t
                          border-gray-100
                          bg-gray-50/60
                          px-3
                          py-3
                        ">
                          <p className="
                            text-xs
                            leading-5
                            text-gray-600
                          ">
                            {faq.answer}
                          </p>
                        </div>
                      )}

                  </div>
                );
              }
            )}

          </div>

        </Section>
      )}

    </div>
  );
}

// =========================================
// INFO ROW
// =========================================

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  last?: boolean;
}

function InfoRow({
  label,
  value,
  last = false,
}: InfoRowProps) {
  return (
    <div
      className={
        last
          ? `
            grid
            grid-cols-[130px_minmax(0,1fr)]
            items-start
            gap-3
            px-3
            py-2.5
          `
          : `
            grid
            grid-cols-[130px_minmax(0,1fr)]
            items-start
            gap-3
            border-b
            border-gray-100
            px-3
            py-2.5
          `
      }
    >

      <span className="
        text-xs
        font-medium
        text-gray-500
      ">
        {label}
      </span>

      <div className="
        min-w-0
        text-right
        text-xs
        font-semibold
        text-gray-800
      ">
        {value}
      </div>

    </div>
  );
}