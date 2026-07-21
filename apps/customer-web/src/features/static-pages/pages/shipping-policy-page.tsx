import {
  Truck,
  Clock3,
  MapPinned,
  PackageCheck,
  AlertTriangle,
  ShieldCheck,
  Undo2,
  RefreshCw,
  FileText,
} from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

export function ShippingPolicyPage() {
  return (
    <StaticContentLayout title="Shipping & Returns Policy">
      <div className="max-w-5xl mx-auto px-4 pb-12 space-y-10 text-slate-600 antialiased">
        
        {/* 1. Return, Replacement & Refund Policy */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <Undo2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">1. Return, Replacement & Refund Policy</h2>
          </div>
          <p className="text-sm leading-relaxed">
            At <strong>JPL Markwin Private Limited</strong>, customer satisfaction is our priority. We offer a <strong>7-day Return & Replacement policy</strong> from the confirmed delivery date.
          </p>
          <ul className="grid gap-2 text-sm list-none">
            {[
              "Return & Replacement Window: Within 7 days of confirmed delivery.",
              "Damage/Missing Items: Must be reported within 48 hours of delivery with supporting photos/videos.",
              "Eligibility: Products must be unused, unopened, in original packaging, with factory seals intact.",
              "Free Reverse Pickup: Available for eligible return and replacement requests.",
              "Replacement First: We prioritize sending a replacement; refunds are processed only if the replacement is unavailable.",
              "Refund Processing: Credited to the original payment method within 7–10 business days after inspection.",
              "Non-Eligible Returns: Used, opened, tampered, or misused products are not eligible.",
              "Shipping Charges: Non-refundable unless the return is due to an incorrect, defective, or damaged product supplied by us."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span> {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 2. Delivery Verification & Claims */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <PackageCheck className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">2. Delivery Verification</h2>
            </div>
            <ul className="text-sm space-y-3 list-disc pl-4">
              <li>If the outer shipping container or seal is broken, <strong>refuse the delivery</strong>.</li>
              <li>If outer package is secure, accept and inspect all inner components immediately.</li>
              <li>Missing, incorrect, or transit-damaged items must be reported within <strong>48 hours</strong>.</li>
            </ul>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-xs text-amber-800 font-medium">
              Notice: Delivery discrepancy claims submitted after 48 hours cannot be processed.
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">3. How to Open a Claim</h2>
            </div>
            <ol className="text-sm space-y-2 list-decimal pl-4">
              <li>Navigate to your dashboard and open <strong>My Orders</strong>.</li>
              <li>Locate your transaction and click <strong>Return / Replace</strong>.</li>
              <li>Provide your reason for the request.</li>
              <li>Upon approval, a free reverse doorstep pickup will be scheduled.</li>
            </ol>
            <p className="text-xs text-slate-500 italic">
              *If your PIN code is unserviceable for pickup, self-shipping coverage will be reimbursed.
            </p>
          </section>
        </div>

        {/* 3. Shipping Policy */}
        <section className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3 pb-3">
            <Truck className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">4. Shipping Policy</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
            <ul className="space-y-2">
              <li>• Processing Time: 1–2 business days.</li>
              <li>• Standard Delivery: 3–7 business days.</li>
              <li>• Stock verification required before dispatch.</li>
            </ul>
            <ul className="space-y-2">
              <li>• Bulk/Specialized items: May require extra time.</li>
              <li>• Weekends/Holidays: Processing may delay slightly.</li>
              <li>• Tracking: Shared once the order is dispatched.</li>
            </ul>
          </div>
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
            * Delivery is available pan-India. Remote locations may require additional time. Some sensitive medical devices may be restricted in select areas.
          </p>
        </section>

      </div>
    </StaticContentLayout>
  );
}