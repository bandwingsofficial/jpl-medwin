import { useQuery } from "@tanstack/react-query";

import { authService } from "../services/auth.service";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],

    queryFn: authService.getMe,

    retry: false,

    staleTime: 1000 * 60 * 5, // 5 minutes

    gcTime: 1000 * 60 * 10, // 10 minutes

    refetchOnMount: false,

    refetchOnWindowFocus: false,

    refetchOnReconnect: false,
  });
};