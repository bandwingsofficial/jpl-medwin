"use client";

import {
  useState,
} from "react";

import {
  Bell,
  Loader2,
  X,
} from "lucide-react";

interface OutOfStockNotificationDialogProps {
  open: boolean;

  onClose: () => void;

  productName: string;

  productId: string;

  variantId?: string;

  variantName?: string;
}

interface NotificationResponse {
  success?: boolean;

  message?: string;
}

export function OutOfStockNotificationDialog({
  open,
  onClose,
  productName,
  productId,
  variantId,
  variantName,
}: OutOfStockNotificationDialogProps) {
  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isSuccess,
    setIsSuccess,
  ] = useState(false);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setPhoneNumber("");
    setError("");
    setIsSuccess(false);

    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedPhoneNumber =
      phoneNumber.trim();

    if (!trimmedPhoneNumber) {
      setError(
        "Please enter your phone number",
      );

      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/out-of-stock-notification",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            phoneNumber:
              trimmedPhoneNumber,

            productName,

            productId,

            variantId,

            variantName,
          }),
        },
      );

      const contentType =
        response.headers.get(
          "content-type",
        );

      if (
        !contentType?.includes(
          "application/json",
        )
      ) {
        const responseText =
          await response.text();

        console.error(
          "OUT OF STOCK NOTIFICATION API ERROR:",
          {
            status: response.status,
            statusText:
              response.statusText,
            responseText,
          },
        );

        if (response.status === 404) {
          throw new Error(
            "Notification API route not found",
          );
        }

        throw new Error(
          "Notification service returned an invalid response",
        );
      }

      const data =
        (await response.json()) as NotificationResponse;

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit notification request",
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to submit notification request",
        );
      }

      setIsSuccess(true);

      setPhoneNumber("");
    } catch (submissionError) {
      console.error(
        "OUT OF STOCK NOTIFICATION SUBMISSION ERROR:",
        submissionError,
      );

      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        px-4
      "
      onClick={handleClose}
    >
      <div
        className="
          relative
          w-full
          max-w-md
          rounded-2xl
          bg-white
          p-6
          shadow-2xl
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="
            absolute
            right-4
            top-4
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-700
            disabled:cursor-not-allowed
          "
          aria-label="Close notification dialog"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="py-4 text-center">
            <div
              className="
                mx-auto
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-teal-50
                text-teal-600
              "
            >
              <Bell size={26} />
            </div>

            <h2
              className="
                text-lg
                font-bold
                text-gray-900
              "
            >
              You&apos;re on the notification list!
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-gray-500
              "
            >
              We&apos;ll notify you when this
              product becomes available.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="
                mt-6
                w-full
                rounded-lg
                bg-teal-600
                px-4
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-teal-700
              "
            >
              OK
            </button>
          </div>
        ) : (
          <>
            <div
              className="
                mb-5
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-orange-50
                text-orange-600
              "
            >
              <Bell size={22} />
            </div>

            <h2
              className="
                text-xl
                font-bold
                text-gray-900
              "
            >
              Notify me when available
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-gray-500
              "
            >
              Enter your phone number and
              we&apos;ll notify you when
              <span className="font-semibold text-gray-700">
                {" "}
                {productName}
                {variantName && variantName !== productName
                  ? ` (${variantName})`
                  : ""}
              </span>
              {" "}
              is back in stock.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6"
            >
              <label
                htmlFor="notification-phone"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Phone Number
              </label>

              <input
                id="notification-phone"
                type="tel"
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(
                    event.target.value,
                  );

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Enter your phone number"
                disabled={isSubmitting}
                className="
                  h-12
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  text-sm
                  outline-none
                  transition
                  focus:border-teal-500
                  focus:ring-2
                  focus:ring-teal-100
                  disabled:bg-gray-50
                "
              />

              {error && (
                <p
                  className="
                    mt-2
                    text-xs
                    text-red-500
                  "
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  mt-5
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-teal-600
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-teal-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    SUBMITTING...
                  </>
                ) : (
                  <>
                    <Bell size={17} />

                    NOTIFY ME
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}