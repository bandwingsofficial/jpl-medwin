export type ReturnType =
  | "REFUND";

export type ReturnStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PICKED_UP"
  | "COMPLETED";

export interface ReturnPickup {
  pickedUpAt?: string;
}

export interface ReturnRequest {
  id: string;

  orderId: string;

  userId?: string;

  type: ReturnType;

  reason: string;

  status: ReturnStatus;

  metadata?: Record<
    string,
    any
  >;

  approvedAt?: string;

  completedAt?: string;

  pickup?: ReturnPickup;

  createdAt: string;

  updatedAt: string;
}

export interface ReturnPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

export interface ReturnsResponse {
  returns: ReturnRequest[];

  pagination: ReturnPagination;
}