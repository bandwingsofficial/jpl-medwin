import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-24 rounded-full" />

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}