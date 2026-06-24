"use client";

import {
  customerService,
} from "@/features/customer-management/services/customer.service";

export function useCustomerActions() {
  async function deactivateCustomer(
    customerId: string
  ) {
    return customerService.deactivateCustomer(
      customerId
    );
  }

  return {
    deactivateCustomer,
  };
}