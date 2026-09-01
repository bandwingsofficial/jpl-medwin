"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

import { ProductExportApi } from "../api/product-export.api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface ExportProductsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ExportProductsDialog({
  open,
  onClose,
}: ExportProductsDialogProps) {
  const [exportType, setExportType] = useState<"created-at" | "updated-at">(
    "created-at"
  );
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [exporting, setExporting] = useState(false);

  const resetForm = () => {
    setExportType("created-at");
    setFromDate("");
    setToDate("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleExport = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date.");
      return;
    }

    try {
      setExporting(true);

      const from = `${fromDate}T00:00:00.000Z`;
      const to = `${toDate}T23:59:59.999Z`;

      await ProductExportApi.exportProducts({
        exportType,
        fromDate: from,
        toDate: to,
      });

      handleClose();
    } catch (error) {
      console.error(error);
      alert("Failed to export products.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl bg-white p-0 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Fixed Header */}
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100">
          <DialogTitle className="text-xl font-semibold text-zinc-900">
            Export Products
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-sm mt-1">
            Export products by Created Date or Updated Date.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Container with standard heights */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 max-h-[55vh] scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
          {/* EXPORT TYPE */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Export Type
            </label>
            <select
              value={exportType}
              onChange={(e) =>
                setExportType(e.target.value as "created-at" | "updated-at")
              }
              className="w-full h-11 px-3 bg-white border border-zinc-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
            >
              <option value="created-at">Created Products</option>
              <option value="updated-at">Updated Products</option>
            </select>
          </div>

          {/* FROM DATE */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              From Date
            </label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full h-11 px-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
            />
          </div>

          {/* TO DATE */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              To Date
            </label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full h-11 px-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
            />
          </div>
        </div>

        {/* Fixed Footer with matching color and dimensions */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 flex items-center gap-3 sm:justify-end bg-zinc-50/50">
          <Button
            type="button"
            disabled={exporting}
            onClick={handleClose}
            className="bg-[#00a389] hover:bg-[#008f78] text-white px-5 h-10 rounded-md text-sm font-medium transition-colors"
          >
            Cancel
          </Button>

          <Button
            disabled={exporting}
            onClick={handleExport}
            className="bg-[#00a389] hover:bg-[#008f78] text-white px-5 h-10 gap-2 rounded-md text-sm font-medium transition-colors"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export Excel
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}