  "use client";

  import { useMemo } from "react";

  import { useCategories } from "@/features/category-management/hooks/use-category";
  import { useSubCategories } from "@/features/sub-category-management/hooks/use-sub-category";
  import { useMiniCategories } from "@/features/mini-category-management/hooks/use-mini-category";
  import { useBrands } from "@/features/brand-management/hooks/use-brand";

  interface Props {
    data: any;
    onChange: (field: string, value: any) => void;
  }

  export function CategoryBrandSelector({
    data,
    onChange,
  }: Props) {

    // =========================================
    // FETCH DATA
    // =========================================

    const categoryQuery = useCategories();
    const subCategoryQuery = useSubCategories();
    const miniCategoryQuery = useMiniCategories();
    const brandQuery = useBrands();

    // =========================================
    // DIRECT ARRAY ACCESS
    // =========================================

    const categories = categoryQuery.data || [];
    const subCategories = subCategoryQuery.data || [];
    const miniCategories = miniCategoryQuery.data || [];
    const brands = brandQuery.data || [];

    // =========================================
    // FILTERED LISTS
    // =========================================

    const filteredSubCategories = useMemo(() => {
      return subCategories.filter(
        (s: any) =>
          s.categoryId === data.categoryId
      );
    }, [subCategories, data.categoryId]);

    const filteredMiniCategories = useMemo(() => {
      return miniCategories.filter(
        (m: any) =>
          m.subCategoryId === data.subCategoryId
      );
    }, [miniCategories, data.subCategoryId]);

    // =========================================
    // CHANGE HANDLERS
    // =========================================

    const handleCategoryChange = (
  value: string
) => {

  // edit/create selection
  const isDifferent =
    value !== data.categoryId;

  onChange(
    "categoryId",
    value
  );

  // reset only when category actually changes
  if (isDifferent) {

    onChange(
      "subCategoryId",
      ""
    );

    onChange(
      "miniCategoryId",
      ""
    );

  }
};

const handleSubCategoryChange = (
  value: string
) => {

  const isDifferent =
    value !== data.subCategoryId;

  onChange(
    "subCategoryId",
    value
  );

  // reset only when sub category changes
  if (isDifferent) {

    onChange(
      "miniCategoryId",
      ""
    );

  }
};
    // =========================================
    // UI
    // =========================================

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* CATEGORY */}
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
          value={data.categoryId || ""}
          onChange={(e) =>
            handleCategoryChange(e.target.value)
          }
        >
          <option value="">
            Select Category
          </option>

          {categories.map((c: any) => (
            <option
              key={c.id}
              value={c.id}
            >
              {c.name}
            </option>
          ))}
        </select>

        {/* SUB CATEGORY */}
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
          value={data.subCategoryId || ""}
          onChange={(e) =>
            handleSubCategoryChange(
              e.target.value
            )
          }
          disabled={!data.categoryId}
        >
          <option value="">
            Select Sub Category
          </option>

          {filteredSubCategories.map(
            (s: any) => (
              <option
                key={s.id}
                value={s.id}
              >
                {s.name}
              </option>
            )
          )}
        </select>

        {/* MINI CATEGORY */}
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
          value={data.miniCategoryId || ""}
          onChange={(e) =>
            onChange(
              "miniCategoryId",
              e.target.value
            )
          }
          disabled={!data.subCategoryId}
        >
          <option value="">
            Select Mini Category
          </option>

          {filteredMiniCategories.map(
            (m: any) => (
              <option
                key={m.id}
                value={m.id}
              >
                {m.name}
              </option>
            )
          )}
        </select>

        {/* BRAND */}
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
          value={data.brandId || ""}
          onChange={(e) =>
            onChange(
              "brandId",
              e.target.value
            )
          }
        >
          <option value="">
            Select Brand
          </option>

          {brands.map((b: any) => (
            <option
              key={b.id}
              value={b.id}
            >
              {b.name}
            </option>
          ))}
        </select>
      </div>
    );
  }