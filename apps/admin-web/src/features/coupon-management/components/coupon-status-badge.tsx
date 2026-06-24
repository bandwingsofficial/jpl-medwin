import { Badge } from "@/shared/components/ui/badge";

interface Props {
  status: "ACTIVE" | "INACTIVE";
}

export default function CouponStatusBadge({
  status,
}: Props) {
  return (
    <Badge
      variant={
        status === "ACTIVE"
          ? "success"
          : "danger"
      }
    >
      {status}
    </Badge>
  );
}