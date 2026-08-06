"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Loader2,
  RotateCcw,
  CheckCircle2,
  Clock3,
  PackageCheck,
} from "lucide-react";

import {
  useReturns,
  useReturnDetails,
} from "../hooks/use-returns";

import { ReturnRequest } from "../types/return.type";

import ReturnTable from "./return-table";

import ReturnDetailsDrawer from "./return-details-drawer";

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

  const [page] =
    useState(1);

  /*
  |--------------------------------------------------------------------------
  | RETURNS QUERY
  |--------------------------------------------------------------------------
  */

  const {
    data,
    isLoading,
    error,
  } = useReturns(
    page,
    10
  );

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
          p-4
          md:p-5
        "
      >
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