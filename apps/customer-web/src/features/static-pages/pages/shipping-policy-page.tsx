import {
  Truck,
  Clock3,
  MapPinned,
  PackageCheck,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

const shippingHighlights = [
  {
    icon: Clock3,
    title: "24–48 Hr Processing",
    description: "Orders are packed and dispatched quickly",
    color: "text-blue-600",
    bg: "bg-blue-50/50",
  },
  {
    icon: Truck,
    title: "Pan India Delivery",
    description: "Based on serviceable courier pin codes",
    color: "text-emerald-600",
    bg: "bg-emerald-50/50",
  },
  {
    icon: PackageCheck,
    title: "Secure Packaging",
    description: "Safe packing for medical & dental products",
    color: "text-amber-600",
    bg: "bg-amber-50/50",
  },
];

export function ShippingPolicyPage() {
  return (
    <StaticContentLayout title="Shipping Policy">
      {/* Expanded wrapper to max-w-7xl for full screen usage */}
      <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6 text-slate-600 antialiased">
        
        {/* ── TOP ACTION SUMMARY CARDS ── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {shippingHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div 
                key={item.title} 
                className="flex flex-col items-center text-center p-4 bg-white border border-slate-100 rounded-xl shadow-xs"
              >
                <div className={`p-2.5 rounded-lg ${item.bg} ${item.color} shrink-0 mb-2`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── MAIN SECTIONS CONTENT ── */}
        <div className="space-y-6">
          
          {/* Row 1: Order Processing & Delivery Coverage side by side */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            
            {/* Section 1: Order Processing & Dispatch */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <Truck className="h-4 w-4 text-slate-900 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  1. Order Processing & Dispatch
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                At <strong className="text-slate-900 font-medium">JPL Markwin</strong>, most orders are processed within{" "}
                <strong className="text-slate-900 font-semibold">24–48 business hours</strong> after successful payment confirmation.
              </p>
              <ul className="list-disc space-y-1 pl-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                <li>Orders are dispatched only after stock verification.</li>
                <li>Bulk and specialized equipment may need extra processing time.</li>
                <li>Weekend and holiday orders may be delayed slightly.</li>
              </ul>
            </div>

            {/* Section 2: Delivery Coverage */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <MapPinned className="h-4 w-4 text-emerald-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  2. Delivery Coverage
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Delivery is available across serviceable pin codes supported by our courier and logistics partners.
              </p>
              <ul className="list-disc space-y-1 pl-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                <li>Remote locations may require additional delivery time.</li>
                <li>Courier partner availability may vary by region.</li>
                <li>Some sensitive medical devices may be restricted in select areas.</li>
              </ul>
            </div>

          </div>

          {/* Row 2: Timelines & Delays side by side */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 pt-2">
            
            {/* Section 3: Estimated Delivery Timeline */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <Clock3 className="h-4 w-4 text-blue-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  3. Estimated Delivery Timeline
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Standard delivery timelines typically range between{" "}
                <strong className="text-slate-900 font-semibold">3–7 business days</strong> depending on location, product type, and courier network.
              </p>
              <p className="text-xs text-blue-700 font-medium">
                * Large equipment, bulk institutional orders, and fragile items may require 5–10 business days.
              </p>
            </div>

            {/* Section 4: Delays & Exceptional Situations */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  4. Delays & Exceptional Situations
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                While we aim to meet promised timelines, delays may occur due to extreme weather conditions, festive sale periods, unexpected courier disruptions, or inventory reconciliation delays.
              </p>
              <p className="text-xs text-amber-700 font-medium">
                * JPL Markwin is not liable for courier delays caused by external logistics partners or force majeure conditions.
              </p>
            </div>

          </div>

          {/* Section 5: Shipment Tracking (Full span baseline) */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <PackageCheck className="h-4 w-4 text-sky-600 shrink-0" />
              <h2 className="text-sm md:text-base font-bold text-slate-900">
                5. Shipment Tracking
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Once your order is shipped, tracking details will be available under <strong className="text-slate-900 font-medium">My Orders</strong>:
            </p>
            <ul className="list-disc space-y-1 pl-4 text-xs md:text-sm text-slate-600 leading-relaxed">
              <li>Live courier status updates and shipment dispatch confirmation.</li>
              <li>Expected delivery date and delivery completion updates.</li>
            </ul>
          </div>

        </div>

        {/* ── FOOTER NOTE ── */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 flex gap-2.5 items-start">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm font-medium text-emerald-800 leading-normal">
            For damaged packages, tampered seals, or missing items, please report within <strong>48 hours</strong> of delivery for quick resolution under our return and replacement policy.
          </p>
        </div>
        
      </div>
    </StaticContentLayout>
  );
}