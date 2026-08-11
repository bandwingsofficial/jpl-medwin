"use client";

import Link from "next/link";

import {
  CollectionGrid,
} from "@/features/collections/components/collection-grid";

import {
  useCollections,
} from "@/features/collections/hooks/use-collections";

import {
  ChevronRight,
  Home,
} from "lucide-react";

export default function CollectionsPage() {
  const {
    data,
    isLoading,
    error,
  } = useCollections();

  const collections =
    Array.isArray(data)
      ? data
      : [];

  if (isLoading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500">
        
      </div>
    );
  }

  return (
    <div
      className="
        container
        mx-auto
        py-10
      "
    >
      {/* BREADCRUMBS */}

      <div className="mb-5 flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-1.5
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          <Home className="h-4 w-4" />
          Home
        </Link>

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        <span className="font-semibold text-teal-600">
          Collections
        </span>
      </div>

      <h1
        className="
          mb-8
          text-3xl
          font-bold
        "
      >
        Collections
      </h1>

      <CollectionGrid
        collections={collections}
      />
    </div>
  );
}