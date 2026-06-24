import axios from "axios";

import { useAuthStore } from "@/shared/store/auth.store";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  withCredentials: true,
});

let isRefreshing = false;

let queue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

// ========================================
// PROCESS QUEUE
// ========================================

const processQueue = (error: any) => {
  queue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(null);
    }
  });

  queue = [];
};

// ========================================
// SAFE LOGIN REDIRECT
// ========================================

const redirectToLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  // ✅ PREVENT LOGIN LOOP
  if (
    window.location.pathname ===
    "/login"
  ) {
    return;
  }

  window.location.href = "/login";
};

// ========================================
// REQUEST INTERCEPTOR
// ========================================

apiClient.interceptors.request.use(
  (config) => {
    const accessToken =
      useAuthStore.getState().accessToken;

    // OPTIONAL FALLBACK HEADER
    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// SILENT REFRESH
// ========================================

export const silentRefresh =
  async () => {
    // ========================================
    // WAIT FOR EXISTING REFRESH
    // ========================================

    if (isRefreshing) {
      return new Promise(
        (resolve, reject) => {
          queue.push({
            resolve,
            reject,
          });
        }
      );
    }

    isRefreshing = true;

    try {
      // ========================================
      // REFRESH TOKEN
      // ========================================

      await apiClient.post(
        "/auth/refresh"
      );

      // ========================================
      // RELEASE WAITING REQUESTS
      // ========================================

      processQueue(null);
    } catch (err) {
      // ========================================
      // FAIL WAITING REQUESTS
      // ========================================

      processQueue(err);

      console.warn(
        "❌ Silent refresh failed"
      );

      // ========================================
      // CLEAR AUTH
      // ========================================

      useAuthStore
        .getState()
        .clearAuth();

      // ========================================
      // REDIRECT LOGIN
      // ========================================

      redirectToLogin();

      throw err;
    } finally {
      isRefreshing = false;
    }
  };

// ========================================
// RESPONSE INTERCEPTOR
// ========================================

apiClient.interceptors.response.use(
  (res) => res,

  async (error) => {
    const originalRequest =
      error?.config;

    // ========================================
    // SAFE GUARD
    // ========================================

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // ========================================
    // NEVER REFRESH THESE ROUTES
    // ========================================

    if (
      originalRequest?.url?.includes(
        "/auth/logout"
      ) ||
      originalRequest?.url?.includes(
        "/auth/refresh"
      ) ||
      originalRequest?.url?.includes(
        "/auth/admin/login"
      )
    ) {
      return Promise.reject(error);
    }

    const status =
      error?.response?.status;

    const errorCode =
      error?.response?.data
        ?.errorCode;

    const message =
      error?.response?.data
        ?.message;

    // ========================================
    // SESSION REVOKED
    // ========================================

    if (
      errorCode ===
      "SESSION.REVOKED"
    ) {
      useAuthStore
        .getState()
        .clearAuth();

      redirectToLogin();

      return Promise.reject(error);
    }

    // ========================================
    // TOKEN EXPIRED / MISSING
    // ========================================

    const shouldRefresh =
      status === 401 &&
      (
        errorCode ===
          "AUTH.INVALID_TOKEN" ||
        errorCode ===
          "AUTH.TOKEN_EXPIRED" ||
        message ===
          "No auth token"
      );

    // ========================================
    // REFRESH FLOW
    // ========================================

    if (
      shouldRefresh &&
      !originalRequest._retry
    ) {
      // ========================================
      // MARK RETRY
      // ========================================

      originalRequest._retry = true;

      try {
        // ========================================
        // SILENT REFRESH
        // ========================================

        await silentRefresh();

        // ========================================
        // RETRY ORIGINAL REQUEST
        // ========================================

        return apiClient(
          originalRequest
        );
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
