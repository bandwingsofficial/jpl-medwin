"use client";

import { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

import { Category } from "@/features/category-management/types/category.type";
import { SubCategory } from "@/features/sub-category-management/types/sub-category.type";
import { MiniCategory } from "../types/mini-category.type";

interface Props {
  categories: Category[];
  subCategories: SubCategory[];

  onSubmit: (data: any) => void;

  initialData?: MiniCategory | null;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function MiniCategoryForm({
  categories,
  subCategories,
  onSubmit,
  initialData,
  isLoading,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    subCategoryId: "",
    description: "",
    metaDescription: "",
  });

  const [file, setFile] = useState<File | null>(null);

  // 🔥 FILTER SUBCATEGORY BASED ON CATEGORY
  const filteredSubs = subCategories.filter(
    (s) => s.categoryId === form.categoryId
  );

  // =========================
  // PREFILL
  // =========================
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        categoryId: initialData.categoryId || "",
        subCategoryId: initialData.subCategoryId || "",
        description: initialData.description || "",
        metaDescription: initialData.metaDescription || "",
      });
      setFile(null);
    } else {
      setForm({
        name: "",
        categoryId: "",
        subCategoryId: "",
        description: "",
        metaDescription: "",
      });
      setFile(null);
    }
  }, [initialData]);

  // =========================
  // SUBMIT (🔥 FIX HERE)
  // =========================
  const handleSubmit = () => {
    if (initialData) {
      // ✅ EDIT MODE → REMOVE categoryId & subCategoryId
      const { categoryId, subCategoryId, ...rest } = form;

      onSubmit({
        ...rest,
        image: file,
      });
    } else {
      // ✅ CREATE MODE
      onSubmit({
        ...form,
        image: file,
      });
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-white rounded-xl">

      {/* HEADER */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">
          {initialData ? "Edit Mini Category" : "Create Mini Category"}
        </h2>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* NAME */}
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* CATEGORY */}
        <select
          className="w-full border rounded-md p-2"
          value={form.categoryId}
          disabled={!!initialData} // 🔥 LOCK IN EDIT MODE
          onChange={(e) =>
            setForm({
              ...form,
              categoryId: e.target.value,
              subCategoryId: "",
            })
          }
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SUB CATEGORY */}
        <select
          className="w-full border rounded-md p-2"
          value={form.subCategoryId}
          disabled={!!initialData} // 🔥 LOCK IN EDIT MODE
          onChange={(e) =>
            setForm({ ...form, subCategoryId: e.target.value })
          }
        >
          <option value="">Select SubCategory</option>
          {filteredSubs.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* IMAGE */}
        <input
          type="file"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />

        {/* DESCRIPTION */}
        <Input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* META */}
        <Input
          placeholder="Meta Description"
          value={form.metaDescription}
          onChange={(e) =>
            setForm({ ...form, metaDescription: e.target.value })
          }
        />
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button onClick={handleSubmit} disabled={isLoading}>
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