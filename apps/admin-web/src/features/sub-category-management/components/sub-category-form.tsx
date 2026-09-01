"use client";

import { useEffect, useState } from "react";

import { Input } from "@/shared/components/ui/input";

import { Button } from "@/shared/components/ui/button";

import { Category } from "@/features/category-management/types/category.type";

import { SubCategory } from "../types/sub-category.type";

interface Props {
  categories: Category[];

  onSubmit: (data: any) => void;

  initialData?: SubCategory | null;

  isLoading?: boolean;

  onCancel?: () => void;
}

export function SubCategoryForm({
  categories,
  onSubmit,
  initialData,
  isLoading,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    name: "",

    categoryId: "",

    description: "",

    metaDescription: "",
  });

  const [file, setFile] =
    useState<File | null>(null);

  // =========================
  // PREFILL
  // =========================
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",

        categoryId:
          initialData.categoryId || "",

        description:
          initialData.description || "",

        metaDescription:
          initialData.metaDescription || "",
      });

      setFile(null);
    } else {
      setForm({
        name: "",

        categoryId: "",

        description: "",

        metaDescription: "",
      });

      setFile(null);
    }
  }, [initialData]);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = () => {
    onSubmit({
      ...form,

      image: file,
    });
  };

  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-semibold">
          {initialData
            ? "Edit SubCategory"
            : "Create SubCategory"}
        </h2>
      </div>

      {/* BODY */}
      <div className="space-y-5 overflow-y-auto px-6 py-5 max-h-[65vh]">
        {/* NAME */}
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        {/* CATEGORY */}
        <select
          className="
            w-full
            rounded-md
            border
            border-gray-300
            bg-white
            p-2.5
            text-sm
            outline-none
            focus:border-purple-500
            focus:ring-2
            focus:ring-purple-200
          "
          value={form.categoryId}
          onChange={(e) =>
            setForm({
              ...form,
              categoryId: e.target.value,
            })
          }
        >
          <option value="">
            Select Category
          </option>

          {categories?.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>
          ))}
        </select>

        {/* FILE */}
        <input
          type="file"
          className="
            w-full
            rounded-md
            border
            border-gray-300
            p-2
            text-sm
          "
          onChange={(e) =>
            setFile(
              e.target.files?.[0] || null
            )
          }
        />

        {/* DESCRIPTION */}
        <Input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        {/* META DESCRIPTION */}
        <Input
          placeholder="Meta Description"
          value={form.metaDescription}
          onChange={(e) =>
            setForm({
              ...form,
              metaDescription:
                e.target.value,
            })
          }
        />
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 border-t px-6 py-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : initialData
            ? "Update"
            : "Save"}
        </Button>
      </div>
    </div>
  );
}