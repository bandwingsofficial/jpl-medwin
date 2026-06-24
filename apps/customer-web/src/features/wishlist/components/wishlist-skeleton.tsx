// src/features/wishlist/components/wishlist-skeleton.tsx

export function WishlistSkeleton() {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3

        sm:grid-cols-3

        md:grid-cols-4

        lg:grid-cols-5
      "
    >
      {Array.from({
        length: 10,
      }).map((_, index) => (
        <div
          key={index}
          className="
            h-[320px]
            animate-pulse
            rounded-xl
            border
            border-gray-200
            bg-gray-100
          "
        />
      ))}
    </div>
  );
}