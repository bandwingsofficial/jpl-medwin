"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { coinApi } from "@/infrastructure/api/coin.api";

export const useCampaigns =
  () => {
    return useQuery({
      queryKey: [
        "coin-campaigns",
      ],

      queryFn:
        coinApi.getCampaigns,
    });
  };

export const useCreateCampaign =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        coinApi.createCampaign,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-campaigns",
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "coin-analytics",
            ],
          }
        );
      },
    });
  };