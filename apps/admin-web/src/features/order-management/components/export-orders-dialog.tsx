"use client";

import { useState } from "react";
import { Loader2, Download } from "lucide-react";

import { OrderExportApi } from "../api/order-export.api";

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

interface ExportOrdersDialogProps {
  open: boolean;
  onClose: () => void;
}

const ORDER_STATUS = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
  "RETURNED",
];

const PAYMENT_STATUS = [
  "PENDING",
  "CREATED",
  "AUTHORIZED",
  "CAPTURED",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

export default function ExportOrdersDialog({
  open,
  onClose,
}: ExportOrdersDialogProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      await OrderExportApi.exportOrders({
        from: from || undefined,
        to: to || undefined,
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        search: search.trim() || undefined,
      });

      onClose();

      setFrom("");
      setTo("");
      setStatus("");
      setPaymentStatus("");
      setSearch("");
    } catch (error) {
      console.error(error);
      alert("Failed to export orders.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl bg-white p-0 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Fixed Header */}
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100">
          <DialogTitle className="text-xl font-semibold text-zinc-900">
            Export Orders
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-sm mt-1">
            Select optional filters. Leave everything blank to export all orders.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Container with elegant scrollbar styling */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 max-h-[55vh] scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
          {/* FROM DATE */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              From Date
            </label>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
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
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full h-11 px-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
            />
          </div>

          {/* ORDER STATUS */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Order Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-zinc-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
            >
              <option value="">All Statuses</option>
              {ORDER_STATUS.map((item) => (
                <option key={item} value={item}>
                  {item.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* PAYMENT STATUS */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-zinc-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
            >
              <option value="">All Payment Statuses</option>
              {PAYMENT_STATUS.map((item) => (
                <option key={item} value={item}>
                  {item.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* SEARCH */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Search
            </label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order number or customer name"
              className="w-full h-11 px-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder:text-zinc-400 text-sm"
            />
          </div>
        </div>

        {/* Fixed Footer pinned to the bottom */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 flex items-center gap-3 sm:justify-end bg-zinc-50/50">
          <Button
            type="button"
            onClick={onClose}
            disabled={exporting}
            className="bg-[#00a389] hover:bg-[#008f78] text-white px-5 h-10 rounded-md text-sm font-medium transition-colors"
          >
            Cancel
          </Button>

          <Button
            onClick={handleExport}
            disabled={exporting}
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