import {
  ShieldCheck,
  FileText,
  Ban,
  CreditCard,
  Scale,
  Lock,
} from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

const paymentMethods = [
  "Debit Card",
  "Credit Card",
  "Net Banking",
  "UPI",
  "Wallets",
  "Cash on Delivery",
];

const prohibitedActivities = [
  "Fraudulent orders or fake purchases",
  "Unauthorized copying or resale of content",
  "Misuse of medical or dental equipment",
  "Providing false registration or license details",
  "Attempting unauthorized account access",
  "Using the platform for unlawful activities",
];

export function TermsOfUsePage() {
  return (
    <StaticContentLayout title="Terms of Use">
      {/* Expanded wrapper from max-w-3xl to max-w-7xl to spread over the whole screen */}
      <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6 text-slate-600 antialiased">
        
        {/* ── INTRO HEADER CARD ── */}
        <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 shrink-0" />
            <h2 className="text-sm md:text-base font-bold text-slate-900">
              Welcome to JPL Markwin
            </h2>
          </div>
          <p className="mt-1 text-xs md:text-sm text-slate-600 leading-relaxed">
            By accessing, browsing, or purchasing from JPL Markwin, you
            unconditionally agree to comply with all our terms, policies, and
            legal obligations. If you do not agree, please do not use this platform.
          </p>
        </div>

        {/* ── MAIN CONTENT SECTIONS ── */}
        <div className="space-y-6">
          
          {/* Top Grid: User Responsibility & Orders/Pricing side by side on desktop */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            
            {/* Section 1: User Responsibility */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  1. User Responsibility
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                You are fully responsible for selecting and purchasing the correct products after your own analysis and professional judgment.
              </p>
              <ul className="list-disc space-y-1 pl-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                <li>Provide accurate account and delivery info.</li>
                <li>Maintain strict password confidentiality.</li>
                <li>Orders placed are considered authorized by you.</li>
                <li>False professional registration details are strictly prohibited.</li>
              </ul>
            </div>

            {/* Section 2: Orders & Pricing */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <Scale className="h-4 w-4 text-slate-900 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  2. Orders, Pricing & Availability
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Product pricing, availability, packaging, and content displayed on JPL Markwin may change without prior notice.
              </p>
              <ul className="list-disc space-y-1 pl-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                <li>We reserve the right to cancel unavailable orders.</li>
                <li>Prices may be revised at any time without notice.</li>
                <li>Once dispatched, order modifications are not possible.</li>
                <li>Product images are for reference and may differ from actual items.</li>
              </ul>
            </div>

          </div>

          {/* Section 3: Payments (Full horizontal layout) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <CreditCard className="h-4 w-4 text-indigo-600 shrink-0" />
              <h2 className="text-sm md:text-base font-bold text-slate-900">
                3. Payments & Refunds
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Payments are processed securely through approved third-party payment gateways.
            </p>
            {/* Expanded layout up to 6 columns on large screens */}
            <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {paymentMethods.map((method) => (
                <div
                  key={method}
                  className="rounded-lg border border-slate-100 bg-slate-50/50 p-2 text-center text-xs text-slate-700 font-medium"
                >
                  {method}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              * Refund timelines depend on payment mode, banking systems, and order verification status.
            </p>
          </div>

          {/* Section 4: Prohibited Activities (Full horizontal layout) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <Ban className="h-4 w-4 text-red-600 shrink-0" />
              <h2 className="text-sm md:text-base font-bold text-slate-900">
                4. Prohibited Activities
              </h2>
            </div>
            {/* Expanded to 3 columns horizontally on large screens */}
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {prohibitedActivities.map((activity) => (
                <div
                  key={activity}
                  className="rounded-lg border border-red-100/50 bg-red-50/20 p-2.5 text-xs md:text-sm text-slate-700"
                >
                  ✕ {activity}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid: Privacy & Legal side by side on desktop */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 pt-2">
            
            {/* Section 5: Privacy */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <Lock className="h-4 w-4 text-sky-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  5. Privacy & Data Security
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Your personal information such as name, contact details, shipping address, transaction information, and device details are securely stored and used only for order processing, account services, and communication.
              </p>
            </div>

            {/* Section 6: Legal */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <Scale className="h-4 w-4 text-amber-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  6. Legal Jurisdiction
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Any disputes arising from the use of JPL Markwin shall be subject to the applicable jurisdiction as per company registration and governing laws.
              </p>
            </div>

          </div>

        </div>

        {/* ── FINAL NOTICE ── */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-3.5">
          <p className="text-xs md:text-sm font-medium text-amber-800 leading-normal">
            JPL Markwin reserves the right to modify these Terms of Use at any time without prior notice. Continued use of the platform implies acceptance of updated terms.
          </p>
        </div>

      </div>
    </StaticContentLayout>
  );
}