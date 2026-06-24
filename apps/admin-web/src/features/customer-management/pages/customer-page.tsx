"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { Customer } from "@/features/customer-management/types/customer.types";

import { useCustomers } from "@/features/customer-management/hooks/use-customers";
import { useCustomerAnalytics } from "@/features/customer-management/hooks/use-customer-analytics";
import { useCustomerActions } from "@/features/customer-management/hooks/use-customer-actions";

import { CustomerTable } from "@/features/customer-management/components/customer-table";
import { CustomerAnalyticsCards } from "@/features/customer-management/components/customer-analytics-cards";
import { DeactivateCustomerDialog } from "@/features/customer-management/components/deactivate-customer-dialog";

export function CustomerPage() {
  const router =
    useRouter();

  const [
    search,
    setSearch,
  ] = useState("");

  const {
    customers,
    isLoading,
    refresh,
  } = useCustomers({
    search,
  });

  const {
    analytics,
  } =
    useCustomerAnalytics();

  const {
    deactivateCustomer,
  } =
    useCustomerActions();

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] =
    useState<Customer | null>(
      null
    );

  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  function handleView(
    customer: Customer
  ) {
    router.push(
      `/customers/${customer.id}`
    );
  }

  function handleDeactivate(
    customer: Customer
  ) {
    setSelectedCustomer(
      customer
    );

    setDialogOpen(true);
  }

  async function confirmDeactivate() {
    if (
      !selectedCustomer
    ) {
      return;
    }

    try {
      setActionLoading(
        true
      );

      await deactivateCustomer(
        selectedCustomer.id
      );

      setDialogOpen(
        false
      );

      refresh();
    } finally {
      setActionLoading(
        false
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="
              animate-text-shine
              bg-gradient-to-r 
              from-[#001f3f] 
              via-[#0d9488] 
              to-[#001f3f] 
              bg-clip-text 
              text-[28px] 
              font-bold 
              text-transparent
            ">
          Customers
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage platform customers
        </p>
      </div>

      {analytics && (
        <CustomerAnalyticsCards
          analytics={
            analytics
          }
        />
      )}

      <Input
        placeholder="Search customers..."
        value={search}
        onChange={(
          e
        ) =>
          setSearch(
            e.target.value
          )
        }
      />

      <CustomerTable
        data={customers}
        isLoading={
          isLoading
        }
        onView={
          handleView
        }
        onDeactivate={
          handleDeactivate
        }
      />

      <DeactivateCustomerDialog
        open={
          dialogOpen
        }
        customer={
          selectedCustomer
        }
        isLoading={
          actionLoading
        }
        onConfirm={
          confirmDeactivate
        }
        onOpenChange={
          setDialogOpen
        }
      />
    </div>
  );
}