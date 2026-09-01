"use client";

export function CategoryMegaMenuSkeleton() {
  return (
    <div className="flex flex-1 min-h-0 animate-pulse">
      {/* CATEGORY COLUMN */}
      <div className="w-[240px] bg-gray-50/70 border-r border-gray-100 py-2">
        <div className="space-y-2 px-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="mx-2 flex h-[46px] items-center rounded-xl px-4"
            >
              <div className="h-3.5 w-[130px] rounded-md bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* SUB CATEGORY COLUMN */}
      <div className="w-[360px] border-r border-gray-100 p-5">
        <div className="mb-5 h-5 w-[120px] rounded-md bg-gray-200" />

        <div className="space-y-5">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-4 rounded-md bg-gray-100"
              style={{
                width: `${140 + (index % 3) * 35}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* MINI CATEGORY COLUMN */}
      <div className="flex-1 p-5">
        <div className="mb-5 h-5 w-[145px] rounded-md bg-gray-200" />

        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-4 rounded-md bg-gray-100"
              style={{
                width: `${110 + (index % 3) * 30}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Sub-category loading skeleton */

export function SubCategorySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-5 h-5 w-[130px] rounded-md bg-gray-200" />

      <div className="space-y-5">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="h-4 rounded-md bg-gray-100"
            style={{
              width: `${140 + (index % 3) * 35}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* Mini-category loading skeleton */

export function MiniCategorySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-5 h-5 w-[145px] rounded-md bg-gray-200" />

      <div className="space-y-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-4 rounded-md bg-gray-100"
            style={{
              width: `${110 + (index % 3) * 30}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}