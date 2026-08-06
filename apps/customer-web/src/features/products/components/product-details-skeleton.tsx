import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* LEFT */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />

          <div className="flex gap-3">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-20 w-20 rounded-xl"
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          <Skeleton className="h-4 w-24" />

          <Skeleton className="h-10 w-full" />

          <Skeleton className="h-8 w-52" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />

            <Skeleton className="h-4 w-5/6" />

            <Skeleton className="h-4 w-4/6" />
          </div>

          <div className="flex gap-3 pt-4">
            <Skeleton className="h-11 w-28 rounded-lg" />

            <Skeleton className="h-11 w-28 rounded-lg" />
          </div>

          <div className="flex gap-3 pt-6">
            <Skeleton className="h-12 flex-1 rounded-xl" />

            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}