"use client";

import {
  BriefcaseBusiness,
  FolderTree,
  IndianRupee,
  Layers3,
  ListFilter,
  PackageCheck,
  SlidersHorizontal,
  Tags,
} from "lucide-react";

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
        shrink-0
        lg:w-[240px]
        sticky
        top-[120px]
        self-start
        h-[calc(100vh-140px)]
        overflow-y-auto
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-[0_4px_20px_rgba(15,23,42,0.05)]
        space-y-5
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]
      "
    >
      {/* =========================================
          FILTER HEADER
      ========================================= */}

      <div
        className="
          relative
          overflow-hidden
          rounded-xl
          border
          border-teal-100
          bg-gradient-to-br
          from-teal-50
          via-white
          to-cyan-50
          px-3.5
          py-3
        "
      >
        <div
          className="
            absolute
            -right-6
            -top-6
            h-16
            w-16
            rounded-full
            bg-teal-100/50
          "
        />

        <div className="relative flex items-center gap-2.5">
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-teal-600
              text-white
              shadow-sm
            "
          >
            <SlidersHorizontal
              className="h-4 w-4"
              strokeWidth={2.2}
            />
          </div>

          <div>
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

            <p className="mt-0.5 text-[10px] font-medium text-teal-600">
              Refine your products
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          CATEGORY
      ========================================= */}

      <div>
        <label
          className="
            mb-1.5
            flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-slate-700
          "
        >
          <FolderTree
            className="h-3.5 w-3.5 text-teal-600"
            strokeWidth={2}
          />

          Category
        </label>

        <select
          className="
            h-11
            w-full
            cursor-pointer
            rounded-xl
            border
            border-slate-200
            bg-slate-50/70
            px-3
            text-sm
            font-medium
            text-slate-800
            outline-none
            transition-all
            hover:border-teal-200
            hover:bg-teal-50/30
            focus:border-teal-500
            focus:bg-white
            focus:ring-2
            focus:ring-teal-500/15
          "
          value={filters.categoryId || ""}
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

      {/* =========================================
          SUB CATEGORY
      ========================================= */}

      <div>
        <label
          className="
            mb-1.5
            flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-slate-700
          "
        >
          <Layers3
            className="h-3.5 w-3.5 text-cyan-600"
            strokeWidth={2}
          />

          Sub Category
        </label>

        <select
          className="
            h-11
            w-full
            cursor-pointer
            rounded-xl
            border
            border-slate-200
            bg-slate-50/70
            px-3
            text-sm
            font-medium
            text-slate-800
            outline-none
            transition-all
            hover:border-cyan-200
            hover:bg-cyan-50/30
            focus:border-cyan-500
            focus:bg-white
            focus:ring-2
            focus:ring-cyan-500/15
            disabled:cursor-not-allowed
            disabled:bg-slate-100
            disabled:text-slate-400
            disabled:hover:border-slate-200
            disabled:hover:bg-slate-100
          "
          value={filters.subCategoryId || ""}
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
          disabled={!filters.categoryId}
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

      {/* =========================================
          MINI CATEGORY
      ========================================= */}

      <div>
        <label
          className="
            mb-1.5
            flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-slate-700
          "
        >
          <Layers3
            className="h-3.5 w-3.5 text-violet-600"
            strokeWidth={2}
          />

          Mini Category
        </label>

        <select
          className="
            h-11
            w-full
            cursor-pointer
            rounded-xl
            border
            border-slate-200
            bg-slate-50/70
            px-3
            text-sm
            font-medium
            text-slate-800
            outline-none
            transition-all
            hover:border-violet-200
            hover:bg-violet-50/30
            focus:border-violet-500
            focus:bg-white
            focus:ring-2
            focus:ring-violet-500/15
            disabled:cursor-not-allowed
            disabled:bg-slate-100
            disabled:text-slate-400
            disabled:hover:border-slate-200
            disabled:hover:bg-slate-100
          "
          value={
            filters.miniCategoryId || ""
          }
          onChange={(e) =>
            onChange({
              ...filters,
              miniCategoryId:
                e.target.value ||
                undefined,
            })
          }
          disabled={!filters.subCategoryId}
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

      {/* =========================================
          BRAND
      ========================================= */}

      <div>
        <label
          className="
            mb-1.5
            flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-slate-700
          "
        >
          <Tags
            className="h-3.5 w-3.5 text-emerald-600"
            strokeWidth={2}
          />

          Brand
        </label>

        <select
          className="
            h-11
            w-full
            cursor-pointer
            rounded-xl
            border
            border-slate-200
            bg-slate-50/70
            px-3
            text-sm
            font-medium
            text-slate-800
            outline-none
            transition-all
            hover:border-emerald-200
            hover:bg-emerald-50/30
            focus:border-emerald-500
            focus:bg-white
            focus:ring-2
            focus:ring-emerald-500/15
          "
          value={filters.brandId || ""}
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

      {/* =========================================
          PRICE RANGE
      ========================================= */}

      <div>
        <label
          className="
            mb-1.5
            flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-slate-700
          "
        >
          <IndianRupee
            className="h-3.5 w-3.5 text-amber-600"
            strokeWidth={2}
          />

          Price Range
        </label>

        <div
          className="
            rounded-xl
            border
            border-amber-100
            bg-amber-50/30
            p-2
          "
        >
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Min Price"
              className="
                h-10
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                text-sm
                font-medium
                text-slate-800
                outline-none
                placeholder:text-slate-400
                transition-all
                hover:border-amber-200
                focus:border-amber-500
                focus:ring-2
                focus:ring-amber-500/15
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
                h-10
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                text-sm
                font-medium
                text-slate-800
                outline-none
                placeholder:text-slate-400
                transition-all
                hover:border-amber-200
                focus:border-amber-500
                focus:ring-2
                focus:ring-amber-500/15
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
      </div>

      {/* =========================================
          STOCK
      ========================================= */}

      <div
        className="
          rounded-xl
          border
          border-emerald-100
          bg-emerald-50/50
          px-3
          py-2.5
        "
      >
        <label
          className="
            flex
            cursor-pointer
            select-none
            items-center
            gap-2.5
            text-xs
            font-semibold
            text-slate-700
          "
        >
          <input
            type="checkbox"
            className="
              h-4
              w-4
              cursor-pointer
              rounded
              border-slate-300
              accent-emerald-600
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

          <PackageCheck
            className="h-4 w-4 text-emerald-600"
            strokeWidth={2}
          />

          In Stock Only
        </label>
      </div>

      {/* =========================================
          PRODUCT TYPE
      ========================================= */}

      <div>
        <label
          className="
            mb-1.5
            flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-slate-700
          "
        >
          <BriefcaseBusiness
            className="h-3.5 w-3.5 text-blue-600"
            strokeWidth={2}
          />

          Product Type
        </label>

        <select
          className="
            h-11
            w-full
            cursor-pointer
            rounded-xl
            border
            border-slate-200
            bg-slate-50/70
            px-3
            text-sm
            font-medium
            text-slate-800
            outline-none
            transition-all
            hover:border-blue-200
            hover:bg-blue-50/30
            focus:border-blue-500
            focus:bg-white
            focus:ring-2
            focus:ring-blue-500/15
          "
          value={filters.type || ""}
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

      {/* =========================================
          SORT
      ========================================= */}

      <div>
        <label
          className="
            mb-1.5
            flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-slate-700
          "
        >
          <ListFilter
            className="h-3.5 w-3.5 text-indigo-600"
            strokeWidth={2}
          />

          Sort By
        </label>

        <select
          className="
            h-11
            w-full
            cursor-pointer
            rounded-xl
            border
            border-slate-200
            bg-slate-50/70
            px-3
            text-sm
            font-medium
            text-slate-800
            outline-none
            transition-all
            hover:border-indigo-200
            hover:bg-indigo-50/30
            focus:border-indigo-500
            focus:bg-white
            focus:ring-2
            focus:ring-indigo-500/15
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

      {/* =========================================
          CLEAR FILTERS
      ========================================= */}

      <div className="pt-1">
        <button
          onClick={() =>
            onChange({})
          }
          className="
            flex
            h-10
            w-full
            items-center
            justify-center
            rounded-xl
            border
            border-teal-600
            bg-teal-600
            text-xs
            font-bold
            text-white
            shadow-sm
            shadow-teal-600/20
            transition-all
            hover:bg-teal-700
            hover:shadow-md
            hover:shadow-teal-600/20
            active:scale-[0.98]
          "
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
}