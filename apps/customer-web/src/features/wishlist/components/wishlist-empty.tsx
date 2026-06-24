// src/features/wishlist/components/wishlist-empty.tsx

import { Heart } from "lucide-react";

export function WishlistEmpty() {
  return (
    <div
      className="
        flex
        min-h-[400px]
        flex-col
        items-center
        justify-center
        text-center
      "
    >
      <Heart
        size={60}
        className="
          mb-4
          text-gray-300
        "
      />

      <h2
        className="
          text-xl
          font-semibold
          text-gray-900
        "
      >
        Your wishlist is empty
      </h2>

      <p
        className="
          mt-2
          text-sm
          text-gray-500
        "
      >
        Save products you like and
        access them anytime.
      </p>
    </div>
  );
}