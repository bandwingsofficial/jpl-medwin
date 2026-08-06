"use client";

  import { useMemo } from "react";



  import { useCategories } from "@/features/category-management/hooks/use-category";

  import { useSubCategories } from "@/features/sub-category-management/hooks/use-sub-category";

  import { useMiniCategories } from "@/features/mini-category-management/hooks/use-mini-category";

  import { useBrands } from "@/features/brand-management/hooks/use-brand";

  type FieldError = { field: string; message: string };

  interface Props {

    data: any;

    onChange: (field: string, value: any) => void;

    fieldErrors?: FieldError[];

  }



  export function CategoryBrandSelector({

    data,

    onChange,

    fieldErrors = [],

  }: Props) {

    const fieldError = (field: string) =>
      fieldErrors.find((item) => item.field === field)?.message;



    const categoryQuery = useCategories();

    const subCategoryQuery = useSubCategories();

    const miniCategoryQuery = useMiniCategories();

    const brandQuery = useBrands();



    const categories = categoryQuery.data || [];

    const subCategories = subCategoryQuery.data || [];

    const miniCategories = miniCategoryQuery.data || [];

    const brands = brandQuery.data || [];



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



    const handleCategoryChange = (

  value: string

) => {



  const isDifferent =

    value !== data.categoryId;



  onChange(

    "categoryId",

    value

  );



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



  if (isDifferent) {



    onChange(

      "miniCategoryId",

      ""

    );



  }

};



    return (

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">



        <div className="space-y-2">

          <label className="text-sm font-semibold text-gray-700 flex items-center">

            Brand

            <span className="text-red-500 ml-1">*</span>

          </label>

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

          {fieldError("brandId") && (
            <p className="text-xs text-red-500">{fieldError("brandId")}</p>
          )}

        </div>



        <div className="space-y-2">

          <label className="text-sm font-semibold text-gray-700 flex items-center">

            Category

            <span className="text-red-500 ml-1">*</span>

          </label>

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

          {fieldError("categoryId") && (
            <p className="text-xs text-red-500">{fieldError("categoryId")}</p>
          )}

        </div>



        <div className="space-y-2">

          <label className="text-sm font-semibold text-gray-700 flex items-center">

            Sub Category

            <span className="text-red-500 ml-1">*</span>

          </label>

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

          {fieldError("subCategoryId") && (
            <p className="text-xs text-red-500">{fieldError("subCategoryId")}</p>
          )}

        </div>



        <div className="space-y-2">

          <label className="text-sm font-semibold text-gray-700">

            Mini Category (Optional)

          </label>

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

          {fieldError("miniCategoryId") && (
            <p className="text-xs text-red-500">{fieldError("miniCategoryId")}</p>
          )}

        </div>

      </div>

    );

  }

