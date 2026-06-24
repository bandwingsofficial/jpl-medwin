import {
  Heart,
  LogOut,
  Package,
  ShoppingCart,
  User,
  MapPin,
  Coins,
} from "lucide-react";

export const ACCOUNT_SIDEBAR_ITEMS = [
  {
    label: "My Profile",
    href: "/account",
    icon: User,
  },
  {
    label: "Coins",
    href: "/account/coins",
    icon: Coins,
  },
  {
    label: "Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    label: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  
];