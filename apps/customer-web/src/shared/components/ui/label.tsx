import { cn } from "@/shared/lib/cn";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({
  children,
  className,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-gray-700", className)}
      {...props}
    >
      {children}
    </label>
  );
}