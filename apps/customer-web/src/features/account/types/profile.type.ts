export interface CustomerProfile {
  id: string;

  userId: string;

  name: string;

  email: string;

  // ✅ PHONE NUMBER
  phoneNumber: string | null;

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
  name: string;

  email: string;

  // ✅ PHONE NUMBER
  phoneNumber?: string;

  avatar?: File | null;
}