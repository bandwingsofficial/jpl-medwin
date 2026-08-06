export interface Customer {
  id: string;

  role: string;

  name?: string;

  email?: string;

  phoneNumber?: string;

  avatarUrl?: string;

  isActive: boolean;

  totalOrders: number;

  totalSpent: number;

  createdAt: string;
}

export interface CustomerIdentity {
  id: string;

  type: string;

  value: string;

  isVerified: boolean;

  isTotpEnabled: boolean;
}

export interface CustomerProfile {
  id: string;

  name?: string;

  email?: string;

  phoneNumber?: string;

  avatarUrl?: string;
}

export interface CustomerDetail {
  id: string;

  role: string;

  isActive: boolean;

  tokenVersion: number;

  profile: CustomerProfile | null;

  identities: CustomerIdentity[];

  stats: {
    totalOrders: number;

    totalSpent: number;
  };

  createdAt: string;

  updatedAt: string;
}

export interface CustomerAnalytics {
  totalCustomers: number;

  activeCustomers: number;

  inactiveCustomers: number;

  totalRevenue: number;

  averageOrderValue: number;
}

export interface CustomersResponse {
  customers: Customer[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}