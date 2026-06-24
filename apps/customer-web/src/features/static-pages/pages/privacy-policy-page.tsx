import {
  ShieldCheck,
  Lock,
  Database,
  MapPinned,
  Bell,
  Eye,
} from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

const dataCollected = [
  "Name, email, phone number",
  "Shipping and billing address",
  "Cookies and usage analytics",
  "Optional location data for delivery services",
];

const usagePurposes = [
  "Order processing and delivery",
  "Fraud detection and platform security",
  "Customer support and issue resolution",
  "Personalized offers and promotions",
  "Improving product recommendations",
  "Platform performance analytics",
];

export function PrivacyPolicyPage() {
  return (
    <StaticContentLayout title="Privacy Policy">
      {/* Expanded wrapper to max-w-7xl to make full use of the screen layout */}
      <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6 text-slate-600 antialiased">
        
        {/* ── INTRO HEADER CARD ── */}
        <div className="rounded-xl border border-sky-100 bg-gradient-to-r from-slate-50 to-sky-50/40 p-5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
            <h2 className="text-sm md:text-base font-bold text-slate-900">
              Your Privacy Matters at JPL Markwin
            </h2>
          </div>
          <p className="mt-1.5 text-xs md:text-sm text-slate-600 leading-relaxed">
            We value the trust you place in us and are committed to maintaining
            the highest standards of secure transactions, privacy protection,
            and responsible data handling.
          </p>
        </div>

        {/* ── MAIN CONTENT DUAL GRID SYSTEM ── */}
        <div className="space-y-6">
          
          {/* Row 1: Collection vs Usage Purposes Side-by-Side */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            
            {/* Section 1: Information We Collect */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-3">
                  <Database className="h-4 w-4 text-indigo-600 shrink-0" />
                  <h2 className="text-sm md:text-base font-bold text-slate-900">
                    1. Information We Collect
                  </h2>
                </div>
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                  {dataCollected.map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 text-xs text-slate-700 font-medium"
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pt-3 border-t border-slate-50 mt-3">
                We collect only the information necessary to provide a safe, efficient, and personalized shopping experience.
              </p>
            </div>

            {/* Section 2: How We Use Your Data */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-3">
                <Eye className="h-4 w-4 text-emerald-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  2. How We Use Your Data
                </h2>
              </div>
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                {usagePurposes.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-emerald-100/60 bg-emerald-50/30 p-2.5 text-xs text-slate-700 font-medium"
                  >
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Row 2: Security vs Location Side-by-Side */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            
            {/* Section 3: Data Security */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-2">
                <Lock className="h-4 w-4 text-sky-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  3. Data Security
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Your information is protected using secure servers, encrypted communication channels, strict access controls, and platform-level security safeguards to prevent unauthorized access, misuse, or data leakage.
              </p>
            </div>

            {/* Section 4: Location & Device Information */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-2">
                <MapPinned className="h-4 w-4 text-amber-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  4. Location & Device Information
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                With your permission, we may collect real-time location data to improve address accuracy, simplify saved addresses, and enable faster delivery through our logistics partners.
              </p>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Device details such as browser, operating system, IP address, and usage activity may also be collected for security and analytics.
              </p>
            </div>

          </div>

          {/* Row 3: Marketing Rules Full Baseline Span */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-2">
              <Bell className="h-4 w-4 text-purple-600 shrink-0" />
              <h2 className="text-sm md:text-base font-bold text-slate-900">
                5. Marketing & Notifications
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              We may send order updates, customer support notifications, promotional offers, and relevant product recommendations based on your browsing and purchase history.
            </p>
          </div>

        </div>

        {/* ── FINAL CONSENT NOTICE ── */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 flex gap-2.5 items-start">
          <p className="text-xs md:text-sm font-medium text-amber-800 leading-normal">
            By continuing to use JPL Markwin, you consent to the collection, usage, storage, and processing of your information as described in this Privacy Policy. Policy updates may occur periodically without prior notice.
          </p>
        </div>
        
      </div>
    </StaticContentLayout>
  );
}