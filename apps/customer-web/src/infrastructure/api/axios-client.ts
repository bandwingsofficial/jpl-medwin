import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15000,
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

const PROTECTED_ROUTES = [
  "/account",
  "/checkout",
];

const isProtectedRoute = (pathname: string) => {
  return PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
};

apiClient.interceptors.request.use(
  (config) => {
    console.log("🚀 AXIOS REQUEST:", {
      method: config.method,
      url: `${config.baseURL}${config.url}`,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("❌ AXIOS REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(
      "✅ API RESPONSE:",
      response.config.method?.toUpperCase(),
      response.config.url,
      response.status
    );

    return response;
  },

  async (error) => {
    const originalRequest = error?.config;

    console.log(
      "❌ API ERROR:",
      originalRequest?.method?.toUpperCase(),
      originalRequest?.url,
      error?.response?.status,
      error?.response?.data
    );

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const errorCode = error?.response?.data?.errorCode;
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      console.log("❌ REFRESH API FAILED");
      return Promise.reject(error);
    }

    if (errorCode === "SESSION.REVOKED") {
      console.log("❌ SESSION REVOKED");

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        if (isProtectedRoute(currentPath)) {
          window.location.replace("/login");
        }
      }

      return Promise.reject(error);
    }

    const shouldRefresh =
      status === 401 &&
      !originalRequest.url?.includes("/auth/login") &&
      (
        errorCode === "AUTH.INVALID_TOKEN" ||
        errorCode === "AUTH.TOKEN_EXPIRED" ||
        message === "No auth token"
      );

    if (
      shouldRefresh &&
      !originalRequest._retry
    ) {
      console.log(
        "🔄 TOKEN ERROR → REFRESHING:",
        originalRequest.url
      );

      if (isRefreshing) {
        console.log("⏳ ALREADY REFRESHING → QUEUING");

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
        console.log("🔄 CALLING /auth/refresh");

        await apiClient.post("/auth/refresh");

        console.log("✅ /auth/refresh SUCCESS");

        processQueue(null);

        console.log(
          "🔁 RETRYING:",
          originalRequest.url
        );

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log(
          "❌ /auth/refresh ERROR:",
          refreshError
        );

        processQueue(refreshError);

        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          sessionStorage.clear();

          const currentPath =
            window.location.pathname;

          if (isProtectedRoute(currentPath)) {
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