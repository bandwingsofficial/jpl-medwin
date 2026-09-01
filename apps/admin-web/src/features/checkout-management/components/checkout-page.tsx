"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Home,
  Loader2,
  Search,
  ShoppingBag,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Package,
} from "lucide-react";
import { useCheckouts, useCheckoutDetails } from "../hooks/use-checkouts";
import { CheckoutSessionSummary } from "../types/checkout.type";
import CheckoutTable from "./checkout-table";
import CheckoutDetailsDrawer from "./checkout-details-drawer";
import { Input } from "@/shared/components/ui/input";

interface StatusTab {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const STATUS_TABS: StatusTab[] = [
  {
    label: "All Abandoned",
    value: "",
    icon: <ShoppingBag size={15} />,
  },
  {
    label: "Active Sessions",
    value: "ACTIVE",
    icon: <Clock size={15} />,
  },
  {
    label: "Expired Sessions",
    value: "EXPIRED",
    icon: <AlertCircle size={15} />,
  },
];

export default function CheckoutPage() {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */
  const [selectedCheckoutId, setSelectedCheckoutId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Search
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const [activeStatus, setActiveStatus] = useState("");

  /*
  |--------------------------------------------------------------------------
  | CHECKOUTS QUERY
  |--------------------------------------------------------------------------
  */
  const { data, isLoading, isFetching, error } = useCheckouts({
    page,
    limit: 100000,
    search,
    status: activeStatus,
  });

  /*
  |--------------------------------------------------------------------------
  | CHECKOUT DETAILS QUERY
  |--------------------------------------------------------------------------
  */
  const { data: selectedCheckout, isLoading: checkoutDetailsLoading } =
    useCheckoutDetails(selectedCheckoutId);

  const checkouts = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  /*
  |--------------------------------------------------------------------------
  | STATS
  |--------------------------------------------------------------------------
  */
  const stats = useMemo(() => {
    const totalCount = pagination.total || checkouts.length || 0;
    const totalPotentialValue = checkouts.reduce(
      (sum, item) => sum + Number(item.totals.grandTotal ?? 0),
      0
    );
    const totalItemsCount = checkouts.reduce(
      (sum, item) => sum + Number(item.totalQuantity ?? 0),
      0
    );
    const activeCount = checkouts.filter((c) => c.status === "ACTIVE" && !c.isExpired).length;
    const expiredCount = checkouts.filter((c) => c.status === "EXPIRED" || c.isExpired).length;

    return {
      totalCount,
      totalPotentialValue,
      totalItemsCount,
      activeCount,
      expiredCount,
    };
  }, [checkouts, pagination]);

  /*
  |--------------------------------------------------------------------------
  | VIEW ACTION
  |--------------------------------------------------------------------------
  */
  const handleViewCheckout = (checkout: CheckoutSessionSummary) => {
    setSelectedCheckoutId(checkout.id);
    setDrawerOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOADING
  |--------------------------------------------------------------------------
  */
  if (isLoading && !data) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-teal-600" size={36} />
          <p className="text-sm font-medium text-gray-500">
            Loading abandoned checkouts...
          </p>
        </div>
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
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-red-600">
          Failed to load abandoned checkouts
        </h2>
        <p className="mt-1 text-sm text-red-500">
          An error occurred while fetching checkout data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-w-0 space-y-5 px-1 pb-2 md:px-2 md:pb-5">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {/* BREADCRUMBS */}
            <div className="mb-2 flex items-center gap-2 text-sm">
              <a
                href="/"
                className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition-colors hover:text-teal-600"
              >
                <Home className="h-4 w-4" />
                Home
              </a>
              <ChevronRight className="h-4 w-4 text-slate-300" strokeWidth={2} />
              <span className="font-semibold text-teal-600">
                Abandoned Checkouts
              </span>
            </div>

            {/* TITLE */}
            <h1 className="animate-text-shine bg-gradient-to-r from-[#001f3f] via-[#0d9488] to-[#001f3f] bg-clip-text text-[28px] font-bold leading-tight text-transparent">
              Abandoned Checkouts
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track customers who reached checkout with cart products but did not complete an order
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="flex w-full items-center gap-3 lg:w-auto">
            <div className="relative flex-1 lg:w-[320px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by customer, phone, ID..."
                className="pl-9 pr-8"
              />
              {(isLoading || isFetching) && (
                <Loader2
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-teal-600"
                />
              )}
            </div>
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Abandoned
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <ShoppingBag size={16} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-gray-900">
              {stats.totalCount}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              {stats.totalItemsCount} total items left behind
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Potential Value
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <DollarSign size={16} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-gray-900">
              ₹{stats.totalPotentialValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              Combined grand total of checkouts
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Active Checkouts
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock size={16} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-amber-700">
              {stats.activeCount}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              Currently unexpired sessions
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Expired Checkouts
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <AlertCircle size={16} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-slate-700">
              {stats.expiredCount}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              Past session expiry limit
            </p>
          </div>
        </div>

        {/* STATUS TABS */}
        <div className="flex w-max gap-2 py-1">
          {STATUS_TABS.map((tab) => {
            const active = activeStatus === tab.value;

            return (
              <button
                key={tab.label}
                onClick={() => {
                  setPage(1);
                  setActiveStatus(tab.value);
                }}
                className={`
                  flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-4
                  py-2
                  text-xs
                  font-medium
                  transition-all
                  duration-200
                  ${
                    active
                      ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:border-teal-200 hover:bg-teal-50/50 hover:text-teal-700"
                  }
                `}
              >
                {tab.icon && <span className="flex items-center">{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TABLE */}
        <div className="w-full min-w-0 overflow-hidden">
          <CheckoutTable
            checkouts={checkouts}
            onView={handleViewCheckout}
          />
        </div>
      </div>

      {/* DRAWER */}
      <CheckoutDetailsDrawer
        open={drawerOpen}
        checkout={selectedCheckout}
        loading={checkoutDetailsLoading}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCheckoutId("");
        }}
      />
    </>
  );
}
