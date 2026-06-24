"use client";

import { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Category } from "../types/category.type";

interface Props {
  initialData?: Category | null;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function CategoryForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    metaDescription: "",
  });

  const [preview, setPreview] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        metaDescription: initialData.metaDescription || "",
      });

      if (initialData.imageUrl) {
        setPreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      name: form.name,
      description: form.description,
      metaDescription: form.metaDescription,
      status: "ACTIVE", // ✅ ALWAYS ACTIVE (FIX)
    };

    if (form.slug) payload.slug = form.slug;

    if (file) payload.image = file;

    onSubmit(payload);
  };

  return (
    <div className="flex flex-col max-h-[85vh]">

      {/* HEADER */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? "Edit Category" : "Create Category"}
        </h2>
        <p className="text-sm text-gray-500">
          Manage category details
        </p>
      </div>

      {/* BODY */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
      >

        {/* NAME */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Category Name
          </label>
          <Input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="mt-1 h-11"
          />
        </div>

        {/* SLUG */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Slug
          </label>
          <Input
            value={form.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            className="mt-1 h-11"
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Category Image
          </label>

          <div className="mt-2 flex items-center gap-4">
            <label className="cursor-pointer">
              <span className="inline-block px-4 py-2 text-sm font-medium rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition">
                Choose Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <span className="text-sm text-gray-500 truncate max-w-[180px]">
              {fileName || "No file chosen"}
            </span>

            {preview && (
              <img
                src={preview}
                className="w-14 h-14 object-cover rounded-md border"
              />
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <Input
            value={form.description}
            onChange={(e) =>
              handleChange("description", e.target.value)
            }
            className="mt-1 h-11"
          />
        </div>

        {/* META */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Meta Description
          </label>
          <Input
            value={form.metaDescription}
            onChange={(e) =>
              handleChange("metaDescription", e.target.value)
            }
            className="mt-1 h-11"
          />
        </div>
      </form>

      {/* FOOTER */}
      <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Category"}
        </Button>
      </div>
    </div>
  );
}