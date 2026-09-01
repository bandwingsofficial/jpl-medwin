"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/cn";
import { useProductImport } from "@/features/product-management/hooks/use-product-import";
import { ImportMode,ImportPreviewData } from "@/features/product-management/types/product-import.type";
import { useToastStore } from "@/shared/store/toast.store";
import { ImportValidationErrors } from "./import-validation-errors";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ImportProductsModal({ open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { previewMutation, importMutation } = useProductImport();
  const { showToast } = useToastStore();

  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<ImportMode>("skip");
  
const [previewData, setPreviewData] =
  useState<ImportPreviewData | null>(
    null
  );
  // =====================================
  // FILE VALIDATION
  // =====================================
  const validateFile = (file: File) => {
    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!allowed.includes(file.type)) {
      showToast("Only Excel or CSV files are allowed", "error");
      return false;
    }
    return true;
  };

  // =====================================
  // HANDLE FILE
  // =====================================
  const handleFile = async (selectedFile: File) => {
    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);

    try {
      const response = await previewMutation.mutateAsync(selectedFile);

      const preview = response?.data ?? response;

      if (!preview) {
        showToast("Invalid preview response", "error");
        return;
      }

      setPreviewData(preview);
      showToast("Preview generated successfully", "success");
    } catch (err: any) {
      console.error("PREVIEW ERROR:", err);
      showToast(err?.response?.data?.message || "Preview failed", "error");
    }
  };

  // =====================================
  // FINAL IMPORT
  // =====================================
  const handleImport = async () => {
    if (!file) {
      showToast("Please select file", "error");
      return;
    }

    try {
      const response = await importMutation.mutateAsync({
        file,
        mode,
      });

      const result =
  response?.data;

showToast(
  `Imported: ${result?.summary?.imported ?? 0},
   Updated: ${result?.summary?.updated ?? 0},
   Restored: ${result?.summary?.restored ?? 0},
   Failed: ${result?.summary?.failed ?? 0}`,
  "success"
);
      resetState();
      onClose();

      // IMPORTANT
      // refresh products list
    } catch (err: any) {
      console.error("IMPORT ERROR:", err);
      showToast(err?.response?.data?.message || "Import failed", "error");
    }
  };

  // =====================================
  // RESET
  // =====================================
  const resetState = () => {
    setFile(null);
    setPreviewData(null);
    setMode("skip");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          resetState();
          onClose();
        }
      }}
    >
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 sm:rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <DialogTitle className="text-base font-semibold text-slate-800">
            Import Products
          </DialogTitle>
        </DialogHeader>

        {/* ===================================== */}
        {/* UPLOAD AREA */}
        {/* ===================================== */}
        <Card
          className={cn(
            "border border-dashed border-slate-300 bg-white hover:bg-slate-50/50 p-6 transition-all cursor-pointer rounded-md text-center shadow-none"
          )}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <Upload className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Upload Excel File
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                XLSX, XLS or CSV supported
              </p>
            </div>

            {file && (
              <div className="mt-1 flex items-center gap-2 rounded bg-slate-100 px-2.5 py-1 text-slate-600 border border-slate-200">
                <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs font-medium truncate max-w-[200px]">
                  {file.name}
                </span>
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            hidden
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                handleFile(selected);
              }
            }}
          />
        </Card>

        {/* ===================================== */}
        {/* LOADING */}
        {/* ===================================== */}
        {previewMutation.isPending && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        )}

        {/* ===================================== */}
        {/* PREVIEW */}
        {/* ===================================== */}
        {previewData && (
          <div className="space-y-4">
            
            {/* SUMMARY GRID */}
            <div className="grid grid-cols-3 gap-3">
              <SummaryCard
                title="Rows"
                value={previewData?.summary?.totalRows ?? 0}
              />
              <SummaryCard
                title="Products"
                value={previewData?.summary?.totalProducts ?? 0}
              />
              <SummaryCard
                title="Variants"
                value={previewData?.summary?.totalVariants ?? 0}
              />
              <SummaryCard
                title="Simple"
                value={previewData?.summary?.simpleProducts ?? 0}
              />
              <SummaryCard
                title="Variable"
                value={previewData?.summary?.variableProducts ?? 0}
              />
              <SummaryCard
                title="Errors"
                value={previewData?.summary?.totalErrors ?? 0}
                isError={Boolean(previewData?.summary?.totalErrors)}
              />
            </div>

            {/* VALIDATION STATUS */}
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2 mb-1.5">
                {previewData?.validation?.valid ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                )}
                <h3 className="text-xs font-semibold text-slate-700">
                  Validation Status
                </h3>
              </div>

              {previewData?.validation?.valid ? (
                <p className="text-xs text-emerald-600 font-medium">
                  File validated successfully
                </p>
              ) : (
               <ImportValidationErrors
  errors={
    previewData?.validation
      ?.errors ?? []
  }
/>
              )}
            </div>

            {/* IMPORT MODE SELECTION */}
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <h3 className="text-xs font-semibold text-slate-700 mb-2">
                Import Mode
              </h3>
              <div className="flex gap-2">
                {["skip", "override", "restore"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item as ImportMode)}
                    className={cn(
                      "rounded px-3 py-1.5 text-xs font-medium capitalize transition-all border",
                      mode === item
                        ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                        : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS FOOTER */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="secondary"
                className="h-8 text-xs px-3 border-slate-200 text-slate-600 hover:bg-slate-50"
                onClick={() => {
                  resetState();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !previewData?.validation?.valid || importMutation.isPending
                }
                onClick={handleImport}
                className="h-8 text-xs px-3 bg-teal-600 hover:bg-teal-700 text-white disabled:bg-slate-100 disabled:text-slate-400 border border-transparent"
              >
                {importMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Import Products"
                )}
              </Button>
            </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// =====================================
// POLISHED SUMMARY CARD
// =====================================
function SummaryCard({
  title,
  value,
  isError = false,
}: {
  title: string;
  value: number;
  isError?: boolean;
}) {
  return (
    <Card className={cn(
      "p-3 rounded-md bg-white border shadow-none flex flex-col justify-between min-h-[68px]",
      isError && value > 0 ? "border-rose-200 bg-rose-50/20" : "border-slate-200"
    )}>
      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        {title}
      </p>
      <h3 className={cn(
        "text-xl font-bold tracking-tight mt-1",
        isError && value > 0 ? "text-rose-600" : "text-slate-800"
      )}>
        {value}
      </h3>
    </Card>
  );
}