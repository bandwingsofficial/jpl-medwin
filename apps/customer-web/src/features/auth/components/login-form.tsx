"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/use-login";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";

// ============================================================
// DESIGN TOKENS (JPL Markwin Pharmacy)
// bg      #F5F8F7   surface #FFFFFF   border #DCE6E2
// primary #0E6B5C   primary-dark #0A5347   accent #FF6B57
// ink     #12231F   muted #5C7570
// display: Fraunces  body: Manrope  utility: IBM Plex Mono
// ============================================================
const DISPLAY_FONT = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const BODY_FONT = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

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
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0E6B5C]">
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

export function LoginForm() {
  const router = useRouter();
  const { mutateAsync, isPending } = useLogin();

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!value.trim()) {
      setError("Enter your email or phone number to continue");
      return;
    }

    try {
      setError("");

      const payload = value.includes("@")
        ? { email: value }
        : { phone: value };

      await mutateAsync(payload);

      sessionStorage.setItem("login_identifier", value);
      router.push("/verify-otp");
    } catch (err: any) {
      setError(err?.response?.data?.message || "We couldn't sign you in. Try again.");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-white p-4 sm:p-6 md:p-10"
      style={{ fontFamily: BODY_FONT }}
    >

      {/* MAIN UNIFIED CONTAINER BOX */}
      <div className="flex w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#DCE6E2] bg-white shadow-[0_24px_60px_-24px_rgba(14,107,92,0.18)]">
        
        {/* LEFT — FORM SECTION WITH CUSTOM 30px / 48px PADDING */}
        <div className="flex w-full flex-col justify-between px-6 py-8 md:w-1/2 md:px-[48px] md:py-[30px]">
          <div className="space-y-6">
            <Wordmark />

            <div className="space-y-5">
              <div className="space-y-1.5">
                <h1
                  className="text-[24px] font-semibold leading-tight text-[#12231F]"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  Welcome To JPL Medwin
                </h1>
                <p className="text-[13px] leading-relaxed text-[#5C7570]">
                  Sign in to manage prescriptions, track orders, and message
                  your pharmacist.
                </p>
                <PulseLine />
              </div>

              <div className="space-y-2">
                <Label >
                  Email or phone number
                </Label>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 rounded-xl border-[#DCE6E2] bg-[#FBFDFC] text-[14px] placeholder:text-[#9AAFA9] focus-visible:border-[#0E6B5C] focus-visible:ring-[#0E6B5C]/20"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-[#F3C6BE] bg-[#FFF3F0] px-4 py-2">
                  <p className="text-[12px] text-[#B4392C]">{error}</p>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                loading={isPending}
                className="h-11 w-full rounded-xl bg-[#0E6B5C] text-[14px] font-semibold text-white hover:bg-[#0A5347]"
              >
                {isPending ? "Signing in..." : "Continue"}
              </Button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-[11px] leading-relaxed text-[#5C7570]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 shrink-0"
            >
              <path
                d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
                stroke="#0E6B5C"
                strokeWidth="1.6"
              />
            </svg>
            <span>
              By continuing you agree to our Terms of Service and Privacy
              Policy. Your health data stays encrypted end to end.
            </span>
          </div>
        </div>

        {/* RIGHT — BRAND PANEL */}
        <div className="relative hidden w-1/2 md:block">
          <img
            src="/Images/login-Image.jpg"
            alt="Pharmacist reviewing a prescription"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2420]/90 via-[#0A2420]/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 space-y-4 p-8">
            <h2
              className="max-w-xs text-[26px] font-semibold leading-[1.2] text-white"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Your prescriptions, refilled without the waiting room.
            </h2>
            <p className="max-w-xs text-[13px] leading-relaxed text-white/75">
              Licensed pharmacists review every order before it ships, so what
              reaches your door is exactly what your doctor intended.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                "Licensed pharmacy",
                "Verified prescriptions",
                "24/7 support",
              ].map((label) => (
                <span
                  key={label}
                  className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="#7CE0C6"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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