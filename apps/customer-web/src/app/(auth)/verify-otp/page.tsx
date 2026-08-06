import { OtpForm } from "@/features/auth/components/otp-form";

export default function Page() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl px-4">
        <OtpForm />
      </div>
    </div>
  );
}