import { create } from "zustand";

import { AdminUser } from "@/features/auth/types/auth.types";

interface AuthState {
  // ✅ USER
  user: AdminUser | null;

  // ✅ ACCESS TOKEN
  // NOTE:
  // Backend uses cookie auth.
  // This token is OPTIONAL UI state only.
  // Never rely on this as source of truth.
  accessToken: string | null;

  // ✅ AUTH STATUS
  isAuthenticated: boolean;

  // =====================================
  // ACTIONS
  // =====================================

  // ✅ SET USER ONLY
  setUser: (
    user: AdminUser | null
  ) => void;

  // ✅ SET FULL AUTH
  setAuth: (
    user: AdminUser,
    accessToken?: string | null
  ) => void;

  // ✅ UPDATE ACCESS TOKEN
  setAccessToken: (
    accessToken: string | null
  ) => void;

  // ✅ CLEAR AUTH
  clearAuth: () => void;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    // =====================================
    // INITIAL STATE
    // =====================================

    user: null,

    accessToken: null,

    isAuthenticated: false,

    // =====================================
    // SET USER
    // =====================================

    setUser: (user) =>
      set((state) => ({
        ...state,

        user,

        isAuthenticated: !!user,
      })),

    // =====================================
    // SET FULL AUTH
    // =====================================

    setAuth: (
      user,
      accessToken = null
    ) =>
      set((state) => ({
        ...state,

        user,

        accessToken,

        isAuthenticated: true,
      })),

    // =====================================
    // UPDATE ACCESS TOKEN
    // =====================================

    setAccessToken: (
      accessToken
    ) =>
      set((state) => ({
        ...state,

        accessToken,
      })),

    // =====================================
    // LOGOUT CLEANUP
    // =====================================

    clearAuth: () =>
      set({
        user: null,

        accessToken: null,

        isAuthenticated: false,
      }),
  }));
