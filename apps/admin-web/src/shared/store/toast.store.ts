"use client";

import { create } from "zustand";

// ========================================
// TOAST TYPES
// ========================================

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

// ========================================
// STORE TYPES
// ========================================

interface ToastState {
  message: string;

  title: string;

  type: ToastType;

  visible: boolean;

  duration: number;

  timeoutId:
    | NodeJS.Timeout
    | null;

  // ====================================
  // CONFIRMATION
  // ====================================

  isConfirm: boolean;

  onConfirm:
    | (() => void)
    | null;

  onCancel:
    | (() => void)
    | null;

  // ====================================
  // TOAST FUNCTIONS
  // ====================================

  showToast: (
    message: string,
    type: ToastType,
    title?: string,
    duration?: number
  ) => void;

  // ====================================
  // CONFIRM FUNCTION
  // ====================================

  showConfirmToast: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    title?: string
  ) => void;

  hideToast: () => void;
}

// ========================================
// TOAST STORE
// ========================================

export const useToastStore =
  create<ToastState>(
    (set, get) => ({

      message: "",

      title: "",

      type: "success",

      visible: false,

      duration: 3000,

      timeoutId: null,

      // ====================================
      // CONFIRMATION
      // ====================================

      isConfirm: false,

      onConfirm: null,

      onCancel: null,

      // ====================================
      // SHOW TOAST
      // ====================================

      showToast: (
        message,
        type,
        title,
        duration = 3000
      ) => {

        // CLEAR OLD TIMER

        const oldTimeout =
          get().timeoutId;

        if (oldTimeout) {
          clearTimeout(
            oldTimeout
          );
        }

        // DEFAULT TITLES

        const defaultTitles = {
          success: "Success",

          error: "Error",

          warning: "Warning",

          info: "Information",
        };

        // CREATE NEW TIMER

        const timeoutId =
          setTimeout(() => {

            set({
              visible: false,
            });

          }, duration);

        // SET STATE

        set({
          message,

          type,

          visible: true,

          duration,

          timeoutId,

          isConfirm: false,

          onConfirm: null,

          onCancel: null,

          title:
            title ||
            defaultTitles[
              type
            ],
        });
      },

      // ====================================
      // SHOW CONFIRM TOAST
      // ====================================

      showConfirmToast: (
        message,
        onConfirm,
        onCancel,
        title = "Confirmation"
      ) => {

        // CLEAR OLD TIMER

        const oldTimeout =
          get().timeoutId;

        if (oldTimeout) {
          clearTimeout(
            oldTimeout
          );
        }

        set({
          message,

          title,

          type: "warning",

          visible: true,

          duration: 0,

          timeoutId: null,

          isConfirm: true,

          onConfirm,

          onCancel:
            onCancel || null,
        });
      },

      // ====================================
      // HIDE TOAST
      // ====================================

      hideToast: () => {

        const timeout =
          get().timeoutId;

        if (timeout) {
          clearTimeout(
            timeout
          );
        }

        set({
          visible: false,

          timeoutId: null,

          isConfirm: false,

          onConfirm: null,

          onCancel: null,
        });
      },
    })
  );

// ========================================
// HELPER FUNCTIONS
// ========================================

export const showSuccess = (
  message: string,
  title?: string
) => {

  useToastStore
    .getState()
    .showToast(
      message,
      "success",
      title
    );
};

export const showError = (
  message: string,
  title?: string
) => {

  useToastStore
    .getState()
    .showToast(
      message,
      "error",
      title
    );
};

export const showWarning = (
  message: string,
  title?: string
) => {

  useToastStore
    .getState()
    .showToast(
      message,
      "warning",
      title
    );
};

export const showInfo = (
  message: string,
  title?: string
) => {

  useToastStore
    .getState()
    .showToast(
      message,
      "info",
      title
    );
};

// ========================================
// CONFIRM TOAST HELPER
// ========================================

export const showConfirmToast = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  title?: string
) => {

  useToastStore
    .getState()
    .showConfirmToast(
      message,
      onConfirm,
      onCancel,
      title
    );
};