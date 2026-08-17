"use client";

export function OrderDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
      <div className="animate-pulse space-y-4 sm:space-y-5">

        {/* ========================= */}
        {/* BREADCRUMBS */}
        {/* ========================= */}

        <div className="flex items-center gap-2">
          <div className="h-4 w-14 rounded bg-gray-200" />
          <div className="h-3 w-3 rounded bg-gray-100" />
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-3 w-3 rounded bg-gray-100" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>

        {/* ========================= */}
        {/* ORDER HEADER */}
        {/* ========================= */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-teal-100
            bg-gradient-to-br
            from-teal-50
            via-white
            to-cyan-50
            p-4
            shadow-sm
            sm:p-5
          "
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            {/* ORDER INFORMATION */}
            <div className="min-w-0">
              <div className="mb-2 h-5 w-24 rounded-full bg-gray-200" />

              <div className="h-7 w-48 rounded bg-gray-200 sm:h-8 sm:w-56" />

              <div className="mt-2 h-4 w-44 rounded bg-gray-100" />
            </div>

            {/* ACTIONS */}
            <div className="flex w-full items-center gap-2 md:w-auto md:gap-3">
              <div className="h-10 flex-1 rounded-xl bg-gray-200 sm:flex-none sm:w-32" />

              <div className="h-9 w-28 shrink-0 rounded-full bg-gray-200" />

              <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* ORDER TRACKING */}
        {/* ========================= */}

        <div
          className="
            rounded-2xl
            border
            border-teal-100
            bg-white
            p-4
            shadow-sm
            sm:p-5
          "
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <div className="h-5 w-32 rounded bg-gray-200 sm:h-6 sm:w-36" />
              <div className="mt-2 h-3 w-24 rounded bg-gray-100 sm:w-28" />
            </div>

            <div className="h-6 w-24 shrink-0 rounded-full bg-gray-200" />
          </div>

          <div className="relative">
            <div className="absolute left-0 top-5 h-1 w-full rounded-full bg-gray-100" />

            <div className="relative grid grid-cols-3 gap-1 sm:gap-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex min-w-0 flex-col items-center"
                >
                  <div className="h-9 w-9 rounded-full border-4 border-gray-100 bg-white sm:h-10 sm:w-10" />

                  <div className="mt-2 h-3 w-16 rounded bg-gray-100 sm:w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* ORDER ITEMS + SUMMARY */}
        {/* ========================= */}

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">

          {/* ORDER ITEMS */}
          <div
            className="
              rounded-2xl
              border
              border-teal-100
              bg-white
              p-4
              shadow-sm
              sm:p-5
              lg:col-span-2
            "
          >
            <div className="mb-5">
              <div className="h-6 w-28 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-36 rounded bg-gray-100" />
            </div>

            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="
                    flex
                    min-w-0
                    gap-3
                    rounded-2xl
                    border
                    border-teal-100
                    bg-teal-50/20
                    p-3
                    sm:gap-4
                    sm:p-4
                  "
                >
                  {/* IMAGE */}
                  <div
                    className="
                      h-20
                      w-20
                      shrink-0
                      rounded-xl
                      bg-gray-200
                      sm:h-24
                      sm:w-24
                    "
                  />

                  {/* INFO */}
                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-3/4 rounded bg-gray-200 sm:h-5" />

                    <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />

                    <div className="mt-3 h-6 w-16 rounded-full bg-gray-200" />

                    <div className="mt-4 h-5 w-24 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4 sm:space-y-5">

            {/* ORDER SUMMARY */}
            <div
              className="
                rounded-2xl
                border
                border-teal-100
                bg-white
                p-4
                shadow-sm
                sm:p-5
              "
            >
              <div className="mb-5">
                <div className="h-5 w-32 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-24 rounded bg-gray-100" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="h-3 w-20 rounded bg-gray-100" />
                    <div className="h-4 w-16 rounded bg-gray-200" />
                  </div>
                ))}

                <div className="h-px w-full bg-gray-100" />

                <div className="flex items-center justify-between rounded-xl bg-teal-50 p-3">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-5 w-20 rounded bg-gray-200" />
                </div>
              </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <div
              className="
                rounded-2xl
                border
                border-teal-100
                bg-white
                p-4
                shadow-sm
                sm:p-5
              "
            >
              <div className="mb-4">
                <div className="h-5 w-36 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-28 rounded bg-gray-100" />
              </div>

              <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                <div className="h-4 w-32 rounded bg-gray-200" />

                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-4/5 rounded bg-gray-100" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                  <div className="pt-2 h-3 w-32 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* SUPPORT SECTION */}
        {/* ========================= */}

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-teal-100
            bg-gradient-to-r
            from-teal-50
            via-white
            to-cyan-50
            p-6
            shadow-sm
          "
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-gray-200" />

              <div className="min-w-0">
                <div className="h-5 w-48 rounded bg-gray-200" />

                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full max-w-md rounded bg-gray-100" />
                  <div className="h-3 w-72 max-w-full rounded bg-gray-100" />
                </div>
              </div>
            </div>

            <div className="h-10 w-full rounded-xl bg-gray-200 md:w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
