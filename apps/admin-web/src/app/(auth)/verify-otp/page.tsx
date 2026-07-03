"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { TotpInput } from "@/features/auth/components/totp-input";
import { adminLogin } from "@/infrastructure/api/auth.api";

interface Credentials {
  email: string;
  password: string;
}

export default function VerifyOtpPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load credentials from step 1
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_login");

    if (!stored) {
      router.replace("/login");
      return;
    }

    try {
      setCredentials(JSON.parse(stored));
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const handleVerify = async () => {
    if (!credentials) return;

    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await adminLogin({
        ...credentials,
        totpCode: otp,
        deviceId: "admin-device-1",
        deviceName: "Chrome Windows",
        platform: "WEB",
        ip: "::1",
        userAgent: navigator.userAgent,
      });

      sessionStorage.removeItem("admin_login");

      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* MAIN PANEL */}
      <div
        className="
          relative z-10 w-full max-w-[900px] min-h-[500px] md:h-[520px]
          bg-white rounded-2xl
          border border-slate-200/80
          shadow-[0_20px_50px_-12px_rgba(15,23,42,0.06)]
          flex flex-col md:flex-row overflow-hidden
          animate-in fade-in zoom-in-95 duration-500
        "
      >
        {/* ===================================================== */}
        {/* LEFT — MEDICAL VISUAL SIDEBAR */}
        {/* ===================================================== */}
        <div className="hidden md:block md:w-1/2 relative bg-slate-100">
          <img
            src="Logo/login.png" 
            alt="Medical Professional"
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay matching light-themed aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/10 via-transparent to-transparent mix-blend-multiply" />
        </div>

        {/* ===================================================== */}
        {/* RIGHT — CLEAN & SIMPLE FORM PANEL */}
        {/* ===================================================== */}
        <div className="flex w-full md:w-1/2 flex-col justify-center px-8 py-10 lg:px-12 bg-white">
          <div className="w-full max-w-sm mx-auto space-y-6">
            
            {/* Brand Identity Rendered Perfectly via Code - Centered horizontally */}
            <div className="flex flex-col items-center justify-center text-center space-y-2.5">
              <div className="inline-flex items-center justify-center p-2.5 bg-white rounded-xl shadow-xs border border-slate-100 w-fit">
                <img
                  src="/Logo/JPL Markwin.png"
                  alt="JPL Markwin"
                  className="w-36 h-auto object-contain"
                />
              </div>
              <p className="text-[9px] tracking-[0.25em] text-teal-600 uppercase font-mono font-semibold block">
                • Admin Console
              </p>
            </div>

            {/* Form Intro */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Verify OTP
              </h1>
              <p className="text-xs text-slate-500">
                Enter the 6-digit code sent to your email.
              </p>
            </div>

            {/* Error Layer */}
            {error && (
              <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="text-[9px] text-rose-500 uppercase tracking-wider font-mono font-bold">
                  Error
                </span>
                {error}
              </div>
            )}

            {/* OTP Input Container */}
            <div className="py-2 flex justify-center">
              <TotpInput value={otp} onChange={setOtp} />
            </div>

            {/* Submit Action */}
            <Button
              onClick={handleVerify}
              loading={loading}
              className="
                w-full h-11 rounded-lg
                bg-gradient-to-r from-teal-600 to-blue-600
                hover:from-teal-700 hover:to-blue-700
                text-white text-xs font-bold tracking-wide uppercase
                shadow-[0_4px_14px_rgba(13,148,136,0.2)]
                transition-all duration-200
                hover:-translate-y-0.5 active:translate-y-0
                flex items-center justify-center gap-2
                border-none
              "
            >
              Verify &amp; login
              <span aria-hidden="true">→</span>
            </Button>

            <p className="text-center text-[9px] text-slate-400 tracking-wide font-mono font-medium pt-1">
              Didn't get a code? Check spam or contact IT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}