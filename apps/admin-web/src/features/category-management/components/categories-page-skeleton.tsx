export function CategoriesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* =========================================
          PAGE HEADER SKELETON
      ========================================= */}

      <div className="mb-8 flex items-start justify-between gap-4">
        {/* TITLE */}
        <div className="space-y-2">
          <div className="h-9 w-44 animate-pulse rounded-md bg-gray-200" />

          <div className="h-5 w-64 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* ADD CATEGORY BUTTON */}
        <div className="h-11 w-40 animate-pulse rounded-xl bg-gray-200" />
      </div>

      {/* =========================================
          TABLE / FILTER SKELETON
      ========================================= */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* FILTER BAR */}

        <div className="flex items-center gap-4 border-b border-gray-100 p-5">
          {/* SEARCH */}

          <div className="h-12 flex-1 animate-pulse rounded-xl bg-gray-100" />

          {/* STATUS FILTER */}

          <div className="h-12 w-48 animate-pulse rounded-xl bg-gray-100" />
        </div>

        {/* =========================================
            TABLE HEADER
        ========================================= */}

        <div className="grid grid-cols-[140px_1.5fr_1.5fr_1fr_1fr_150px] items-center gap-4 border-b border-gray-100 bg-gray-50/70 px-7 py-5">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

          <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>

        {/* =========================================
            TABLE ROWS
        ========================================= */}

        <div>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="
                grid
                grid-cols-[140px_1.5fr_1.5fr_1fr_1fr_150px]
                items-center
                gap-4
                border-b
                border-gray-100
                px-7
                py-5
                last:border-b-0
              "
            >
              {/* IMAGE */}

              <div className="h-14 w-14 animate-pulse rounded-lg bg-gray-200" />

              {/* NAME */}

              <div className="h-5 w-36 animate-pulse rounded-md bg-gray-200" />

              {/* SLUG */}

              <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200" />

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
    </div>
  );
}