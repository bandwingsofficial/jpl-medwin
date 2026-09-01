"use client";

import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

import { cn } from "@/shared/lib/cn";

import {
  useToastStore,
} from "@/shared/store/toast.store";

export function Toast() {

  const {
    message,
    type,
    visible,
    hideToast,

    // =========================
    // CONFIRM
    // =========================

    isConfirm,
    onConfirm,
    onCancel,
  } = useToastStore();

  if (!visible) {
    return null;
  }

  const styles = {
    success: {
      container:
        "border-green-100 bg-green-50",

      icon: "text-green-600",

      title: "Success",

      Icon: CheckCircle2,
    },

    error: {
      container:
        "border-red-100 bg-red-50",

      icon: "text-red-600",

      title: "Error",

      Icon: AlertCircle,
    },

    warning: {
      container:
        "border-yellow-100 bg-yellow-50",

      icon: "text-yellow-600",

      title: "Warning",

      Icon: AlertTriangle,
    },

    info: {
      container:
        "border-blue-100 bg-blue-50",

      icon: "text-blue-600",

      title: "Info",

      Icon: Info,
    },
  };

  const currentStyle =
    styles[type];

  const Icon =
    currentStyle.Icon;

  return (
    <div
      className="
        fixed
        top-4
        right-4
        z-[9999]
        animate-in
        slide-in-from-top-2
        fade-in
        duration-300
      "
    >
      <div
        className={cn(
          `
            flex
            min-w-[320px]
            max-w-[420px]
            items-start
            gap-3
            rounded-lg
            border
            px-4
            py-3
            shadow-md
            backdrop-blur-sm
          `,
          currentStyle.container
        )}
      >

        {/* ICON */}

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-md
            bg-white/70
          "
        >
          <Icon
            className={cn(
              "h-5 w-5",
              currentStyle.icon
            )}
          />
        </div>

        {/* CONTENT */}

        <div className="flex-1">

          <p
            className={cn(
              `
                text-sm
                font-semibold
              `,
              currentStyle.icon
            )}
          >
            {currentStyle.title}
          </p>

          <p
            className="
              mt-0.5
              text-sm
              text-gray-700
              leading-relaxed
            "
          >
            {message}
          </p>

          {/* ========================= */}
          {/* CONFIRM BUTTONS */}
          {/* ========================= */}

          {isConfirm && (

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
              "
            >

              {/* CANCEL */}

              <button
                onClick={() => {

                  onCancel?.();

                  hideToast();
                }}
                className="
                  rounded-md
                  border
                  border-gray-300
                  bg-white
                  px-3
                  py-1.5
                  text-sm
                  font-medium
                  text-gray-700
                  transition-colors
                  hover:bg-gray-100
                "
              >
                Cancel
              </button>

              {/* CONFIRM */}

              <button
                onClick={() => {

                  onConfirm?.();

                  hideToast();
                }}
                className="
                  rounded-md
                  bg-red-600
                  px-3
                  py-1.5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-red-700
                "
              >
                Confirm
              </button>

            </div>
          )}

        </div>

        {/* CLOSE */}

        {!isConfirm && (

          <button
            onClick={
              hideToast
            }
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              text-gray-400
              transition-colors
              hover:bg-black/5
              hover:text-gray-700
            "
          >
            <X className="h-4 w-4" />
          </button>

        )}

      </div>
    </div>
  );
}