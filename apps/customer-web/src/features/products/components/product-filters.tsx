"use client";

import { useCategories } from "@/features/category/hooks/use-category";
import { useSubCategories } from "@/features/category/hooks/use-sub-categories";
import { useMiniCategories } from "@/features/category/hooks/use-mini-categories";

import { useBrands } from "@/features/brands/hooks/use-brands";

interface ProductFiltersProps {
  filters: any;
  onChange: (filters: any) => void;
}

export function ProductFilters({
  filters,
  onChange,
}: ProductFiltersProps) {
  const { data: categories = [] } =
    useCategories();

  const { data: brands = [] } =
    useBrands();

  const {
    data: subCategories = [],
  } = useSubCategories(
    filters.categoryId || ""
  );

  const {
    data: miniCategories = [],
  } = useMiniCategories(
    filters.subCategoryId
  );

  return (
    <aside
      className="
        w-full
        lg:w-[240px]
        shrink-0

        sticky
        top-[120px]

        self-start

        border
        border-slate-100
        rounded-xl
        bg-white

        p-4
        space-y-4

        h-[calc(100vh-140px)]
        overflow-y-auto
        
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]
      "
    >
      <div className="border-b border-slate-100 pb-2">
        <h2
          className="
            text-base
            font-bold
            tracking-tight
            text-slate-900
          "
        >
          Filters
        </h2>
      </div>

      {/* CATEGORY */}

      <div>
        <label
          className="
            text-xs
            font-semibold
            text-slate-600
            block
            mb-1.5
          "
        >
          Category
        </label>

        <select
          className="
            w-full
            border
            border-slate-200/80
            rounded-lg
            p-2
            text-xs
            bg-slate-50/50
            font-medium
            text-slate-800
            focus:outline-none
            focus:ring-1
            focus:ring-black
            focus:border-black
            transition-all
            cursor-pointer
          "
          value={
            filters.categoryId || ""
          }
          onChange={(e) =>
            onChange({
              ...filters,

              categoryId:
                e.target.value ||
                undefined,

              subCategoryId:
                undefined,

              miniCategoryId:
                undefined,
            })
          }
        >
          <option value="">
            All Categories
          </option>

          {categories.map(
            (category: any) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            )
          )}
        </select>
      </div>

      {/* SUB CATEGORY */}

      <div>
        <label
          className="
            text-xs
            font-semibold
            text-slate-600
            block
            mb-1.5
          "
        >
          Sub Category
        </label>

        <select
          className="
            w-full
            border
            border-slate-200/80
            rounded-lg
            p-2
            text-xs
            bg-slate-50/50
            font-medium
            text-slate-800
            focus:outline-none
            focus:ring-1
            focus:ring-black
            focus:border-black
            transition-all
            cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
          value={
            filters.subCategoryId ||
            ""
          }
          onChange={(e) =>
            onChange({
              ...filters,

              subCategoryId:
                e.target.value ||
                undefined,

              miniCategoryId:
                undefined,
            })
          }
          disabled={
            !filters.categoryId
          }
        >
          <option value="">
            All Sub Categories
          </option>

          {subCategories.map(
            (sub: any) => (
              <option
                key={sub.id}
                value={sub.id}
              >
                {sub.name}
              </option>
            )
          )}
        </select>
      </div>

      {/* MINI CATEGORY */}

      <div>
        <label
          className="
            text-xs
            font-semibold
            text-slate-600
            block
            mb-1.5
          "
        >
          Mini Category
        </label>

        <select
          className="
            w-full
            border
            border-slate-200/80
            rounded-lg
            p-2
            text-xs
            bg-slate-50/50
            font-medium
            text-slate-800
            focus:outline-none
            focus:ring-1
            focus:ring-black
            focus:border-black
            transition-all
            cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
          value={
            filters.miniCategoryId ||
            ""
          }
          onChange={(e) =>
            onChange({
              ...filters,

              miniCategoryId:
                e.target.value ||
                undefined,
            })
          }
          disabled={
            !filters.subCategoryId
          }
        >
          <option value="">
            All Mini Categories
          </option>

          {miniCategories.map(
            (mini: any) => (
              <option
                key={mini.id}
                value={mini.id}
              >
                {mini.name}
              </option>
            )
          )}
        </select>
      </div>

      {/* BRAND */}

      <div>
        <label
          className="
            text-xs
            font-semibold
            text-slate-600
            block
            mb-1.5
          "
        >
          Brand
        </label>

        <select
          className="
            w-full
            border
            border-slate-200/80
            rounded-lg
            p-2
            text-xs
            bg-slate-50/50
            font-medium
            text-slate-800
            focus:outline-none
            focus:ring-1
            focus:ring-black
            focus:border-black
            transition-all
            cursor-pointer
          "
          value={
            filters.brandId || ""
          }
          onChange={(e) =>
            onChange({
              ...filters,

              brandId:
                e.target.value ||
                undefined,
            })
          }
        >
          <option value="">
            All Brands
          </option>

          {brands.map(
            (brand: any) => (
              <option
                key={brand.id}
                value={brand.id}
              >
                {brand.name}
              </option>
            )
          )}
        </select>
      </div>

      {/* PRICE */}

      <div>
        <label
          className="
            text-xs
            font-semibold
            text-slate-600
            block
            mb-1.5
          "
        >
          Price Range
        </label>

        <div className="space-y-1.5">
          <input
            type="number"
            placeholder="Min Price"
            className="
              w-full
              border
              border-slate-200/80
              rounded-lg
              p-2
              text-xs
              bg-slate-50/50
              font-medium
              text-slate-800
              focus:outline-none
              focus:ring-1
              focus:ring-black
              focus:border-black
              transition-all
            "
            value={
              filters.minPrice || ""
            }
            onChange={(e) =>
              onChange({
                ...filters,

                minPrice:
                  Number(
                    e.target.value
                  ) || undefined,
              })
            }
          />

          <input
            type="number"
            placeholder="Max Price"
            className="
              w-full
              border
              border-slate-200/80
              rounded-lg
              p-2
              text-xs
              bg-slate-50/50
              font-medium
              text-slate-800
              focus:outline-none
              focus:ring-1
              focus:ring-black
              focus:border-black
              transition-all
            "
            value={
              filters.maxPrice || ""
            }
            onChange={(e) =>
              onChange({
                ...filters,

                maxPrice:
                  Number(
                    e.target.value
                  ) || undefined,
              })
            }
          />
        </div>
      </div>

      {/* STOCK */}

      <div className="pt-1">
        <label
          className="
            flex
            items-center
            gap-2
            text-xs
            font-semibold
            text-slate-700
            cursor-pointer
            select-none
          "
        >
          <input
            type="checkbox"
            className="
              w-3.5
              h-3.5
              accent-black
              rounded
              cursor-pointer
            "
            checked={
              filters.inStock ||
              false
            }
            onChange={(e) =>
              onChange({
                ...filters,

                inStock:
                  e.target.checked,
              })
            }
          />

          In Stock Only
        </label>
      </div>

      {/* TYPE */}

      <div>
        <label
          className="
            text-xs
            font-semibold
            text-slate-600
            block
            mb-1.5
          "
        >
          Product Type
        </label>

        <select
          className="
            w-full
            border
            border-slate-200/80
            rounded-lg
            p-2
            text-xs
            bg-slate-50/50
            font-medium
            text-slate-800
            focus:outline-none
            focus:ring-1
            focus:ring-black
            focus:border-black
            transition-all
            cursor-pointer
          "
          value={
            filters.type || ""
          }
          onChange={(e) =>
            onChange({
              ...filters,

              type:
                e.target.value ||
                undefined,
            })
          }
        >
          <option value="">
            All Types
          </option>

          <option value="SIMPLE">
            Simple
          </option>

          <option value="VARIABLE">
            Variable
          </option>
        </select>
      </div>

      {/* SORT */}

      <div>
        <label
          className="
            text-xs
            font-semibold
            text-slate-600
            block
            mb-1.5
          "
        >
          Sort By
        </label>

        <select
          className="
            w-full
            border
            border-slate-200/80
            rounded-lg
            p-2
            text-xs
            bg-slate-50/50
            font-medium
            text-slate-800
            focus:outline-none
            focus:ring-1
            focus:ring-black
            focus:border-black
            transition-all
            cursor-pointer
          "
          value={
            filters.sortBy || ""
          }
          onChange={(e) =>
            onChange({
              ...filters,

              sortBy:
                e.target.value ||
                undefined,
            })
          }
        >
          <option value="">
            Default
          </option>

          <option value="priceLowToHigh">
            Price Low To High
          </option>

          <option value="priceHighToLow">
            Price High To Low
          </option>
        </select>
      </div>

      {/* CLEAR */}

      <div className="pt-2">
        <button
          onClick={() =>
            onChange({})
          }
          className="
            w-full
            bg-teal-600
            hover:bg-teal-800
            text-white
            py-2
            rounded-lg
            text-xs
            font-semibold
            shadow-sm
            transition-colors
            active:scale-[0.98]
          "
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
}