export type Salutation = 'Dr' | 'Mr' | 'Ms' | 'Mrs';

export type CustomerType =
  | 'Dentist'
  | 'Clinic'
  | 'Hospital'
  | 'Dealer'
  | 'Other';

export interface CustomerProfile {
  id: string;

  userId: string;

  salutation?: Salutation | null;

  firstName?: string | null;

  lastName?: string | null;

  name: string;

  email: string;

  // ✅ PHONE NUMBER
  phoneNumber: string | null;

  customerType?: CustomerType | null;

  clinicHospitalName?: string | null;

  whatsappNumber?: string | null;

  gstNumber?: string | null;

  avatarUrl: string | null;

  createdAt: string;

  updatedAt: string;
}

// =========================================
// API RESPONSE
// =========================================

export interface ProfileResponse {
  success: boolean;

  message: string;

  data: CustomerProfile;
}

// =========================================
// UPDATE PAYLOAD
// =========================================

export interface UpdateProfilePayload {
  salutation?: Salutation | null;

  firstName?: string;

  lastName?: string;

  name?: string;

  email?: string;

  // ✅ PHONE NUMBER
  phoneNumber?: string;

  customerType?: CustomerType | null;

  clinicHospitalName?: string | null;

  whatsappNumber?: string | null;

  gstNumber?: string | null;

  avatar?: File | null;
}