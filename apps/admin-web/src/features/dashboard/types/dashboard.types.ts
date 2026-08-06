export interface OrdersDashboardResponse {
  success: boolean;
  message: string;
  period: string;

  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  returnedOrders: number;
  unitsSold: number;
}

export interface OrderStatusDashboardResponse {
  success: boolean;
  message: string;
  period: string;

  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  refunded: number;
  returned: number;
}

export interface RevenueDashboardResponse {
  success: boolean;
  message: string;
  period: string;

  grossRevenue: number;
  netRevenue: number;
  refundedRevenue: number;
  averageOrderValue: number;
}

export type DashboardPeriod =
  | "today"
  | "week"
  | "month"
  | "year";

export interface DashboardFilters {
  period?: DashboardPeriod;
  from?: string;
  to?: string;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  grandTotal: number;
  createdAt: string;
}

export interface RecentOrdersResponse {
  success: boolean;
  message: string;
  period: string;
  count: number;
  orders: RecentOrder[];
}

export interface TopProduct {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface TopProductsResponse {
  success: boolean;
  message: string;
  period: string;
  count: number;
  products: TopProduct[];
}

export interface TopCustomer {
  userId: string;
  totalOrders: number;
  totalSpent: number;
}

export interface TopCustomersResponse {
  success: boolean;
  message: string;
  period: string;
  count: number;
  customers: TopCustomer[];
}
export interface RevenueTrendItem {
  month: string;
  netRevenue: number;
}

export interface RevenueTrendResponse {
  success: boolean;
  message: string;
  months: RevenueTrendItem[];
}