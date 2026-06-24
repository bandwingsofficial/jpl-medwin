// apps/customer-web/src/app/verify-otp/page.tsx

import { OtpForm } from "@/features/auth/components/otp-form";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <OtpForm />
    </div>
  );
}