export function ProductPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* =========================================
          HEADER SKELETON
      ========================================= */}

      <div className="flex items-start justify-between gap-4">
        {/* TITLE + COUNT */}

        <div className="space-y-2">
          {/* Products */}

          <div className="h-9 w-40 animate-pulse rounded-md bg-gray-200" />

          {/* Total Products */}

          <div className="h-5 w-64 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* ACTION BUTTONS */}

        <div className="flex items-center gap-3">
          {/* Export Excel */}

          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />

          {/* Import Excel */}

          <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-200" />

          {/* Add Product */}

          <div className="h-10 w-36 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>

      {/* =========================================
          FILTER / SEARCH SKELETON
      ========================================= */}

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          {/* SEARCH */}

          <div className="h-12 flex-1 animate-pulse rounded-xl bg-gray-100" />

          {/* FILTER 1 */}

          <div className="h-12 w-44 animate-pulse rounded-xl bg-gray-100" />

          {/* FILTER 2 */}

          <div className="h-12 w-44 animate-pulse rounded-xl bg-gray-100" />

          {/* FILTER 3 */}

          <div className="h-12 w-40 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>

      {/* =========================================
          PRODUCT TABLE SKELETON
      ========================================= */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* TABLE HEADER */}

        <div
          className="
            grid
            grid-cols-[90px_1.6fr_1fr_1fr_1fr_1fr_140px]
            items-center
            gap-4
            border-b
            border-gray-100
            bg-gray-50/70
            px-6
            py-5
          "
        >
          <div className="h-4 w-14 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

          <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>

        {/* PRODUCT ROWS */}

        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="
              grid
              grid-cols-[90px_1.6fr_1fr_1fr_1fr_1fr_140px]
              items-center
              gap-4
              border-b
              border-gray-100
              px-6
              py-5
              last:border-b-0
            "
          >
            {/* IMAGE */}

            <div className="h-14 w-14 animate-pulse rounded-lg bg-gray-200" />

            {/* PRODUCT NAME */}

            <div className="space-y-2">
              <div className="h-5 w-40 animate-pulse rounded-md bg-gray-200" />

              <div className="h-4 w-28 animate-pulse rounded-md bg-gray-100" />
            </div>

            {/* CATEGORY */}

            <div className="h-5 w-28 animate-pulse rounded-md bg-gray-200" />

            {/* BRAND */}

            <div className="h-5 w-24 animate-pulse rounded-md bg-gray-200" />

            {/* PRICE */}

            <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200" />

            {/* STOCK / STATUS */}

            <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />

            {/* ACTIONS */}

            <div className="ml-auto flex gap-2">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

              <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

              <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}