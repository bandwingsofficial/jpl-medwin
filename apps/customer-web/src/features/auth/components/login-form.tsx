"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/use-login";

import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const { mutateAsync, isPending } = useLogin();

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const payload = value.includes("@")
        ? { email: value }
        : { phone: value };

      await mutateAsync(payload);

      sessionStorage.setItem("login_identifier", value);
      router.push("/verify-otp");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* LEFT SIDE FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6">

          {/* 🔥 COMPANY NAME */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-green-400 bg-clip-text text-transparent">
              JPL MARKWIN
            </h1>
          </div>

          <Card className="w-full p-8 space-y-6 shadow-lg rounded-2xl">

            {/* Header */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-500">
                Login with your email or phone number
              </p>
            </div>

            {/* Input */}
            <div className="space-y-2">
              <Label>Email or Phone</Label>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter email or phone"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Button */}
            <Button
              onClick={handleSubmit}
              className="w-full"
              loading={isPending}
            >
              Continue
            </Button>

            {/* Footer */}
            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our Terms & Privacy Policy
            </p>

          </Card>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="/Images/login-Image.jpg"
          alt="Login"
          className="h-full w-full object-cover"
        />

        {/* Overlay text */}
        <div className="absolute inset-0 bg-black/30 flex items-end p-10">
          <h2 className="text-white text-3xl font-semibold">
            Welcome to JPL Markwin - Your Trusted Partner in Quality and Service  
          </h2>
        </div>
      </div>

    </div>
  );
}