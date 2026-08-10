"use client";

import { ProductSpecification } from "@/features/products/types/product.type";

interface ProductSpecificationsProps {
  specifications?: ProductSpecification[];
}

export function ProductSpecifications({
  specifications = [],
}: ProductSpecificationsProps) {
  if (!specifications.length) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-teal-100 bg-white">
      {/* HEADER */}
      <div className="border-b border-teal-100 bg-teal-50 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Technical Specifications
        </h2>

        <p className="mt-0.5 text-sm text-slate-500">
          Detailed product specifications and technical information.
        </p>
      </div>

      {/* SPECIFICATIONS */}
      <div className="divide-y divide-slate-100">
        {specifications.map((specification, index) => (
          <div
            key={`${specification.key}-${index}`}
            className="grid grid-cols-[140px_1fr] sm:grid-cols-[240px_1fr]"
          >
            {/* LABEL */}
            <div className="bg-slate-50/60 px-4 py-3 sm:px-6">
              <p className="text-sm font-semibold text-slate-800">
                {specification.key}
              </p>
            </div>

            {/* VALUE */}
            <div className="px-4 py-3 sm:px-6">
              <p className="text-sm text-slate-600">
                {specification.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}