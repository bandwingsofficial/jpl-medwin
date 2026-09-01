"use client";

import {
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  Loader2,
  RotateCcw,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Home,
  ChevronRight,
  Search,
  Calendar,
} from "lucide-react";

import {
  useReturns,
  useReturnDetails,
} from "../hooks/use-returns";

import { ReturnRequest } from "../types/return.type";

import ReturnTable from "./return-table";

import ReturnDetailsDrawer from "./return-details-drawer";
import Link from "next/link";
import { Input } from "@/shared/components/ui/input";

export default function ReturnsPage() {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    selectedReturnId,
    setSelectedReturnId,
  ] = useState("");

  const [
    drawerOpen,
    setDrawerOpen,
  ] = useState(false);

  const [page, setPage] =
    useState(1);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [dateType, setDateType] = useState<"created" | "updated">("created");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [datePreset, setDatePreset] = useState<string>("all");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handlePresetChange = (preset: string) => {
    setDatePreset(preset);
    setPage(1);
    const now = new Date();
    const format = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (preset === "today") {
      const today = format(now);
      setFromDate(today);
      setToDate(today);
    } else if (preset === "yesterday") {
      const yest = new Date(now);
      yest.setDate(yest.getDate() - 1);
      const yestStr = format(yest);
      setFromDate(yestStr);
      setToDate(yestStr);
    } else if (preset === "7days") {
      const past = new Date(now);
      past.setDate(past.getDate() - 7);
      setFromDate(format(past));
      setToDate(format(now));
    } else if (preset === "30days") {
      const past = new Date(now);
      past.setDate(past.getDate() - 30);
      setFromDate(format(past));
      setToDate(format(now));
    } else if (preset === "thisMonth") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      setFromDate(format(startOfMonth));
      setToDate(format(now));
    } else {
      setFromDate("");
      setToDate("");
    }
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setType("");
    setFromDate("");
    setToDate("");
    setDateType("created");
    setDatePreset("all");
    setPage(1);
  };

  const activeFilterCount =
    (fromDate ? 1 : 0) +
    (toDate ? 1 : 0) +
    (status ? 1 : 0) +
    (type ? 1 : 0) +
    (search ? 1 : 0);

  /*
  |--------------------------------------------------------------------------
  | RETURNS QUERY
  |--------------------------------------------------------------------------
  */

  const {
    data,
    isLoading,
    error,
  } = useReturns({
    page,
    limit: 1000000,
    search,
    status,
    type,
    from: fromDate,
    to: toDate,
    dateType,
  });

  /*
  |--------------------------------------------------------------------------
  | RETURN DETAILS
  |--------------------------------------------------------------------------
  */

  const {
    data: selectedReturn,
    isLoading:
      returnDetailsLoading,
  } = useReturnDetails(
    selectedReturnId
  );

  /*
  |--------------------------------------------------------------------------
  | SAFE DATA
  |--------------------------------------------------------------------------
  */

  const returns =
    Array.isArray(
      data?.returns
    )
      ? data.returns
      : [];

  /*
  |--------------------------------------------------------------------------
  | VIEW RETURN
  |--------------------------------------------------------------------------
  */

  const handleViewReturn =
    (
      returnRequest: ReturnRequest
    ) => {
      setSelectedReturnId(
        returnRequest.id
      );

      setDrawerOpen(true);
    };

  /*
  |--------------------------------------------------------------------------
  | STATS
  |--------------------------------------------------------------------------
  */

  const stats = useMemo(
    () => {
      return {
        total:
          returns.length,

        requested:
          returns.filter(
            (
              r
            ) =>
              r.status ===
              "REQUESTED"
          ).length,

        approved:
          returns.filter(
            (
              r
            ) =>
              r.status ===
              "APPROVED"
          ).length,

        completed:
          returns.filter(
            (
              r
            ) =>
              r.status ===
              "COMPLETED"
          ).length,
      };
    },
    [returns]
  );

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (
    isLoading &&
    !data
  ) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2
          size={34}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-lg font-bold text-red-600">
          Failed to load returns
        </h2>
      </div>
    );
  }

  return (
    <>
      <div
  className="
    w-full
    min-w-0
    overflow-hidden
    space-y-5
    px-1
    pb-2
    md:px-2
    md:pb-5
  "
>
  {/* BREADCRUMBS */}

    <div className="flex items-center gap-2 text-sm">
      <Link
        href="/"
        className="
          inline-flex
          items-center
          gap-1.5
          font-medium
          text-slate-500
          transition-colors
          hover:text-teal-600
        "
      >
        <Home className="h-4 w-4" />
        Home
      </Link>

      <ChevronRight className="h-4 w-4 text-slate-300" />

      <span className="font-semibold text-teal-600">
        Order Returns
      </span>
    </div>

        {/* HEADER */}

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Return Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage customer returns and replacements
          </p>
        </div>

        {/* STATS */}
<div className="grid gap-4 md:grid-cols-4">
  {/* Total Returns */}
  <div className="rounded-xl border bg-white p-4 flex justify-between items-start">
    <div>
      <span className="text-sm font-medium text-gray-400">
        Total Returns
      </span>
      <p className="mt-1 text-2xl font-bold text-gray-900">
        {stats.total}
      </p>
    </div>
    <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-blue-50 text-blue-600">
      <RotateCcw size={20} />
    </div>
  </div>

  {/* Requested */}
  <div className="rounded-xl border bg-white p-4 flex justify-between items-start">
    <div>
      <span className="text-sm font-medium text-gray-400">
        Requested
      </span>
      <p className="mt-1 text-2xl font-bold text-amber-600">
        {stats.requested}
      </p>
    </div>
    <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-amber-50 text-amber-600">
      <Clock3 size={20} />
    </div>
  </div>

  {/* Approved */}
  <div className="rounded-xl border bg-white p-4 flex justify-between items-start">
    <div>
      <span className="text-sm font-medium text-gray-400">
        Approved
      </span>
      <p className="mt-1 text-2xl font-bold text-emerald-600">
        {stats.approved}
      </p>
    </div>
    <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
      <CheckCircle2 size={20} />
    </div>
  </div>

  {/* Completed */}
  <div className="rounded-xl border bg-white p-4 flex justify-between items-start">
    <div>
      <span className="text-sm font-medium text-gray-400">
        Completed
      </span>
      <p className="mt-1 text-2xl font-bold text-purple-600">
        {stats.completed}
      </p>
    </div>
    <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-purple-50 text-purple-600">
      <PackageCheck size={20} />
    </div>
  </div>
</div>

        {/* ========================================================= */}
        {/* ADVANCED SEARCH & FILTERS PANEL */}
        {/* ========================================================= */}
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3.5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            
            {/* SEARCH + STATUS + TYPE */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative min-w-[240px] flex-1 max-w-sm">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search Return ID / Order ID..."
                  className="h-8.5 pl-9 text-xs bg-gray-50/50 border-gray-200 rounded-lg focus:bg-white"
                />
                {isLoading && (
                  <Loader2
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-teal-600"
                  />
                )}
              </div>

              {/* STATUS FILTER */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Status:</span>
                <select
                  value={status}
                  onChange={(e) => {
                    setPage(1);
                    setStatus(e.target.value);
                  }}
                  className="h-8.5 rounded-lg border border-gray-200 bg-gray-50/50 px-2.5 text-xs font-medium text-gray-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="">All Statuses</option>
                  <option value="REQUESTED">Requested</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PICKED_UP">Picked Up</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* TYPE FILTER */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Type:</span>
                <select
                  value={type}
                  onChange={(e) => {
                    setPage(1);
                    setType(e.target.value);
                  }}
                  className="h-8.5 rounded-lg border border-gray-200 bg-gray-50/50 px-2.5 text-xs font-medium text-gray-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="">All Types</option>
                  <option value="REFUND">Refund</option>
                </select>
              </div>
            </div>

            {/* DATE TYPE TOGGLE */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <Calendar size={14} className="text-teal-600" />
                Filter By:
              </span>
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setDateType("created");
                    setPage(1);
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    dateType === "created"
                      ? "bg-teal-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Created Time
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateType("updated");
                    setPage(1);
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    dateType === "updated"
                      ? "bg-teal-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Updated Time
                </button>
              </div>
            </div>

          </div>

          {/* DATE RANGE & PRESETS ROW */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pt-2 border-t border-gray-100">
            {/* QUICK PRESETS */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-1">
                Presets:
              </span>
              {[
                { label: "All Time", value: "all" },
                { label: "Today", value: "today" },
                { label: "Yesterday", value: "yesterday" },
                { label: "Last 7 Days", value: "7days" },
                { label: "Last 30 Days", value: "30days" },
                { label: "This Month", value: "thisMonth" },
              ].map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => handlePresetChange(p.value)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                    datePreset === p.value
                      ? "bg-teal-50 text-teal-700 border border-teal-200 font-semibold"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* DATE INPUTS & RESET */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* FROM DATE */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-500 whitespace-nowrap">From:</span>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setDatePreset("custom");
                    setPage(1);
                    setFromDate(e.target.value);
                  }}
                  className="h-8.5 w-[140px] text-xs bg-gray-50/50 border-gray-200 rounded-lg focus:bg-white"
                />
              </div>

              {/* TO DATE */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-500 whitespace-nowrap">To:</span>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setDatePreset("custom");
                    setPage(1);
                    setToDate(e.target.value);
                  }}
                  className="h-8.5 w-[140px] text-xs bg-gray-50/50 border-gray-200 rounded-lg focus:bg-white"
                />
              </div>

              {/* RESET BUTTON */}
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 h-8.5 rounded-lg border border-red-200 bg-red-50/70 px-2.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                >
                  <RotateCcw size={12} />
                  Reset ({activeFilterCount})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABLE */}

        <ReturnTable
          returns={returns}
          onView={
            handleViewReturn
          }
        />
      </div>

      {/* DRAWER */}

      <ReturnDetailsDrawer
        open={drawerOpen}
        returnData={
          selectedReturn
        }
        loading={
          returnDetailsLoading
        }
        onClose={() => {
          setDrawerOpen(false);

          setSelectedReturnId(
            ""
          );
        }}
      />
    </>
  );
}