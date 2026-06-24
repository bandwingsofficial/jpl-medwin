"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { CategoryTable } from "../components/category-table";

import { CreateCategoryModal } from "../components/create-category-modal";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useToggleCategoryStatus,
} from "../hooks/use-category";

import { Category } from "../types/category.type";

import {
  showError,
  showSuccess,
  showWarning,
  showInfo,
  showConfirmToast,
} from "@/shared/store/toast.store";

export function CategoriesPage() {

  const {
    data,
    isLoading,
  } = useCategories();

  const createMutation =
    useCreateCategory();

  const updateMutation =
    useUpdateCategory();

  const deleteMutation =
    useDeleteCategory();

  const toggleStatusMutation =
    useToggleCategoryStatus();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    selected,
    setSelected,
  ] = useState<Category | null>(
    null
  );

  // =========================================
  // MUTATION LOADING
  // =========================================

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    toggleStatusMutation.isPending;

  // =========================================
  // CREATE
  // =========================================

  const handleCreate =
    () => {

      setSelected(
        null
      );

      setOpen(true);

      showInfo(
        "Create new category"
      );
    };

  // =========================================
  // EDIT
  // =========================================

  const handleEdit =
    (
      category: Category
    ) => {

      setSelected(
        category
      );

      setOpen(true);

      showInfo(
        `Editing "${category.name}"`
      );
    };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit =
    async (
      formData: any
    ) => {

      try {

        // UPDATE

        if (selected) {

          await updateMutation.mutateAsync({
            id: selected.id,

            payload:
              formData,
          });

          showSuccess(
            "Category updated successfully"
          );

        } else {

          // CREATE

          await createMutation.mutateAsync(
            formData
          );

          showSuccess(
            "Category created successfully"
          );
        }

        setOpen(false);

        setSelected(
          null
        );

      } catch (error: any) {

        console.error(
          "Submit Error:",
          error
        );

        showError(
          error?.message ||
            "Something went wrong"
        );
      }
    };

  // =========================================
  // STATUS TOGGLE
  // =========================================

  const handleToggleStatus =
    async (
      category: Category
    ) => {

      try {

        if (
          toggleStatusMutation.isPending
        ) {
          return;
        }

        const newStatus =
          category.status ===
          "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE";

        await toggleStatusMutation.mutateAsync({
          id: category.id,

          status:
            newStatus,
        });

        showSuccess(
          `Category ${newStatus.toLowerCase()} successfully`
        );

      } catch (error: any) {

        console.error(
          "Status Update Error:",
          error
        );

        showError(
          error?.message ||
            "Failed to update status"
        );
      }
    };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete =
    async (
      category: Category
    ) => {

      try {

        if (
          deleteMutation.isPending
        ) {
          return;
        }

        // ACTIVE CHECK

        if (
          category.status ===
          "ACTIVE"
        ) {

          showWarning(
            "Deactivate the category before deleting"
          );

          return;
        }

        // CONFIRM DELETE

        showConfirmToast(

          `Are you sure you want to delete "${category.name}" ?`,

          async () => {

            try {

              showWarning(
                `Deleting "${category.name}"...`
              );

              await deleteMutation.mutateAsync(
                category.id
              );

              showSuccess(
                "Category deleted successfully"
              );

            } catch (error: any) {

              console.error(
                "Delete Error:",
                error
              );

              showError(
                error?.response?.data
                  ?.message ||
                error?.message ||
                "Delete failed"
              );
            }
          }
        );

      } catch (error: any) {

        console.error(
          "Delete Error:",
          error
        );

        showError(
          error?.message ||
          "Delete failed"
        );
      }
    };

  // =========================================
  // RENDER
  // =========================================

  return (

    <div
      className="
        min-h-screen
        bg-gray-50
        p-6
      "
    >

      {/* HEADER */}

      <div
        className="
          mb-8
          flex
          items-start
          justify-between
          gap-4
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
            Categories
          </h1>

          <p
            className="
              mt-1
              text-sm
              font-semibold
              text-teal-600
            "
          >
            Total Categories Available: {data?.length || 0}
          </p>

        </div>

        <Button
          onClick={
            handleCreate
          }
          disabled={
            isMutating
          }
          className="
            h-11
            rounded-xl
            px-5
            shadow-sm
          "
        >
          + Add Category
        </Button>

      </div>

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          bg-white
        "
      >

        <CategoryTable
          data={data || []}
          isLoading={
            isLoading
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDelete
          }
          onToggleStatus={
            handleToggleStatus
          }
        />

      </div>

      {/* MODAL */}

      <CreateCategoryModal
        open={open}
        onClose={() => {

          setOpen(false);

          setSelected(
            null
          );
        }}
        onSubmit={
          handleSubmit
        }
        initialData={
          selected
        }
        isLoading={
          isMutating
        }
      />

    </div>
  );
}