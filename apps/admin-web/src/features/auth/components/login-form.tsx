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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] p-4 overflow-hidden">
      
      {/* PREMIUM AMBIENT BACKDROP GLOWS */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-200/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-200/15 blur-[150px] pointer-events-none" />

      {/* DYNAMIC BACKGROUND ANIMATION KEYFRAMES */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes meshShine {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-mesh-shine {
              background-size: 200% 200%;
              animation: meshShine 8s ease infinite;
            }
          `,
        }}
      />

      {/* COMPACT CENTRALIZED MAIN PANEL CONTAINER */}
      <div 
        className="
          relative 
          z-10 
          w-full 
          max-w-[920px] 
          min-h-[440px]
          md:h-[470px] 
          bg-white 
          rounded-[24px] 
          shadow-[0_20px_50px_-12px_rgba(15,23,42,0.06)] 
          border 
          border-slate-200/50 
          flex 
          overflow-hidden 
          transition-all 
          duration-500
          animate-in 
          fade-in 
          zoom-in-95 
          duration-500
        "
      >
        
        {/* ===================================================== */}
        {/* 🔥 LEFT PANEL - BALANCED & CENTERED TEXT CORES */}
        {/* ===================================================== */}
        <div 
          className="
            hidden 
            md:flex 
            w-1/2 
            relative 
            animate-mesh-shine
            bg-gradient-to-br from-[#001f3f] via-teal-800 to-cyan-950 
            p-10 
            flex-col 
            justify-center 
            items-center
            overflow-hidden
          "
        >
          {/* Subtle Inner Glass Layer Accent */}
          <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-[0.5px]" />

          {/* Fully Centered Content Block */}
          <div className="relative z-10 space-y-6 text-center max-w-[320px]">
            <div 
              className="
                inline-flex 
                items-center 
                justify-center 
                p-3.5 
                bg-white 
                rounded-xl 
                shadow-sm 
                transition-transform 
                duration-500 
                hover:scale-105
              "
            >
              <img
                src="/Logo/JPL Markwin.png"
                alt="JPL Markwin"
                className="w-36 h-auto object-contain"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-white text-2xl font-bold tracking-tight leading-tight">
                JPL Markwin Admin Portal
              </h2>
              <p className="text-slate-300/80 text-xs leading-relaxed">
                Manage your platform efficiently with secure access, robust analytics monitoring, and live tracking variables.
              </p>
            </div>

            {/* Compact Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <div className="bg-white/[0.03] border border-white/[0.05] p-2 rounded-lg">
                <p className="text-[9px] font-bold text-teal-300 tracking-wider uppercase">Security</p>
                <p className="text-xs font-medium text-white mt-0.5">256-Bit SSL</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] p-2 rounded-lg">
                <p className="text-[9px] font-bold text-cyan-300 tracking-wider uppercase">System</p>
                <p className="text-xs font-medium text-white mt-0.5">Live Node</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* 🔥 RIGHT PANEL - COMPACT LOGIN GRID */}
        {/* ===================================================== */}
        <div className="flex w-full md:w-1/2 flex-col justify-center items-center px-6 py-8 lg:px-12 bg-white">
          <div className="w-full max-w-sm space-y-5">
            
            {/* Form Intro */}
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Admin Login
              </h1>
              <p className="text-xs text-slate-400">
                Welcome back! Please enter your credentials.
              </p>
            </div>

            {/* Error Layer */}
            {error && (
              <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-500 text-center">
                {error}
              </div>
            )}

            {/* Inputs Track */}
            <div className="space-y-2.5">
              <Input
                placeholder="Email Address"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-medium transition-all focus:bg-white focus:border-teal-500 focus:ring-[4px] focus:ring-teal-500/10"
              />

              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-medium transition-all focus:bg-white focus:border-teal-500 focus:ring-[4px] focus:ring-teal-500/10"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-1">
              <Button
                onClick={handleNext}
                className="
                  w-full 
                  h-10 
                  rounded-lg 
                  bg-gradient-to-r from-teal-600 to-cyan-600 
                  text-white 
                  text-xs 
                  font-bold 
                  tracking-wide 
                  shadow-sm 
                  transition-all 
                  duration-300 
                  
                  hover:-translate-y-0.5 
                  hover:opacity-95 
                  active:translate-y-0
                "
              >
                Continue to Verification
              </Button>
            </div>

          </div>
        </div>

      </div>

      {/* REPOSITIONED OUTSIDE FOOTER STAMP (PREVENTS INNER SECTION BLOCKS STRATCHING) */}
      <div className="mt-4 text-[10px] text-slate-400 font-medium tracking-wide pointer-events-none select-none">
        © 2026 JPL MARKWIN PRIVATE LIMITED
      </div>
    </div>
  );
}