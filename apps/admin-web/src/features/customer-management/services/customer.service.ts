import { customerApi } from "@/features/customer-management/api/customer.api";

import {
  showError,
  showSuccess,
} from "@/shared/store/toast.store";

class CustomerService {
  async getCustomers(
    search?: string,
    page = 1,
    limit = 20
  ) {
    try {
      return await customerApi.getAll(
        search,
        page,
        limit
      );
    } catch (error) {
      showError(
        "Failed to load customers"
      );

      throw error;
    }
  }

  async getCustomer(
    customerId: string
  ) {
    try {
      return await customerApi.getById(
        customerId
      );
    } catch (error) {
      showError(
        "Failed to load customer"
      );

      throw error;
    }
  }

  async getAnalytics() {
    try {
      return await customerApi.getAnalytics();
    } catch (error) {
      showError(
        "Failed to load analytics"
      );

      throw error;
    }
  }

  async deactivateCustomer(
    customerId: string
  ) {
    try {
      const response =
        await customerApi.deactivate(
          customerId
        );

      showSuccess(
        "Customer deactivated"
      );

      return response;
    } catch (error) {
      showError(
        "Failed to deactivate customer"
      );

      throw error;
    }
  }
}

export const customerService =
  new CustomerService();