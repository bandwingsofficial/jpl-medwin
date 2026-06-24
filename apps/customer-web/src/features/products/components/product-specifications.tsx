"use client";

import { ProductSpecification } from "@/features/products/types/product.type";

interface ProductSpecificationsProps {
  specifications?: ProductSpecification[];
}

export function ProductSpecifications({
  specifications = [],
}: ProductSpecificationsProps) {
  /*
   |--------------------------------------------------------------------------
   | EMPTY STATE
   |--------------------------------------------------------------------------
   */

  if (!specifications.length) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* HEADER */}
      <div
        className="
          border-b
          border-gray-200
          bg-gradient-to-r
          from-gray-50
          to-white
          px-6
          py-5
        "
      >
        <h2
          className="
            text-xl
            font-bold
            tracking-tight
            text-gray-900
          "
        >
          Technical Specifications
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          Detailed product specifications and technical information.
        </p>
      </div>

      {/* SPECIFICATIONS TABLE */}
      <div className="divide-y divide-gray-200">
        {specifications.map((specification, index) => (
          <div
            key={`${specification.key}-${index}`}
            className="
              grid
              grid-cols-1
              transition-colors
              duration-200
              hover:bg-gray-50

              md:grid-cols-[260px_1fr]
            "
          >
            {/* SPECIFICATION LABEL */}
            <div
              className="
                border-b
                border-gray-100
                bg-gray-50/70
                px-6
                py-4

                md:border-b-0
                md:border-r
                md:border-gray-200
              "
            >
              <p
                className="
                  text-sm
                  font-semibold
                  tracking-wide
                  text-gray-800
                "
              >
                {specification.key}
              </p>
            </div>

            {/* SPECIFICATION VALUE */}
            <div
              className="
                flex
                items-center
                px-6
                py-4
              "
            >
              <p
                className="
                  text-sm
                  leading-7
                  text-gray-700
                "
              >
                {specification.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}