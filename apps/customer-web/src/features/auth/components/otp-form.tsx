"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useVerifyOtp } from "../hooks/use-verify-otp";

import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";

// ============================================================
// DESIGN TOKENS — shared with login-form.tsx
// bg #FFFFFF  surface #FFFFFF  border #DCE6E2
// primary #0E6B5C  primary-dark #0A5347  accent #FF6B57
// ink #12231F  muted #5C7570
// display: Fraunces  body: Manrope  utility: IBM Plex Mono
// ============================================================

const DISPLAY_FONT = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const BODY_FONT = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const MONO_FONT = "'IBM Plex Mono', ui-monospace, monospace";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

function PulseLine() {
  return (
    <svg
      viewBox="0 0 400 48"
      fill="none"
      className="h-6 w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 24 H120 L136 24 L148 6 L164 42 L178 24 H400"
        stroke="#FF6B57"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: "pulse-draw 2.8s ease-in-out infinite",
        }}
      />
    </svg>
  );
}

function Wordmark() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v18M3 12h18"
            stroke="#F5F8F7"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span
        className="text-md font-semibold tracking-tight text-[#12231F]"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        JPL Medwin
      </span>
    </div>
  );
}

export function OtpForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useVerifyOtp();

  const [digits, setDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // ---- hydration safe ----
  useEffect(() => {
    setMounted(true);
  }, []);

  // ---- load identifier ----
  useEffect(() => {
    if (!mounted) return;

    const stored = sessionStorage.getItem("login_identifier");

    if (!stored) {
      router.replace("/login");
      return;
    }

    setIdentifier(stored);
    inputsRef.current[0]?.focus();
  }, [mounted, router]);

  // ---- resend countdown ----
  useEffect(() => {
    if (!mounted || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted, secondsLeft]);

  const otp = digits.join("");

  function updateDigit(index: number, raw: string) {
    const value = raw.replace(/\D/g, "");

    setDigits((prev) => {
      const next = [...prev];

      if (value.length > 1) {
        // handle paste across boxes
        value
          .slice(0, OTP_LENGTH - index)
          .split("")
          .forEach((char, offset) => {
            next[index + offset] = char;
          });

        const lastFilled = Math.min(
          index + value.length,
          OTP_LENGTH - 1
        );
        inputsRef.current[lastFilled]?.focus();
      } else {
        next[index] = value;

        if (value && index < OTP_LENGTH - 1) {
          inputsRef.current[index + 1]?.focus();
        }
      }

      return next;
    });
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit code`);
      return;
    }

    try {
      setError("");

      const payload = identifier.includes("@")
        ? { email: identifier }
        : { phone: identifier };

      await mutateAsync({
        ...payload,
        code: otp,
        deviceId: "device-1",
        deviceName:
          typeof window !== "undefined" ? navigator.userAgent : "Chrome",
        platform: "web",
      });

      await queryClient.invalidateQueries({ queryKey: ["me"] });

      sessionStorage.removeItem("login_identifier");
      router.replace("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Invalid code or session expired";

      setDigits(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
      setError(message);
    }
  }

  function handleResend() {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#DCE6E2] border-t-[#0E6B5C]" />
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-white p-4 sm:p-6 md:p-10"
      style={{ fontFamily: BODY_FONT }}
    >

      {/* MAIN UNIFIED CONTAINER BOX */}
      <div className="flex w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#DCE6E2] bg-white shadow-[0_24px_60px_-24px_rgba(14,107,92,0.18)]">
        
        {/* LEFT — FORM SECTION WITH 30px / 48px PADDING */}
        <div className="flex w-full flex-col justify-between px-6 py-8 md:w-1/2 md:px-[48px] md:py-[30px]">
          <div className="space-y-6">
            <Wordmark />

            <div className="space-y-5">
              <div className="space-y-1.5">
                <h1
                  className="text-[24px] font-semibold leading-tight text-[#12231F]"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  Verify it's you
                </h1>
                <p className="text-[13px] leading-relaxed text-[#5C7570]">
                  We sent a {OTP_LENGTH}-digit code to{" "}
                  <span className="font-medium text-[#12231F]">
                    {identifier}
                  </span>
                </p>
                <PulseLine />
              </div>

              <div className="space-y-2">
                <Label >
                  Verification code
                </Label>

                <div className="flex justify-between gap-2">
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputsRef.current[index] = el;
                      }}
                      value={digit}
                      onChange={(e) => updateDigit(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      inputMode="numeric"
                      maxLength={OTP_LENGTH}
                      className="h-12 w-10 rounded-xl border border-[#DCE6E2] bg-[#FBFDFC] text-center text-[18px] font-semibold text-[#12231F] outline-none transition-colors focus:border-[#0E6B5C] focus:ring-4 focus:ring-[#0E6B5C]/15 sm:w-12 sm:h-13"
                      style={{ fontFamily: MONO_FONT }}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-[#F3C6BE] bg-[#FFF3F0] px-4 py-2">
                  <p className="text-center text-[12px] text-[#B4392C]">
                    {error}
                  </p>
                </div>
              )}

              <Button
                onClick={handleVerify}
                loading={isPending}
                disabled={otp.length !== OTP_LENGTH || isPending}
                className="h-11 w-full rounded-xl bg-[#0E6B5C] text-[14px] font-semibold text-white hover:bg-[#0A5347] disabled:opacity-40"
              >
                {isPending ? "Verifying..." : "Verify and continue"}
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="text-center text-[13px] text-[#5C7570]">
              {secondsLeft > 0 ? (
                <span>
                  Didn't get a code? Resend in{" "}
                  <span
                    className="font-medium text-[#12231F]"
                    style={{ fontFamily: MONO_FONT }}
                  >
                    0:{secondsLeft.toString().padStart(2, "0")}
                  </span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-[#0E6B5C] hover:underline"
                >
                  Resend code
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — BRAND / TRUST PANEL */}
        <div className="relative hidden w-1/2 md:block">
          <img
            src="/Images/login-Image.jpg"
            alt="Pharmacist verifying an order"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2420]/90 via-[#0A2420]/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 space-y-4 p-8">
            <h2
              className="max-w-xs text-[26px] font-semibold leading-[1.2] text-white"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              One more step to keep your account safe.
            </h2>
            <p className="max-w-xs text-[13px] leading-relaxed text-white/75">
              This code confirms it's really you before we unlock order
              history, refills, and messages with your care team.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                "256-bit encryption",
                "HIPAA safeguards",
                "Private & Encrypted",
              ].map((label) => (
                <span
                  key={label}
                  className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
                      stroke="#7CE0C6"
                      strokeWidth="1.6"
                    />
                  </svg>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}