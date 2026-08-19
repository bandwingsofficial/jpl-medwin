"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Search,
} from "lucide-react";

import { Input } from "@/shared/components/ui/input";

import { Customer } from "@/features/customer-management/types/customer.types";

import { useCustomers } from "@/features/customer-management/hooks/use-customers";
import { useCustomerAnalytics } from "@/features/customer-management/hooks/use-customer-analytics";
import { useCustomerActions } from "@/features/customer-management/hooks/use-customer-actions";

import { CustomerTable } from "@/features/customer-management/components/customer-table";
import { CustomerAnalyticsCards } from "@/features/customer-management/components/customer-analytics-cards";
import { DeactivateCustomerDialog } from "@/features/customer-management/components/deactivate-customer-dialog";

// =========================================
// COMPONENT
// =========================================

export function CustomerPage() {
  const router = useRouter();

  // =========================================
  // SEARCH
  // =========================================

  const [search, setSearch] = useState("");

  // =========================================
  // CUSTOMERS
  // =========================================

  const {
    customers,
    isLoading,
    refresh,
  } = useCustomers({
    search,
  });

  // =========================================
  // ANALYTICS
  // =========================================

  const {
    analytics,
  } = useCustomerAnalytics();

  // =========================================
  // ACTIONS
  // =========================================

  const {
    deactivateCustomer,
  } = useCustomerActions();

  // =========================================
  // DIALOG STATE
  // =========================================

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState<Customer | null>(null);

  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  // =========================================
  // VIEW CUSTOMER
  // =========================================

  function handleView(
    customer: Customer
  ) {
    router.push(
      `/customers/${customer.id}`
    );
  }

  // =========================================
  // DEACTIVATE CUSTOMER
  // =========================================

  function handleDeactivate(
    customer: Customer
  ) {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  }

  // =========================================
  // CONFIRM DEACTIVATE
  // =========================================

  async function confirmDeactivate() {
    if (!selectedCustomer) {
      return;
    }

    try {
      setActionLoading(true);

      await deactivateCustomer(
        selectedCustomer.id
      );

      setDialogOpen(false);

      refresh();
    } finally {
      setActionLoading(false);
    }
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="space-y-5">

      {/* ===================================== */}
      {/* BREADCRUMBS */}
      {/* ===================================== */}

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

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        <span className="font-semibold text-teal-600">
          Customers
        </span>
      </div>

      {/* ===================================== */}
      {/* PAGE HEADER */}
      {/* ===================================== */}

      <div
        className="
          flex
          items-end
          justify-between
          gap-6
        "
      >

        {/* --------------------------------- */}
        {/* LEFT - TITLE */}
        {/* --------------------------------- */}

        <div className="min-w-0">
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
              leading-tight
              text-transparent
            "
          >
            Customers
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage platform customers
          </p>
        </div>

        {/* --------------------------------- */}
        {/* RIGHT - SEARCH */}
        {/* --------------------------------- */}

        <div className="w-full max-w-[360px] shrink-0">
          <div className="relative">
            <Search
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="
                h-11
                rounded-xl
                border-slate-200
                bg-white
                pl-10
                pr-4
                text-sm
                shadow-sm
                placeholder:text-slate-400
                focus-visible:ring-1
                focus-visible:ring-teal-500
              "
            />
          </div>
        </div>

      </div>

      {/* ===================================== */}
      {/* ANALYTICS */}
      {/* ===================================== */}

      {analytics && (
        <CustomerAnalyticsCards
          analytics={analytics}
        />
      )}

      {/* ===================================== */}
      {/* CUSTOMER TABLE */}
      {/* ===================================== */}

      <CustomerTable
        data={customers}
        isLoading={isLoading}
        onView={handleView}
        onDeactivate={handleDeactivate}
      />

      {/* ===================================== */}
      {/* DEACTIVATE DIALOG */}
      {/* ===================================== */}

      <DeactivateCustomerDialog
        open={dialogOpen}
        customer={selectedCustomer}
        isLoading={actionLoading}
        onConfirm={confirmDeactivate}
        onOpenChange={setDialogOpen}
      />

    </div>
  );
}