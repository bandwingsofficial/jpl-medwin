"use client";

import { create } from "zustand";

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

interface ToastState {
  message: string;

  type: ToastType;

  visible: boolean;

  showToast: (
    message: string,
    type: ToastType
  ) => void;

  hideToast: () => void;
}

export const useToastStore =
  create<ToastState>((set) => ({
    message: "",

    type: "success",

    visible: false,

    showToast: (
      message,
      type
    ) => {
      set({
        message,
        type,
        visible: true,
      });

      setTimeout(() => {
        set({
          visible: false,
        });
      }, 3000);
    },

    hideToast: () => {
      set({
        visible: false,
      });
    },
  }));

// ========================================
// HELPER FUNCTIONS
// ========================================

export const showSuccess = (
  message: string
) => {
  useToastStore
    .getState()
    .showToast(
      message,
      "success"
    );
};

export const showError = (
  message: string
) => {
  useToastStore
    .getState()
    .showToast(
      message,
      "error"
    );
};

export const showWarning = (
  message: string
) => {
  useToastStore
    .getState()
    .showToast(
      message,
      "warning"
    );
};

export const showInfo = (
  message: string
) => {
  useToastStore
    .getState()
    .showToast(
      message,
      "info"
    );
};