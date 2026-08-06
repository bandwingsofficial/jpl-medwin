import { Home, Briefcase, MapPin } from "lucide-react";

export const ADDRESS_TYPES = [
  {
    label: "Home",
    value: "HOME",
    icon: Home,
  },

  {
    label: "Work",
    value: "WORK",
    icon: Briefcase,
  },

  {
    label: "Other",
    value: "OTHER",
    icon: MapPin,
  },
] as const;