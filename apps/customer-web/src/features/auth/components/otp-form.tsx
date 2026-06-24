"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { useVerifyOtp } from "../hooks/use-verify-otp";

import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";

export function OtpForm() {
  const router = useRouter();

  const queryClient =
    useQueryClient();

  const {
    mutateAsync,
    isPending,
  } = useVerifyOtp();

  // ========================================
  // STATE
  // ========================================

  const [otp, setOtp] =
    useState("");

  const [
    identifier,
    setIdentifier,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [mounted, setMounted] =
    useState(false);

  // ========================================
  // HYDRATION SAFE
  // ========================================

  useEffect(() => {
    setMounted(true);
  }, []);

  // ========================================
  // LOAD IDENTIFIER
  // ========================================

  useEffect(() => {
    if (!mounted) return;

    const stored =
      sessionStorage.getItem(
        "login_identifier"
      );

    if (!stored) {
      router.replace("/login");

      return;
    }

    setIdentifier(stored);
  }, [mounted, router]);

  // ========================================
  // VERIFY OTP
  // ========================================

  async function handleVerify() {
    // VALIDATION
    if (otp.length !== 6) {
      setError(
        "Please enter a valid 6-digit OTP"
      );

      return;
    }

    try {
      setError("");

      // ========================================
      // PAYLOAD
      // ========================================

      const payload =
        identifier.includes("@")
          ? { email: identifier }
          : {
              phone: identifier,
            };

      // ========================================
      // VERIFY
      // ========================================

      await mutateAsync({
        ...payload,

        code: otp,

        deviceId: "device-1",

        deviceName:
          typeof window !==
          "undefined"
            ? navigator.userAgent
            : "Chrome",

        platform: "web",
      });

      // ========================================
      // REFRESH AUTH CACHE
      // ========================================

      await queryClient.invalidateQueries(
        {
          queryKey: ["me"],
        }
      );

      // ========================================
      // CLEANUP
      // ========================================

      sessionStorage.removeItem(
        "login_identifier"
      );

      // ========================================
      // REDIRECT
      // ========================================

      router.replace("/");
    } catch (err: any) {
      const message =
        err?.response?.data
          ?.message ||
        "Invalid OTP or session expired";

      setError(message);
    }
  }

  // ========================================
  // LOADING DURING HYDRATION
  // ========================================

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* LEFT SIDE */}
      <div className="flex w-full items-center justify-center px-6 md:w-1/2">
        <div className="w-full max-w-md space-y-6">
          {/* BRAND */}
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-blue-600 via-purple-500 to-green-400 bg-clip-text text-3xl font-extrabold text-transparent">
              JPL MARKWIN
            </h1>
          </div>

          {/* CARD */}
          <Card className="w-full space-y-6 rounded-2xl p-8 shadow-lg">
            {/* HEADER */}
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                Verify OTP
              </h1>

              <p className="text-sm text-gray-500">
                Enter the 6-digit
                code sent to
              </p>

              <p className="text-sm font-medium text-gray-700">
                {identifier}
              </p>
            </div>

            {/* OTP INPUT */}
            <div className="space-y-2">
              <Label>
                OTP Code
              </Label>

              <Input
                value={otp}
                onChange={(e) => {
                  const value =
                    e.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(0, 6);

                  setOtp(value);
                }}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="text-center text-lg tracking-[0.4em]"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-center text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* BUTTON */}
            <Button
              onClick={handleVerify}
              className="w-full"
              loading={isPending}
              disabled={
                otp.length !== 6 ||
                isPending
              }
            >
              {isPending
                ? "Verifying..."
                : "Verify OTP"}
            </Button>

            {/* RESEND */}
            <div className="text-center text-sm text-gray-500">
              Didn’t receive code?{" "}
              <span className="cursor-pointer font-medium text-blue-600 hover:underline">
                Resend
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="relative hidden w-1/2 md:flex">
        <img
          src="/Images/login-Image.jpg"
          alt="OTP"
          className="h-full w-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 flex items-end bg-black/30 p-10">
          <h2 className="max-w-xl text-3xl font-semibold leading-snug text-white">
            Secure Login
            Verification
          </h2>
        </div>
      </div>
    </div>
  );
}