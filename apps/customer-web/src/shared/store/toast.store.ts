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

const formatToastMessage = (msg: unknown): string => {
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg)) return msg.map((m) => formatToastMessage(m)).join(", ");
  if (msg && typeof msg === "object") {
    const obj = msg as Record<string, any>;
    if (typeof obj.message === "string") return obj.message;
    if (Array.isArray(obj.message)) return obj.message.map((m) => formatToastMessage(m)).join(", ");
    try {
      return JSON.stringify(msg);
    } catch {
      return String(msg);
    }
  }
  return String(msg || "");
};

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
        message: formatToastMessage(message),
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