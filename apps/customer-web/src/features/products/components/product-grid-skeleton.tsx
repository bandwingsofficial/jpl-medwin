import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <section className="w-full">
      <div
        className="
          grid
          grid-cols-2
          gap-3

          sm:grid-cols-2

          md:grid-cols-3

          lg:grid-cols-4

          xl:grid-cols-5

          2xl:grid-cols-6
        "
      >
        {Array.from({ length: 12 }).map(
          (_, index) => (
            <div
              key={index}
              className="
                overflow-hidden
                rounded-lg
                border
                border-gray-200
                bg-white
              "
            >
              {/* IMAGE */}
              <Skeleton className="aspect-square w-full" />

              {/* CONTENT */}
              <div className="space-y-2 p-3">
                <Skeleton className="h-3 w-16" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>

                <Skeleton className="h-4 w-16" />

                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}