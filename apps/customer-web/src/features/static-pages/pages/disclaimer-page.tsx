import {
  AlertTriangle,
  ShieldAlert,
  FileWarning,
  Stethoscope,
  PackageSearch,
} from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

const disclaimerPoints = [
  "Product images are for reference purposes only.",
  "Manufacturer packaging may change without prior notice.",
  "Specifications may vary based on model revisions.",
  "Availability and accessories may differ by batch.",
];

export function DisclaimerPage() {
  return (
    <StaticContentLayout title="Disclaimer">
      {/* Changed max-w-3xl to max-w-7xl and adjusted padding 
        to stretch elements across the full screen width smoothly.
      */}
      <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6 text-slate-600 antialiased">
        
        {/* ── INTRO HEADER CARD ── */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <h2 className="text-sm md:text-base font-bold text-slate-900">
              Important Product & Usage Disclaimer
            </h2>
          </div>
          <p className="mt-1 text-xs md:text-sm text-slate-600 leading-relaxed">
            The information available on <strong className="text-slate-900 font-medium">JPL Markwin</strong> is
            provided for general product reference, comparison, and procurement support purposes only.
          </p>
        </div>

        {/* ── MAIN CONTENT SECTIONS ── */}
        <div className="space-y-6">
          
          {/* Section 1: Product Information Variations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <PackageSearch className="h-4 w-4 text-emerald-600 shrink-0" />
              <h2 className="text-sm md:text-base font-bold text-slate-900">
                1. Product Information Variations
              </h2>
            </div>
            
            {/* Expanded to a responsive 4-column layout on desktops to mimic Dentalkart's wide card style */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {disclaimerPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-xs md:text-sm text-slate-700"
                >
                  • {point}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 & 3: Multi-column arrangement on wider screens */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            
            {/* Section 2: Professional Verification Required */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <Stethoscope className="h-4 w-4 text-emerald-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  2. Professional Verification Required
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Doctors, clinics, hospitals, and institutions are strongly advised to verify product compatibility, technical specifications, intended use, and regulatory suitability before purchase or deployment.
              </p>
            </div>

            {/* Section 3: Limitation of Liability */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  3. Limitation of Liability
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                JPL Markwin shall not be liable for product misuse, unauthorized operation, improper installation, incorrect clinical decisions, or procurement decisions made solely based on the content displayed on this platform.
              </p>
            </div>

          </div>

        </div>

        {/* ── FINAL WARNING FOOTER NOTE ── */}
        <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-3.5 flex gap-2.5 items-start">
          <FileWarning className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm font-medium text-rose-800 leading-normal">
            Always refer to the manufacturer’s official technical manuals, product inserts, certifications, and professional guidelines before usage.
          </p>
        </div>

      </div>
    </StaticContentLayout>
  );
}