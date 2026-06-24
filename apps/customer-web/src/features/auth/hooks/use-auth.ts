"use client";

import { useMe } from "./use-me";

export const useAuth = () => {
  const { data, isLoading, isError } = useMe();

  return {
    user: data?.data?.user || null,
    isAuthenticated: !!data?.data?.user,
    isLoading,
    isError,
  };
};