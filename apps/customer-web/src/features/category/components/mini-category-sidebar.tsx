"use client";

interface MiniCategory {
  id: string;
  name: string;
}

interface Props {
  miniCategories: MiniCategory[];
  selectedMiniCategory: string | null;
  onSelect: (id: string | null) => void;
}

export default function MiniCategorySidebar({
  miniCategories,
  selectedMiniCategory,
  onSelect,
}: Props) {
  return (
    <div
      className="
        sticky
        top-32
        w-full
        bg-white
        border
        border-gray-200
        rounded-xl
        p-4
        shadow-sm
      "
    >
      <h3 
        className="
          text-sm 
          font-bold 
          mb-4
          bg-gradient-to-r 
          from-teal-600 
          via-teal-400 
          to-teal-700 
          bg-clip-text 
          text-transparent 
          animate-pulse
          tracking-wide
          uppercase
        "
      >
        Mini Categories
      </h3>

      <div className="space-y-1">
        <button
          onClick={() => onSelect(null)}
          className={`
            w-full
            text-left
            px-3
            py-2
            rounded-lg
            text-sm

            ${
              selectedMiniCategory === null
                ? "bg-teal-50 text-teal-700 font-medium"
                : "hover:bg-gray-50"
            }
          `}
        >
          View All
        </button>

        {miniCategories.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              onSelect(item.id)
            }
            className={`
              w-full
              text-left
              px-3
              py-2
              rounded-lg
              text-sm

              ${
                selectedMiniCategory ===
                item.id
                  ? "bg-teal-50 text-teal-700 font-medium"
                  : "hover:bg-gray-50"
              }
            `}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}