"use client";

import {
  FileText,
  Info,
  Package,
  Tag,
} from "lucide-react";

import {
  ProductCommonDetailsData,
} from "./product-common-details";

// =========================================
// TYPES
// =========================================

interface ProductCommonFeaturesProps {
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

        <div className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-lg
          bg-teal-50
          text-teal-600
        ">
          {icon}
        </div>

        <h2 className="
          text-sm
          font-semibold
          text-gray-900
        ">
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

export function ProductCommonFeatures({
  product,
}: ProductCommonFeaturesProps) {
  const features =
    product.features ?? [];

  const tags =
    product.tags ?? [];

  const displayNotes =
    product.displayNotes ?? [];

  const shortDescription =
    product.descriptions?.short;

  const longDescription =
    product.descriptions?.long;

  const hasDescription =
    Boolean(
      shortDescription ||
      longDescription
    );

  return (
    <div className="space-y-4">

      {/* ===================================== */}
      {/* FEATURES */}
      {/* ===================================== */}

      {features.length > 0 && (
        <Section
          title="Features"
          icon={
            <Info className="h-3.5 w-3.5" />
          }
        >

          <div className="
            grid
            grid-cols-1
            gap-2
            sm:grid-cols-2
          ">

            {features.map(
              (feature, index) => (
                <div
                  key={`${feature}-${index}`}
                  className="
                    rounded-lg
                    border
                    border-gray-100
                    bg-gray-50/60
                    px-3
                    py-2.5
                  "
                >
                  <p className="
                    text-xs
                    leading-5
                    text-gray-700
                  ">
                    {feature}
                  </p>
                </div>
              )
            )}

          </div>

        </Section>
      )}

      {/* ===================================== */}
      {/* TAGS */}
      {/* ===================================== */}

      {tags.length > 0 && (
        <Section
          title="Tags"
          icon={
            <Tag className="h-3.5 w-3.5" />
          }
        >

          <div className="flex flex-wrap gap-2">

            {tags.map(
              (tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="
                    rounded-md
                    bg-teal-50
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-teal-700
                  "
                >
                  {tag}
                </span>
              )
            )}

          </div>

        </Section>
      )}

      {/* ===================================== */}
      {/* DISPLAY NOTES */}
      {/* ===================================== */}

      {displayNotes.length > 0 && (
        <Section
          title="Display Notes"
          icon={
            <FileText className="h-3.5 w-3.5" />
          }
        >

          <div className="space-y-2">

            {displayNotes.map(
              (note, index) => (
                <div
                  key={`${note}-${index}`}
                  className="
                    rounded-lg
                    bg-amber-50
                    px-3
                    py-2.5
                  "
                >
                  <p className="
                    text-xs
                    leading-5
                    text-amber-800
                  ">
                    {note}
                  </p>
                </div>
              )
            )}

          </div>

        </Section>
      )}

      {/* ===================================== */}
      {/* DESCRIPTION + DIRECTION OF USE */}
      {/* ===================================== */}

      {(hasDescription ||
        product.directionOfUse) && (

        <div className="
          grid
          grid-cols-1
          gap-4
          lg:grid-cols-2
          lg:items-start
        ">

          {/* ================================= */}
          {/* DESCRIPTION - LEFT */}
          {/* ================================= */}

          {hasDescription && (
            <Section
              title="Description"
              icon={
                <FileText className="h-3.5 w-3.5" />
              }
            >

              <div className="space-y-4">

                {shortDescription && (
                  <div>

                    <p className="
                      mb-1
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-400
                    ">
                      Short Description
                    </p>

                    <p className="
                      text-xs
                      leading-5
                      text-gray-600
                    ">
                      {shortDescription}
                    </p>

                  </div>
                )}

                {longDescription && (
                  <div>

                    <p className="
                      mb-1
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-400
                    ">
                      Long Description
                    </p>

                    <p className="
                      whitespace-pre-line
                      text-xs
                      leading-5
                      text-gray-600
                    ">
                      {longDescription}
                    </p>

                  </div>
                )}

              </div>

            </Section>
          )}

          {/* ================================= */}
          {/* DIRECTION OF USE - RIGHT */}
          {/* ================================= */}

          {product.directionOfUse && (
            <Section
              title="Direction of Use"
              icon={
                <Info className="h-3.5 w-3.5" />
              }
            >

              <p className="
                whitespace-pre-line
                text-xs
                leading-5
                text-gray-600
              ">
                {product.directionOfUse}
              </p>

            </Section>
          )}

        </div>
      )}

      {/* ===================================== */}
      {/* PACKING + ADDITIONAL INFORMATION */}
      {/* ===================================== */}

      {(product.packing ||
        product.additionalInfo) && (

        <div className="
          grid
          grid-cols-1
          gap-4
          lg:grid-cols-2
          lg:items-start
        ">

          {/* ================================= */}
          {/* PACKING - LEFT */}
          {/* ================================= */}

          {product.packing && (
            <Section
              title="Packing"
              icon={
                <Package className="h-3.5 w-3.5" />
              }
            >

              <p className="
                whitespace-pre-line
                text-xs
                leading-5
                text-gray-600
              ">
                {product.packing}
              </p>

            </Section>
          )}

          {/* ================================= */}
          {/* ADDITIONAL INFORMATION - RIGHT */}
          {/* ================================= */}

          {product.additionalInfo && (
            <Section
              title="Additional Information"
              icon={
                <Info className="h-3.5 w-3.5" />
              }
            >

              <p className="
                whitespace-pre-line
                text-xs
                leading-5
                text-gray-600
              ">
                {product.additionalInfo}
              </p>

            </Section>
          )}

        </div>
      )}

      {/* ===================================== */}
      {/* EMPTY */}
      {/* ===================================== */}

      {features.length === 0 &&
        tags.length === 0 &&
        displayNotes.length === 0 &&
        !hasDescription &&
        !product.packing &&
        !product.directionOfUse &&
        !product.additionalInfo && (

          <section className="
            rounded-xl
            border
            border-gray-100
            bg-white
            p-4
          ">
            <p className="
              text-xs
              text-gray-400
            ">
              No product feature information available.
            </p>
          </section>

        )}

    </div>
  );
}