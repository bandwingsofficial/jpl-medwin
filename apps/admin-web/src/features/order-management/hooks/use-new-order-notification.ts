"use client";

import { useEffect, useRef } from "react";

import { orderApi } from "../api/order.api";

const STORAGE_KEY =
  "admin-seen-order-notifications";

const POLLING_INTERVAL =
  10_000;

export function useNewOrderNotification() {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const audioUnlockedRef =
    useRef(false);

  const initializedRef =
    useRef(false);

  const seenOrderIdsRef =
    useRef<Set<string>>(new Set());

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

    audioRef.current = audio;

    /*
    |--------------------------------------------------------------------------
    | UNLOCK AUDIO
    |--------------------------------------------------------------------------
    */

    const unlockAudio =
      async () => {
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
        } catch {
          // Browser autoplay restriction.
        }
      };

    window.addEventListener(
      "pointerdown",
      unlockAudio,
      { once: true }
    );

    window.addEventListener(
      "keydown",
      unlockAudio,
      { once: true }
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

      audioRef.current = null;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PLAY SOUND
  |--------------------------------------------------------------------------
  */

  const playSound =
    async () => {
      const audio =
        audioRef.current;

      if (
        !audio ||
        !audioUnlockedRef.current
      ) {
        return;
      }

      try {
        audio.currentTime = 0;

        await audio.play();

        console.log(
          "🔔 New order sound played"
        );
      } catch (error) {
        console.error(
          "Unable to play order sound:",
          error
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | CHECK NEW ORDERS
  |--------------------------------------------------------------------------
  */

  const checkForNewOrders =
    async () => {
      try {
        const response =
          await orderApi.getOrders({
            page: 1,
            limit: 100,
            search: "",
            status: "",
          });

        const orders =
          response.orders ?? [];

        /*
        |--------------------------------------------------------------------------
        | LOAD SAVED IDS
        |--------------------------------------------------------------------------
        */

        if (
          !initializedRef.current
        ) {
          try {
            const stored =
              window.localStorage.getItem(
                STORAGE_KEY
              );

            if (stored) {
              const parsed: unknown =
                JSON.parse(stored);

              if (
                Array.isArray(parsed)
              ) {
                seenOrderIdsRef.current =
                  new Set(
                    parsed.filter(
                      (
                        id
                      ): id is string =>
                        typeof id ===
                        "string"
                    )
                  );
              }
            }
          } catch {
            seenOrderIdsRef.current =
              new Set();
          }

          initializedRef.current =
            true;
        }

        /*
        |--------------------------------------------------------------------------
        | FIRST CHECK
        |--------------------------------------------------------------------------
        |
        | Register everything currently
        | existing. NO SOUND.
        |
        */

        if (
          seenOrderIdsRef.current
            .size === 0
        ) {
          orders.forEach(
            (order) => {
              seenOrderIdsRef.current.add(
                order.id
              );
            }
          );

          saveSeenOrders();

          console.log(
            "📦 Initial orders registered:",
            orders.length
          );

          return;
        }

        /*
        |--------------------------------------------------------------------------
        | FIND NEW ORDERS
        |--------------------------------------------------------------------------
        */

        const newOrders =
          orders.filter(
            (order) =>
              !seenOrderIdsRef.current.has(
                order.id
              )
          );

        if (
          newOrders.length === 0
        ) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | MARK AS SEEN FIRST
        |--------------------------------------------------------------------------
        */

        newOrders.forEach(
          (order) => {
            seenOrderIdsRef.current.add(
              order.id
            );
          }
        );

        saveSeenOrders();

        /*
        |--------------------------------------------------------------------------
        | ONE SOUND
        |--------------------------------------------------------------------------
        |
        | Even if 3 new orders arrive
        | together, play ONE sound.
        |
        */

        console.log(
          "🆕 New orders:",
          newOrders.map(
            (order) =>
              order.orderNumber
          )
        );

        void playSound();
      } catch (error) {
        console.error(
          "Failed to check new orders:",
          error
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  const saveSeenOrders =
    () => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            Array.from(
              seenOrderIdsRef.current
            )
          )
        );
      } catch (error) {
        console.warn(
          "Failed to save seen orders:",
          error
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | POLLING
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    void checkForNewOrders();

    const interval =
      window.setInterval(
        () => {
          void checkForNewOrders();
        },
        POLLING_INTERVAL
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, []);
}