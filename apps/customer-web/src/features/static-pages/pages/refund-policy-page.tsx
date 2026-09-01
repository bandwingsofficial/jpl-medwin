import { CreditCard, Wallet, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

export function RefundPolicyPage() {
  return (
    <StaticContentLayout title="Refund Policy">
      <div className="max-w-5xl mx-auto px-4 pb-12 space-y-8 text-slate-600 antialiased">
        
        {/* ── TOP SUMMARY CARDS ── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Refund Processing</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Approved refunds are credited to the original payment method within <strong>7–10 business days</strong> after inspection.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Replacement First</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                We prioritize sending a replacement; a refund is processed only if the replacement product is unavailable.
              </p>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="space-y-6">
          <section className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Refund & Settlement Details</h2>
            
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                At <strong>JPL Markwin Private Limited</strong>, we strive to ensure a smooth, transparent, and hassle-free after-sales experience.
              </p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Refund Eligibility:</strong> Only approved returns that pass our quality inspection are eligible for a refund.</li>
                <li><strong>Processing Timeline:</strong> Refunds are initiated and credited to the original payment source within <strong>7–10 business days</strong> after the returned product has been inspected at our facility.</li>
                <li><strong>Shipping Charges:</strong> Original shipping charges are non-refundable unless the return is due to an incorrect, defective, or damaged product supplied by JPL Markwin.</li>
                <li><strong>Condition for Refund:</strong> Refunds are only issued if a replacement for the defective or incorrect item cannot be provided.</li>
              </ul>
            </div>
          </section>

          {/* ── IMPORTANT NOTE ── */}
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 flex gap-3 items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Important Note</h4>
              <p className="text-xs md:text-sm text-amber-800 mt-1 leading-relaxed">
                Please ensure that the returned products are unused, unopened, and in their original packaging with all factory seals intact. Refunds cannot be processed for products that are used, opened, tampered with, or damaged due to misuse.
              </p>
            </div>
          </div>
        </div>

        {/* ── FOOTER CONTACT ── */}
        <div className="text-center pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Need help with a refund? Contact us at <strong>Connect@jplmedwin.com</strong> or call <strong>9187969350</strong>.
          </p>
        </div>
        
      </div>
    </StaticContentLayout>
  );
}