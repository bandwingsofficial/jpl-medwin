"use client";

import { Card } from "@/shared/components/ui/card";

import { Collection } from "@/features/collection-management/types/collection.types";

import { CollectionStatusBadge } from "./collection-status-badge";

interface Props {
  collection: Collection;
  productCount: number;
}

export function CollectionDetailsCard({
  collection,
  productCount,
}: Props) {
  return (
    <Card className="p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm rounded-xl">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* IMAGE */}
        <div className="shrink-0 mx-auto sm:mx-0">
          <img
            src={collection.imageUrl}
            alt={collection.name}
            className="w-32 h-32 rounded-xl object-contain bg-zinc-50 dark:bg-zinc-800/50 p-2 border border-zinc-100 dark:border-zinc-800"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 w-full space-y-4">
          {/* HEADER TITLE SECTION */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {collection.name}
                </h2>
                <CollectionStatusBadge
                  status={collection.status}
                />
              </div>
              <p className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
                slug: {collection.slug}
              </p>
            </div>
          </div>

          {/* DESCRIPTIONS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Description
              </p>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {collection.description || "No description available"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Meta Description
              </p>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {collection.metaDescription || "No meta description available"}
              </p>
            </div>
          </div>

          {/* METRICS GRID SECTION */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <div className="bg-zinc-50/60 dark:bg-zinc-800/30 p-2.5 rounded-lg border border-zinc-100/50 dark:border-zinc-800/50">
              <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                Products
              </p>
              <p className="text-base font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {productCount}
              </p>
            </div>

            <div className="bg-zinc-50/60 dark:bg-zinc-800/30 p-2.5 rounded-lg border border-zinc-100/50 dark:border-zinc-800/50">
              <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                Created
              </p>
              <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {new Date(collection.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>

            <div className="bg-zinc-50/60 dark:bg-zinc-800/30 p-2.5 rounded-lg border border-zinc-100/50 dark:border-zinc-800/50">
              <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                Updated
              </p>
              <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {new Date(collection.updatedAt).toLocaleDateString("en-IN")}
              </p>
            </div>

            <div className="bg-zinc-50/60 dark:bg-zinc-800/30 p-2.5 rounded-lg border border-zinc-100/50 dark:border-zinc-800/50">
              <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                Status
              </p>
              <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {collection.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}