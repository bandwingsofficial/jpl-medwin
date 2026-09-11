"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { TotpInput } from "@/features/auth/components/totp-input";
import {
  adminVerifyEmailOtp,
  adminResendEmailOtp,
  adminVerifyTotp,
} from "@/infrastructure/api/auth.api";
import { getDeviceId } from "@/features/auth/services/auth-ui.service";

interface ChallengeState {
  challengeId: string;
  target?: string;
  resendCooldown?: number;
  expiresIn?: number;
}

export default function VerifyOtpPage() {
  const router = useRouter();

  // Verification Stages: 1. EMAIL_OTP -> 2. TOTP
  const [stage, setStage] = useState<"EMAIL_OTP" | "TOTP">("EMAIL_OTP");

  const [challenge, setChallenge] = useState<ChallengeState | null>(null);
  const [emailOtp, setEmailOtp] = useState("");
  const [totpCode, setTotpCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Resend countdown timer
  const [cooldown, setCooldown] = useState(60);

  // Load challenge from step 1
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_challenge");

    if (!stored) {
      router.replace("/login");
      return;
    }

    try {
      const parsed: ChallengeState = JSON.parse(stored);
      if (!parsed.challengeId) {
        router.replace("/login");
        return;
      }
      setChallenge(parsed);
      if (parsed.resendCooldown) {
        setCooldown(parsed.resendCooldown);
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // Handle countdown interval
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  // =======================
  // 📧 VERIFY EMAIL OTP (STAGE 1)
  // =======================
  const handleVerifyEmailOtp = async () => {
    if (!challenge?.challengeId) return;

    if (emailOtp.length !== 6) {
      setError("Please enter the complete 6-digit email verification code");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setInfoMessage(null);

      const res = await adminVerifyEmailOtp({
        challengeId: challenge.challengeId,
        otp: emailOtp,
      });

      if (res.success || res.emailOtpVerified || res.data?.emailOtpVerified) {
        setStage("TOTP");
        setInfoMessage("Email verified! Now enter the code from your authenticator app.");
      } else {
        setError(res.message || "Failed to verify email code");
      }
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message || err?.message || "Email OTP verification failed";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // 🔄 RESEND EMAIL OTP
  // =======================
  const handleResendEmailOtp = async () => {
    if (!challenge?.challengeId || cooldown > 0 || resending) return;

    try {
      setResending(true);
      setError(null);
      setInfoMessage(null);

      const res = await adminResendEmailOtp({
        challengeId: challenge.challengeId,
      });

      const nextCooldown = res.resendCooldown || res.data?.resendCooldown || 60;
      setCooldown(nextCooldown);
      setEmailOtp("");
      setInfoMessage("A new verification code has been sent to your email.");
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message || err?.message || "Failed to resend code";
      setError(apiMessage);
    } finally {
      setResending(false);
    }
  };

  // =======================
  // 🔐 VERIFY TOTP (STAGE 2 - FINAL)
  // =======================
  const handleVerifyTotp = async () => {
    if (!challenge?.challengeId) return;

    if (totpCode.length !== 6) {
      setError("Please enter the 6-digit authenticator code");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setInfoMessage(null);

      await adminVerifyTotp({
        challengeId: challenge.challengeId,
        totpCode,
        deviceId: getDeviceId(),
        deviceName: typeof navigator !== "undefined" ? navigator.platform || "Web Browser" : "Web Browser",
        platform: "WEB",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      });

      sessionStorage.removeItem("admin_challenge");
      sessionStorage.removeItem("admin_login");

      router.replace("/dashboard");
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message || err?.message || "Authenticator code verification failed";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
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
        {/* Left Panel */}
        <div className="hidden md:block md:w-1/2 relative bg-slate-100">
          <img
            src="/Logo/login2.png"
            alt="Medical Professional"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/10 via-transparent to-transparent mix-blend-multiply" />
        </div>

        {/* Right Panel */}
        <div className="flex w-full md:w-1/2 flex-col justify-center px-8 py-10 lg:px-12 bg-white">
          <div className="w-full max-w-sm mx-auto space-y-5">
            {/* Logo */}
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="inline-flex items-center justify-center p-2 bg-white rounded-xl shadow-xs border border-slate-100 w-fit">
                <img
                  src="/Logo/jpl_logo.png"
                  alt="JPL Markwin"
                  className="w-32 h-auto object-contain"
                />
              </div>

              <p className="text-[9px] tracking-[0.25em] text-teal-600 uppercase font-mono font-semibold">
                • Admin Console
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                  ✓
                </span>
                <span className="text-[11px] font-medium text-slate-500">Credentials</span>
              </div>
              <span className="h-[1px] w-6 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                    stage === "EMAIL_OTP" ? "bg-teal-600 ring-2 ring-teal-600/20" : "bg-teal-600"
                  }`}
                >
                  {stage === "TOTP" ? "✓" : "2"}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    stage === "EMAIL_OTP" ? "text-teal-700 font-bold" : "text-slate-500"
                  }`}
                >
                  Email OTP
                </span>
              </div>
              <span className="h-[1px] w-6 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    stage === "TOTP"
                      ? "bg-teal-600 text-white ring-2 ring-teal-600/20"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  3
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    stage === "TOTP" ? "text-teal-700 font-bold" : "text-slate-400"
                  }`}
                >
                  2FA
                </span>
              </div>
            </div>

            {/* Stage 1: EMAIL OTP */}
            {stage === "EMAIL_OTP" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Email Verification
                  </h1>
                  <p className="text-xs text-slate-500">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-semibold text-slate-700 font-mono">
                      {challenge?.target || "your registered email"}
                    </span>
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-600 flex items-center gap-2 animate-in fade-in duration-200">
                    <span className="text-[9px] text-rose-500 uppercase tracking-wider font-mono font-bold">
                      Error
                    </span>
                    {error}
                  </div>
                )}

                {/* Info Banner */}
                {infoMessage && (
                  <div className="px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg text-xs font-medium text-teal-700 animate-in fade-in duration-200">
                    {infoMessage}
                  </div>
                )}

                {/* OTP Input */}
                <div className="py-1 flex justify-center">
                  <TotpInput value={emailOtp} onChange={setEmailOtp} />
                </div>

                {/* Submit Action */}
                <Button
                  onClick={handleVerifyEmailOtp}
                  loading={loading}
                  className="
                    w-full h-10 rounded-lg
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
                  Verify Email Code
                  <span aria-hidden="true">→</span>
                </Button>

                {/* Resend Action */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleResendEmailOtp}
                    disabled={cooldown > 0 || resending}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {resending
                      ? "Sending code..."
                      : cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : "Resend verification code"}
                  </button>
                </div>
              </div>
            )}

            {/* Stage 2: TOTP */}
            {stage === "TOTP" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Authenticator 2FA
                  </h1>
                  <p className="text-xs text-slate-500">
                    Enter the 6-digit code from your authenticator app (e.g. Google Authenticator).
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-600 flex items-center gap-2 animate-in fade-in duration-200">
                    <span className="text-[9px] text-rose-500 uppercase tracking-wider font-mono font-bold">
                      Error
                    </span>
                    {error}
                  </div>
                )}

                {/* Info Banner */}
                {infoMessage && (
                  <div className="px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg text-xs font-medium text-teal-700 animate-in fade-in duration-200">
                    {infoMessage}
                  </div>
                )}

                {/* OTP Input */}
                <div className="py-1 flex justify-center">
                  <TotpInput value={totpCode} onChange={setTotpCode} />
                </div>

                {/* Submit Action */}
                <Button
                  onClick={handleVerifyTotp}
                  loading={loading}
                  className="
                    w-full h-10 rounded-lg
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
                  Authenticate &amp; Access
                  <span aria-hidden="true">→</span>
                </Button>

                <p className="text-center text-[10px] text-slate-400 tracking-wide font-mono font-medium pt-1">
                  Lost authenticator access? Contact IT Administrator.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}