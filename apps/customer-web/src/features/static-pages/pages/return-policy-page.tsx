import {
  RefreshCw,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  PackageCheck,
  Undo2,
} from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

export function ReturnPolicyPage() {
  return (
    <StaticContentLayout title="Return, Replacement & Refund Policy">
      <div className="max-w-5xl mx-auto px-4 pb-12 space-y-8 text-slate-600 antialiased">
        
        {/* ── TOP HIGHLIGHTS ── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">7-Day Window</h4>
              <p className="text-xs text-slate-500 mt-0.5">From delivery date</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">48-Hr Reporting</h4>
              <p className="text-xs text-slate-500 mt-0.5">For damages/missing</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Free Pickup</h4>
              <p className="text-xs text-slate-500 mt-0.5">Doorstep collection</p>
            </div>
          </div>
        </div>

        {/* ── POLICY CONTENT ── */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Section 1: Policy Details */}
          <section className="space-y-4 md:col-span-2">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">Policy Overview</h2>
            <p className="text-sm leading-relaxed">
              At <strong>JPL Markwin Private Limited</strong>, customer satisfaction is our priority. We offer a 7-day Return & Replacement policy from the confirmed delivery date.
            </p>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Return & Replacement Window:</strong> Within 7 days of confirmed delivery.</li>
              <li>• <strong>Damage/Missing Items:</strong> Must be reported within 48 hours of delivery with supporting photos/videos.</li>
              <li>• <strong>Eligibility:</strong> Products must be unused, unopened, in their original packaging, and with all factory seals intact.</li>
              <li>• <strong>Free Reverse Pickup:</strong> Available for eligible return and replacement requests.</li>
              <li>• <strong>Replacement First:</strong> We prioritize sending a replacement. A refund will be processed only if the replacement product is unavailable.</li>
              <li>• <strong>Refund Processing:</strong> Approved refunds are credited to the original payment method within 7–10 business days after inspection.</li>
              <li>• <strong>Non-Eligible Returns:</strong> Products that are used, opened, tampered with, damaged due to misuse, or returned without original packaging are not eligible.</li>
              <li>• <strong>Shipping Charges:</strong> Non-refundable unless the return is due to an incorrect, defective, or damaged product supplied by JPL Markwin.</li>
            </ul>
          </section>

          {/* Section 2: Delivery Verification */}
          <section className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900">Delivery Verification</h2>
            </div>
            <ul className="space-y-3 text-sm list-disc pl-4">
              <li>If the outer shipping container or seal is broken, <strong>refuse the delivery</strong>.</li>
              <li>If the outer package is secure, accept and inspect all inner components right away.</li>
              <li>Missing, incorrect, or transit-damaged items must be reported within <strong>48 hours</strong>.</li>
            </ul>
            <p className="mt-4 text-xs font-medium text-amber-700 bg-amber-50 p-2 rounded">
              Notice: Delivery discrepancy claims submitted after 48 hours cannot be processed.
            </p>
          </section>

          {/* Section 3: Claim Request */}
          <section className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold text-slate-900">How to Open a Claim</h2>
            </div>
            <ol className="space-y-2 text-sm list-decimal pl-4">
              <li>Navigate to your dashboard panel and open <strong>My Orders</strong>.</li>
              <li>Locate your transaction row and click <strong>Return / Replace</strong>.</li>
              <li>Provide your reason details.</li>
              <li>Upon approval, a free reverse doorstep pickup will be automatically scheduled.</li>
            </ol>
            <p className="mt-4 text-xs text-slate-500 italic">
              *If your PIN code is locally unserviceable for reverse pickup, self-shipping coverage will be fully reimbursed.
            </p>
          </section>
        </div>

        {/* Footer Note */}
        <div className="text-center py-4 border-t">
          <p className="text-sm text-slate-500">
            Our goal is to provide a smooth, transparent, and hassle-free after-sales experience for every customer.
          </p>
        </div>
      </div>
    </StaticContentLayout>
  );
}