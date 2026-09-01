import { cn } from "@/shared/lib/cn";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700",
        className
      )}
    >
      {children}
    </span>
  );
}