"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Loader2, Mail, Phone, X } from "lucide-react";

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

export function OutOfStockNotificationDialog({
  open,
  onClose,
  productName,
  productId,
  variantId,
  variantName,
}: OutOfStockNotificationDialogProps) {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    setEmail("");
    setPhoneNumber("");
    setError("");
    setIsSuccess(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPhoneNumber = phoneNumber.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address");
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!trimmedPhoneNumber) {
      setError("Please enter your WhatsApp / phone number");
      return;
    }

    if (!PHONE_REGEX.test(trimmedPhoneNumber)) {
      setError("Please enter a valid WhatsApp / phone number");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/out-of-stock-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          phoneNumber: trimmedPhoneNumber,
          productName,
          productId,
          variantId,
          variantName,
        }),
      });

      const data = (await response.json()) as NotificationResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit notification request");
      }

      setIsSuccess(true);
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
          aria-label="Close notification dialog"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <CheckCircle2 size={32} />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              You&apos;re on the list!
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              We&apos;ll send an email alert to{" "}
              <span className="font-semibold text-gray-900">{email}</span> as soon as{" "}
              <span className="font-semibold text-teal-700">
                {productName}
                {variantName && variantName !== productName ? ` (${variantName})` : ""}
              </span>{" "}
              is back in stock.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <Bell size={22} />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Notify me when available
            </h2>

            <p className="mt-1.5 text-sm leading-5 text-gray-500">
              We will email you automatically as soon as{" "}
              <span className="font-semibold text-gray-800">
                {productName}
                {variantName && variantName !== productName ? ` (${variantName})` : ""}
              </span>{" "}
              is restocked.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="notification-email"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input
                    id="notification-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="name@example.com"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="notification-phone"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Phone size={16} />
                  </div>
                  <input
                    id="notification-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="+91 98765 43210"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-gray-50"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-2.5 text-xs text-red-600 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    SUBMITTING...
                  </>
                ) : (
                  <>
                    <Bell size={16} />
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
