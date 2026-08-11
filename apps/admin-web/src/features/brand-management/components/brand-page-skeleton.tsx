export function BrandPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* =========================================
          HEADER SKELETON
      ========================================= */}

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          {/* TITLE */}

          <div className="h-9 w-60 animate-pulse rounded-md bg-gray-200" />

          {/* TOTAL */}

          <div className="h-5 w-64 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* ADD BRAND */}

        <div className="h-11 w-36 animate-pulse rounded-xl bg-gray-200" />
      </div>

      {/* =========================================
          FILTER SKELETON
      ========================================= */}

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          {/* SEARCH */}

          <div className="h-12 flex-1 animate-pulse rounded-xl bg-gray-100" />

          {/* STATUS */}

          <div className="h-12 w-48 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>

      {/* =========================================
          TABLE SKELETON
      ========================================= */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* TABLE HEADER */}

        <div
          className="
            grid
            grid-cols-[1.5fr_1fr_1fr_1fr_150px]
            items-center
            gap-4
            border-b
            border-gray-100
            bg-gray-50/70
            px-6
            py-5
          "
        >
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

          <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>

        {/* TABLE ROWS */}

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="
              grid
              grid-cols-[1.5fr_1fr_1fr_1fr_150px]
              items-center
              gap-4
              border-b
              border-gray-100
              px-6
              py-5
              last:border-b-0
            "
          >
            {/* BRAND */}

            <div className="flex items-center gap-4">
              <div className="h-14 w-14 animate-pulse rounded-lg bg-gray-200" />

              <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200" />
            </div>

            {/* SKU PREFIX */}

            <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200" />

            {/* STATUS */}

            <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />

            {/* CREATED */}

            <div className="h-5 w-24 animate-pulse rounded-md bg-gray-200" />

            {/* ACTIONS */}

            <div className="ml-auto flex gap-2">
              <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-200" />

              <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-200" />

              <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}