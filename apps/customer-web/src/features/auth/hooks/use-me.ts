import { useQuery } from "@tanstack/react-query";

import { authService } from "../services/auth.service";

export const useMe = () => {
  const hasToken =
    typeof window !== "undefined" &&
    !!localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["me"],

    queryFn: authService.getMe,

    enabled: hasToken,

    retry: false,

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 10,

    refetchOnMount: false,

    refetchOnWindowFocus: false,

    refetchOnReconnect: false,
  });
};