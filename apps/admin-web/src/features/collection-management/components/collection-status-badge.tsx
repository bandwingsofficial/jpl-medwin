import { Badge } from "@/shared/components/ui/badge";

interface Props {
  status: "ACTIVE" | "INACTIVE";
}

export function CollectionStatusBadge({
  status,
}: Props) {
  return (
    <Badge
      variant="default"
      className={
        status === "ACTIVE"
          ? "border-green-100 bg-green-50 text-green-700"
          : "border-red-100 bg-red-50 text-red-600"
      }
    >
      {status}
    </Badge>
  );
}