import { Button } from "@/shared/components/ui/button";

interface Props {
  onCreate: () => void;
}

export function CollectionPageHeader({
  onCreate,
}: Props) {
  return (
    <div
      className="
        mb-8
        flex
        items-start
        justify-between
      "
    >
      <div>
        <h1
          className="
            animate-text-shine
            bg-gradient-to-r
            from-[#001f3f]
            via-[#0d9488]
            to-[#001f3f]
            bg-clip-text
            text-[28px]
            font-bold
            text-transparent
          "
        >
          Collections
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          Manage your collections
        </p>
      </div>

      <Button onClick={onCreate}>
        + Add Collection
      </Button>
    </div>
  );
}