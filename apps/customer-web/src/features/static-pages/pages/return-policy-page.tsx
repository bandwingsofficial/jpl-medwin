import {
  ClipboardList,
  Package,
  Truck,
  Zap,
  RefreshCcw,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Wrench,
  Check,
} from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

const nonReturnableCategories = [
  {
    category: "Patient-Contact Products",
    items: "Tooth cream, Tooth Mousse, orthodontic trainers, chin caps, headgear, face masks",
  },
  {
    category: "Pharmacy & Health Products",
    items: "Hand sanitizers, manuals, normal saline",
  },
  {
    category: "Dental Consumables & Tools",
    items: "Applicator tips, cheek retractors, toothpastes, burs, disposable instruments",
  },
  {
    category: "Orthodontic Appliances",
    items: "Trainers, retainers, braces accessories",
  },
  {
    category: "Major Equipment",
    items: "Dental chairs",
  },
  {
    category: "Short Expiry Products",
    items: "Any product marked as Short Expiry",
  },
  {
    category: "Low-Value Single Units",
    items: "Products below ₹250 purchased as a single unit",
  },
];

export function ReturnPolicyPage() {
  return (
    <StaticContentLayout title="Return & Replacement Policy">
      {/* Expanded width wrapper to match Dentalkart full screen style */}
      <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6 text-slate-600 antialiased">
        
        {/* ── CLEAN TOP CARDS GRID ── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="flex items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">10-Day Window</h4>
              <p className="text-xs text-slate-500 mt-0.5">From confirmed delivery date</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">48-Hr Damage Report</h4>
              <p className="text-xs text-slate-500 mt-0.5">For missing or broken items</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Free Reverse Pickup</h4>
              <p className="text-xs text-slate-500 mt-0.5">We collect from your doorstep</p>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: ELIGIBILITY ── */}
        <section className="p-5 bg-white border border-slate-200/80 rounded-xl space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
            <ClipboardList className="h-4 w-4 text-slate-800" />
            <h2 className="text-sm md:text-base font-bold text-slate-900">
              1. Return & Replacement Eligibility
            </h2>
          </div>
          
          <p className="text-xs md:text-sm leading-relaxed text-slate-600">
            JPL Markwin offers a <strong className="text-slate-900 font-semibold">10-day Return and Replacement window</strong> starting from the timestamp your order is confirmed as delivered by our courier partners.
          </p>
          
          <div className="space-y-2">
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Core Requirements</p>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Unused and completely original factory condition.",
                "Product protective seal remains intact and untampered.",
                "All internal accessories, product manuals, and components are included.",
                "Original brand packaging must be completely unaltered and undamaged.",
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 bg-slate-50/50 rounded-lg border border-slate-100 text-xs md:text-sm">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-emerald-50/50 border border-emerald-100 p-3 flex gap-2.5 items-center">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-medium text-emerald-800">
              Our Commitment: <strong>Replacement first processing.</strong> Refunds are fulfilled only if replacement stock is completely unavailable.
            </p>
          </div>
        </section>

        {/* ── ROW: TIMELINES & STEP-BY-STEP PROCESS ── */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          
          {/* Box 2: Timeline & Verification */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-xl flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">2. Delivery Verification</h2>
              </div>
              <ul className="space-y-2 text-xs md:text-sm text-slate-600 list-disc list-inside leading-relaxed">
                <li>If the outer shipping container or seal is broken, <span className="text-slate-900 font-medium">refuse the delivery</span>.</li>
                <li>If outer package is secure, accept and inspect all inner components right away.</li>
                <li>Missing, incorrect, or transit-damaged items must be reported within <strong className="text-slate-900 font-semibold">48 hours</strong>.</li>
              </ul>
            </div>
            <div className="mt-4 rounded-lg bg-amber-50/40 border border-amber-100 p-2.5">
              <p className="text-xs font-medium text-amber-800">
                Notice: Delivery discrepancy claims submitted after 48 hours cannot be processed.
              </p>
            </div>
          </div>

          {/* Box 3: Raising Requests */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <HelpCircle className="h-4 w-4 text-blue-500" />
              <h2 className="text-sm md:text-base font-bold text-slate-900">3. How to Open a Claim Request</h2>
            </div>
            <ol className="space-y-2 text-xs md:text-sm text-slate-600 list-decimal pl-4 leading-relaxed">
              <li>Navigate to your dashboard panel and open <span className="font-medium text-slate-900">My Orders</span>.</li>
              <li>Locate your transaction row and click <span className="font-medium text-slate-900">Return / Replace</span>.</li>
              <li>Provide your reason details </li>
              <li>Upon approval, a free reverse doorstep pickup will be automatically scheduled.</li>
            </ol>
            <p className="text-[11px] text-slate-400 pt-1 leading-normal">
              *If your PIN code is locally unserviceable for reverse pickup, self-shipping coverage will be fully reimbursed up to ₹250.
            </p>
          </div>
        </div>

        {/* ── SECTION 4: EXCLUSIONS TABLE ── */}
        <section className="space-y-2.5">
          <h2 className="text-xs font-bold tracking-wide text-slate-800 uppercase px-1">
            4. Non-Returnable Categories
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80">
                  <th className="p-3 text-xs font-semibold text-slate-700 w-1/3">Category</th>
                  <th className="p-3 text-xs font-semibold text-slate-700">Exclusion Examples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {nonReturnableCategories.map((item) => (
                  <tr key={item.category} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-3 text-xs md:text-sm font-medium text-slate-900">{item.category}</td>
                    <td className="p-3 text-xs md:text-sm text-slate-500 leading-normal">{item.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── ADDITIONAL POLICY GUIDELINES ── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs flex gap-3 items-start">
            <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs md:text-sm font-bold text-slate-900">5. Quality Inspection</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Returned items undergo engineering testing before replacements or refunds are authorized.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs flex gap-3 items-start">
            <Wrench className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs md:text-sm font-bold text-slate-900">6. Technical Review</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Our support specialists will attempt phone troubleshooting for equipment before logging returns.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs flex gap-3 items-start">
            <RefreshCcw className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs md:text-sm font-bold text-slate-900">7. Extended Warranty</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">After the initial 10 days expire, standard direct manufacturer warranty conditions apply.</p>
            </div>
          </div>
        </div>

      </div>
    </StaticContentLayout>
  );
}