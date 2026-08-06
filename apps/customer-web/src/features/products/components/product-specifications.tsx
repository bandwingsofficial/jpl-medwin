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
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-white px-5 py-4 sm:px-6 sm:py-5">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          Technical Specifications
        </h2>
        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
          Detailed product specifications and technical information.
        </p>
      </div>

      {/* SPECIFICATIONS LIST / TABLE */}
      <div className="divide-y divide-slate-100">
        {specifications.map((specification, index) => (
          <div
            key={`${specification.key}-${index}`}
            className="group flex flex-col transition-colors duration-150 hover:bg-slate-50/60 sm:grid sm:grid-cols-[240px_1fr] md:grid-cols-[280px_1fr]"
          >
            {/* SPECIFICATION LABEL */}
            <div className="bg-slate-50/50 px-5 py-2.5 sm:border-r sm:border-slate-100 sm:bg-transparent sm:px-6 sm:py-4">
              <p className="text-xs font-semibold tracking-wide text-slate-700 sm:text-sm">
                {specification.key}
              </p>
            </div>

            {/* SPECIFICATION VALUE */}
            <div className="px-5 pb-3 pt-1 sm:px-6 sm:py-4">
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm sm:leading-6">
                {specification.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}