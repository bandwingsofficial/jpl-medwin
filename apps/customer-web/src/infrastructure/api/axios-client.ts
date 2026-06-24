import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;

let queue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any) => {
  queue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null);
    }
  });

  queue = [];
};

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error?.config;

    // ========================================
    // SAFE GUARD
    // ========================================

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const errorCode =
      error?.response?.data?.errorCode;

    // ========================================
    // NEVER REFRESH REFRESH API
    // ========================================

    if (
      originalRequest?.url?.includes(
        "/auth/refresh"
      )
    ) {
      return Promise.reject(error);
    }

    // ========================================
    // SESSION REVOKED
    // ========================================

    if (
      errorCode === "SESSION.REVOKED"
    ) {
      window.location.href = "/login";

      return Promise.reject(error);
    }

    // ========================================
    // ONLY HANDLE TOKEN ERRORS
    // ========================================

    const status = error?.response?.status; const message = error?.response?.data?.message; const shouldRefresh = status === 401 && !originalRequest.url?.includes( "/auth/login" ) && ( errorCode === "AUTH.INVALID_TOKEN" || errorCode === "AUTH.TOKEN_EXPIRED" || message === "No auth token" );

    if (
      shouldRefresh &&
      !originalRequest._retry
    ) {
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
        ).then(() =>
          apiClient(originalRequest)
        );
      }

      originalRequest._retry = true;

      isRefreshing = true;

      try {
        // ========================================
        // REFRESH TOKEN
        // ========================================

        await apiClient.post(
          "/auth/refresh"
        );

        // ========================================
        // RETRY QUEUED REQUESTS
        // ========================================

        processQueue(null);

        // ========================================
        // RETRY ORIGINAL REQUEST
        // ========================================

        return apiClient(originalRequest);
      } catch (refreshError) {
  processQueue(refreshError);

  if (typeof window !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();

    const currentPath =
      window.location.pathname;

    if (currentPath !== "/login") {
      window.location.replace("/login");
    }
  }

  return Promise.reject(refreshError);
} finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);