"use client";

export function AddressSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="h-[220px] animate-pulse rounded-2xl border bg-muted"
        />
      ))}
    </div>
  );
}