let refreshInterval: NodeJS.Timeout | null = null;

// 🔥 IMPORT SHARED REFRESH
import { silentRefresh } from "@/infrastructure/api/axios-client";

export const startSilentRefresh = () => {
  if (refreshInterval) return;

  // ⚠️ Keep slightly less than backend expiry
  const REFRESH_TIME = 10 * 60 * 1000; // adjust if needed

  refreshInterval = setInterval(async () => {
    try {
      await silentRefresh(); // ✅ USE AXIOS VERSION
    } catch {
      // already handled inside silentRefresh
    }
  }, REFRESH_TIME);
};

export const stopSilentRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};