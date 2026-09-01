export interface CareerApplicationRequest {
  fullName: string;
  mobileNumber: string;
  address: string;
  appliedPosition: string;
  resume: File;
}

export interface CareerApplicationResponse {
  success: boolean;
  message: string;
  messageId: string | null;
}