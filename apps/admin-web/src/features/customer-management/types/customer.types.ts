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

  salutation?: 'Dr' | 'Mr' | 'Ms' | 'Mrs' | string;

  firstName?: string;

  lastName?: string;

  name?: string;

  email?: string;

  phoneNumber?: string;

  customerType?:
    | 'Dentist'
    | 'Clinic'
    | 'Hospital'
    | 'Dealer'
    | 'Other'
    | string;

  clinicHospitalName?: string;

  whatsappNumber?: string;

  gstNumber?: string;

  avatarUrl?: string;
}

export type CustomerAddressType = "HOME" | "WORK" | "OTHER";

export interface CustomerAddress {
  id: string;

  type: CustomerAddressType;

  alias?: string;

  fullName?: string;

  phoneNumber: string;

  addressLine1: string;

  addressLine2?: string;

  landmark?: string;

  city: string;

  state: string;

  country: string;

  postalCode: string;

  latitude?: number;

  longitude?: number;

  isDefault: boolean;

  createdAt: string;

  updatedAt: string;
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

  addresses: CustomerAddress[];

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