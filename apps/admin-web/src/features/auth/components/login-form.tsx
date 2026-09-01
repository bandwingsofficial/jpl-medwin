"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

interface LoginFormState {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required");
      return;
    }

    setError(null);
    sessionStorage.setItem("admin_login", JSON.stringify(form));
    router.push("/verify-otp");
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
            src="Logo/login2.png" 
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
                  src="/Logo/jpl_logo.png"
                  alt="JPL Markwin"
                  className="w-28 h-auto object-contain"
                />
              </div>
              <p className="text-[9px] tracking-[0.25em] text-teal-600 uppercase font-mono font-semibold block">
                • Admin Console
              </p>
            </div>

            {/* Form Intro */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Sign in to console
              </h1>
              <p className="text-xs text-slate-500">
                Enter your administrative credentials to continue.
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

            {/* Inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] tracking-[0.12em] text-slate-500 uppercase font-mono font-bold">
                  Email Address
                </label>
                <Input
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all focus:bg-white focus:border-teal-500 focus:ring-[3px] focus:ring-teal-500/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-[0.12em] text-slate-500 uppercase font-mono font-bold">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all focus:bg-white focus:border-teal-500 focus:ring-[3px] focus:ring-teal-500/10"
                />
              </div>
            </div>

            {/* Submit Action */}
            <Button
              onClick={handleNext}
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
              Continue to verification
              <span aria-hidden="true">→</span>
            </Button>

            <p className="text-center text-[9px] text-slate-400 tracking-wide font-mono font-medium pt-1">
              256-bit SSL · Session encrypted end-to-end
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}