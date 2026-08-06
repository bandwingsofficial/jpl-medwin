"use client";

import { MapPinned } from "lucide-react";

export function EmptyAddress() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <MapPinned className="h-8 w-8 text-muted-foreground" />
      </div>

      <h3 className="mt-5 text-xl font-semibold">
        No addresses added
      </h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Add your delivery address to
        speed up checkout and order
        management.
      </p>
    </div>
  );
}