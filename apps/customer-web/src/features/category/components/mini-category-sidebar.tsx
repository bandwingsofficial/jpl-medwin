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
    <div className="sticky top-24 self-start">
      {/* Header */}
      <h2 className="mb-5 text-[20px] font-semibold uppercase tracking-wide text-[#0BACAE]">
        Mini Categories
      </h2>

      <div className="space-y-1">
        {/* View All */}
        <button
          onClick={() => onSelect(null)}
          className={`
            block
            w-full
            rounded-xl
            px-2
            py-1.5
            text-left
            text-[12px]
            font-medium
            text-gray-800
            transition-colors
            ${
              selectedMiniCategory === null
                ? "bg-teal-50 text-teal-700"
                : "hover:bg-teal-50 hover:text-teal-700"
            }
          `}
        >
          View All
        </button>

        {/* Mini Categories */}
        {miniCategories.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`
              block
              w-full
              rounded-xl
              px-2
              py-1.5
              text-left
              text-[12px]
              font-medium
              text-gray-800
              transition-colors
              ${
                selectedMiniCategory === item.id
                  ? "bg-teal-50 text-teal-700"
                  : "hover:bg-teal-50 hover:text-teal-700"
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