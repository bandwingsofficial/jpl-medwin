interface Props {
  isActive: boolean;
}

export function CustomerStatusBadge({ isActive }: Props) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${
          isActive
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-700 border-red-200"
        }
      `}
    >
      {/* Visual Dot Indicator */}
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}