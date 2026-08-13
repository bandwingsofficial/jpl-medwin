"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  orderApi,
} from "../api/order.api";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface UseOrdersParams {
  page?: number;

  limit?: number;

  search?: string;

  status?: string;
}

/*
|--------------------------------------------------------------------------
| GET ORDERS
|--------------------------------------------------------------------------
*/

export const useOrders = (
  params?: UseOrdersParams
) => {
  const page =
    params?.page || 1;

  const limit =
    params?.limit || 10;

  const search =
    params?.search || "";

  const status =
    params?.status || "";

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS ORDERS
  |--------------------------------------------------------------------------
  */

  const previousOrderIdsRef =
    useRef<Set<string> | null>(null);

  /*
  |--------------------------------------------------------------------------
  | AUDIO
  |--------------------------------------------------------------------------
  */

  const notificationAudioRef =
    useRef<HTMLAudioElement | null>(null);

  /*
  |--------------------------------------------------------------------------
  | AUDIO UNLOCK
  |--------------------------------------------------------------------------
  */

  const audioUnlockedRef =
    useRef(false);

  /*
  |--------------------------------------------------------------------------
  | INITIALIZE AUDIO
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const audio =
      new Audio(
        "/Sound/Order-sound.mp3"
      );

    audio.preload = "auto";

    audio.volume = 1;

    notificationAudioRef.current =
      audio;

    /*
    |--------------------------------------------------------------------------
    | CHECK AUDIO FILE
    |--------------------------------------------------------------------------
    */

    audio.addEventListener(
      "canplaythrough",
      () => {
        console.log(
          "🔊 Order notification sound loaded successfully"
        );
      }
    );

    audio.addEventListener(
      "error",
      () => {
        console.error(
          "❌ Failed to load order notification sound:",
          "/Sound/Order-sound.mp3"
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | UNLOCK AUDIO AFTER USER INTERACTION
    |--------------------------------------------------------------------------
    */

    const unlockAudio = async () => {
      if (
        audioUnlockedRef.current
      ) {
        return;
      }

      try {
        audio.muted = true;

        await audio.play();

        audio.pause();

        audio.currentTime = 0;

        audio.muted = false;

        audioUnlockedRef.current =
          true;

        console.log(
          "🔊 Order notification audio unlocked"
        );
      } catch (error) {
        console.warn(
          "⚠️ Audio unlock failed:",
          error
        );
      }
    };

    window.addEventListener(
      "pointerdown",
      unlockAudio,
      {
        once: true,
      }
    );

    window.addEventListener(
      "keydown",
      unlockAudio,
      {
        once: true,
      }
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        unlockAudio
      );

      window.removeEventListener(
        "keydown",
        unlockAudio
      );

      audio.pause();

      audio.currentTime = 0;

      notificationAudioRef.current =
        null;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PLAY NEW ORDER SOUND
  |--------------------------------------------------------------------------
  */

  const playNewOrderSound =
    async () => {
      const audio =
        notificationAudioRef.current;

      if (!audio) {
        console.error(
          "❌ Notification audio is not initialized"
        );

        return;
      }

      if (
        !audioUnlockedRef.current
      ) {
        console.warn(
          "⚠️ Notification audio is not unlocked yet. Click the page once."
        );

        return;
      }

      try {
        audio.currentTime = 0;

        await audio.play();

        console.log(
          "🔔 New order notification sound played"
        );
      } catch (error) {
        console.error(
          "❌ Unable to play notification sound:",
          error
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | GET ORDERS
  |--------------------------------------------------------------------------
  */

  const query = useQuery({
    queryKey: [
      "admin-orders",
      page,
      limit,
      search,
      status,
    ],

    queryFn: async () => {
      console.log(
        "🔄 Checking orders..."
      );

      const response =
        await orderApi.getOrders({
          page,
          limit,
          search,
          status,
        });

      console.log(
        "📦 Orders received:",
        response.orders.length
      );

      return response;
    },

    /*
    |--------------------------------------------------------------------------
    | QUERY CONFIG
    |--------------------------------------------------------------------------
    */

    staleTime: 0,

    gcTime:
      1000 * 60 * 30,

    retry: 1,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    refetchOnMount: true,

    /*
    |--------------------------------------------------------------------------
    | CHECK EVERY 10 SECONDS
    |--------------------------------------------------------------------------
    */

    refetchInterval: 10_000,

    refetchIntervalInBackground: true,
  });

  /*
  |--------------------------------------------------------------------------
  | DETECT NEW ORDERS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const orders =
      query.data?.orders;

    if (!orders) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | CURRENT ORDER IDS
    |--------------------------------------------------------------------------
    */

    const currentOrderIds =
      new Set(
        orders.map(
          (order) => order.id
        )
      );

    /*
    |--------------------------------------------------------------------------
    | FIRST LOAD
    |--------------------------------------------------------------------------
    |
    | Important:
    | Existing orders should NOT produce sound.
    |
    */

    if (
      previousOrderIdsRef.current ===
      null
    ) {
      previousOrderIdsRef.current =
        currentOrderIds;

      console.log(
        "📦 Initial order list loaded:",
        orders.length
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | PREVIOUS IDS
    |--------------------------------------------------------------------------
    */

    const previousOrderIds =
      previousOrderIdsRef.current;

    /*
    |--------------------------------------------------------------------------
    | FIND NEW ORDERS
    |--------------------------------------------------------------------------
    */

    const newOrders =
      orders.filter(
        (order) =>
          !previousOrderIds.has(
            order.id
          )
      );

    /*
    |--------------------------------------------------------------------------
    | DEBUG
    |--------------------------------------------------------------------------
    */

    console.log(
      "📊 Previous order count:",
      previousOrderIds.size
    );

    console.log(
      "📊 Current order count:",
      currentOrderIds.size
    );

    console.log(
      "🆕 New orders:",
      newOrders
    );

    /*
    |--------------------------------------------------------------------------
    | PLAY SOUND
    |--------------------------------------------------------------------------
    */

    if (
      newOrders.length > 0
    ) {
      console.log(
        "🔔 NEW ORDER DETECTED"
      );

      console.log(
        "🆕 New order numbers:",
        newOrders.map(
          (order) =>
            order.orderNumber
        )
      );

      void playNewOrderSound();
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE PREVIOUS IDS
    |--------------------------------------------------------------------------
    */

    previousOrderIdsRef.current =
      currentOrderIds;
  }, [
    query.data,
  ]);

  return query;
};
/*
|--------------------------------------------------------------------------
| ORDER DETAILS
|--------------------------------------------------------------------------
*/

export const useOrderDetails = (
  id: string
) => {
  return useQuery({
    queryKey: [
      "admin-order",
      id,
    ],

    queryFn: async () => {
      const response =
        await orderApi.getOrderDetails(
          id
        );

      return response;
    },

    enabled:
      !!id,

    staleTime:
      1000 * 60 * 5,

    gcTime:
      1000 * 60 * 30,

    retry: 1,

    refetchOnWindowFocus:
      false,

    refetchOnReconnect:
      false,

    refetchOnMount:
      false,
  });
};

/*
|--------------------------------------------------------------------------
| PROCESS ORDER
|--------------------------------------------------------------------------
*/

export const useProcessOrder =
  () => {
    const qc =
      useQueryClient();

    return useMutation({
      mutationFn: (
        id: string
      ) =>
        orderApi.processOrder(
          id
        ),

      onSuccess: (
        _data,
        id
      ) => {
        qc.invalidateQueries({
          queryKey: [
            "admin-orders",
          ],
        });

        qc.invalidateQueries({
          queryKey: [
            "admin-order",
            id,
          ],
        });
      },

      onError: (
        error
      ) => {
        console.error(
          "PROCESS ORDER ERROR",
          error
        );
      },
    });
  };

/*
|--------------------------------------------------------------------------
| SHIP ORDER
|--------------------------------------------------------------------------
*/

export const useShipOrder =
  () => {
    const qc =
      useQueryClient();

    return useMutation({
      mutationFn: ({
        id,
        trackingId,
        courierName,
      }: {
        id: string;

        trackingId: string;

        courierName: string;
      }) =>
        orderApi.shipOrder(
          id,
          {
            trackingId,
            courierName,
          }
        ),

      onSuccess: (
        _data,
        variables
      ) => {
        qc.invalidateQueries({
          queryKey: [
            "admin-orders",
          ],
        });

        qc.invalidateQueries({
          queryKey: [
            "admin-order",
            variables.id,
          ],
        });
      },

      onError: (
        error
      ) => {
        console.error(
          "SHIP ORDER ERROR",
          error
        );
      },
    });
  };

/*
|--------------------------------------------------------------------------
| DELIVER ORDER
|--------------------------------------------------------------------------
*/

export const useDeliverOrder =
  () => {
    const qc =
      useQueryClient();

    return useMutation({
      mutationFn: (
        id: string
      ) =>
        orderApi.deliverOrder(
          id
        ),

      onSuccess: (
        _data,
        id
      ) => {
        qc.invalidateQueries({
          queryKey: [
            "admin-orders",
          ],
        });

        qc.invalidateQueries({
          queryKey: [
            "admin-order",
            id,
          ],
        });
      },

      onError: (
        error
      ) => {
        console.error(
          "DELIVER ORDER ERROR",
          error
        );
      },
    });
  };

/*
|--------------------------------------------------------------------------
| REFUND ORDER
|--------------------------------------------------------------------------
*/

export const useRefundOrder =
  () => {
    const qc =
      useQueryClient();

    return useMutation({
      mutationFn: (
        id: string
      ) =>
        orderApi.refundOrder(
          id
        ),

      onSuccess: (
        _data,
        id
      ) => {
        qc.invalidateQueries({
          queryKey: [
            "admin-orders",
          ],
        });

        qc.invalidateQueries({
          queryKey: [
            "admin-order",
            id,
          ],
        });
      },

      onError: (
        error
      ) => {
        console.error(
          "REFUND ORDER ERROR",
          error
        );
      },
    });
  };