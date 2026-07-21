import {
  ShieldCheck,
  Lock,
  Database,
  MapPinned,
  Eye,
  Info,
} from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

export function PrivacyPolicyPage() {
  return (
    <StaticContentLayout title="Privacy Policy">
      <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6 text-slate-600 antialiased">
        
        {/* ── INTRO HEADER CARD ── */}
        <div className="rounded-xl border border-sky-100 bg-gradient-to-r from-slate-50 to-sky-50/40 p-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
            <h2 className="text-sm md:text-base font-bold text-slate-900">
              Your Privacy Matters at JPL Markwin
            </h2>
          </div>
          <p className="mt-1.5 text-xs md:text-sm text-slate-600 leading-relaxed">
            We value the trust you place in us and are committed to maintaining the highest standards of secure transactions, privacy protection, and responsible data handling.
          </p>
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="space-y-6">
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            
            {/* 1. Information We Collect */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-1">
                <Database className="h-4 w-4 text-indigo-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">1. Information We Collect</h2>
              </div>
              <ul className="space-y-2 text-xs md:text-sm">
                <li>• Name, email, phone number</li>
                <li>• Shipping and billing address</li>
                <li>• Cookies and usage analytics</li>
                <li>• Optional location data for delivery services</li>
              </ul>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-50 mt-2">
                We collect only the information necessary to provide a safe, efficient, and personalized shopping experience.
              </p>
            </div>

            {/* 2. Usage Purposes */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-1">
                <Eye className="h-4 w-4 text-emerald-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">2. Data Usage</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  "Order processing and delivery",
                  "Fraud detection and platform security",
                  "Customer support and issue resolution",
                  "Personalized offers and promotions",
                  "Improving product recommendations",
                  "Platform performance analytics"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-emerald-50/50 p-2 rounded border border-emerald-100 text-slate-700">
                    <span className="text-emerald-600 font-bold">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* 3. Data Security */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Lock className="h-4 w-4 text-sky-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">3. Data Security</h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                We do not sell, rent, or share customer information with third parties except where required for order fulfilment or by law. Your information is protected using secure servers, encrypted communication channels, strict access controls, and platform-level security safeguards to prevent unauthorized access, misuse, or data leakage.
              </p>
            </div>

            {/* 4. Location & Device */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <MapPinned className="h-4 w-4 text-amber-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">4. Location & Device Information</h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                With your permission, we may collect real-time location data to improve address accuracy, simplify saved addresses, and enable faster delivery. Device details such as browser, operating system, IP address, and usage activity may also be collected for security and analytics.
              </p>
            </div>
          </div>
        </div>

        {/* ── CONSENT NOTICE ── */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 flex gap-3 items-start">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm font-medium text-amber-800 leading-normal">
            By continuing to use JPL Markwin, you consent to the collection, usage, storage, and processing of your information as described in this Privacy Policy. Policy updates may occur periodically without prior notice.
          </p>
        </div>
        
      </div>
    </StaticContentLayout>
  );
}