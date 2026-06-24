import { ChevronUp, CreditCard, Wallet, Clock, AlertCircle } from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

const refundFaqs = [
  {
    title: "When will I get my refund?",
    content: (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="p-4 bg-slate-50/60 border border-slate-100 rounded-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="h-4 w-4 text-purple-600" />
            <h4 className="text-sm font-bold text-slate-900">Order Cancellations</h4>
          </div>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            If you cancel an order before shipping, the process is instant and your refund will be fully initiated within <strong className="text-slate-900 font-semibold">2 to 4 hours</strong>.
          </p>
        </div>

        <div className="p-4 bg-slate-50/60 border border-slate-100 rounded-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Returned Shipments</h4>
          </div>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            Once a returned item is received at our facility and passes quality verification testing, the refund transaction is generated within <strong className="text-slate-900 font-semibold">48 hours</strong>.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "How will I get my refund?",
    content: (
      <div className="space-y-3 text-xs md:text-sm text-slate-600 leading-relaxed">
        <p>
          For <strong className="text-slate-900 font-medium">Prepaid Orders</strong>, funds are credited directly back to the original source card, bank account, or digital wallet dashboard panel used during transaction checkout.
        </p>
        <p>
          For <strong className="text-slate-900 font-medium">Cash on Delivery (COD)</strong>, JPL Medwin dispatches an automated secure verification link via registered email and SMS text channels, allowing you to quickly input preferred banking routing properties.
        </p>
        <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-slate-400 text-xs">
          <span>*</span>
          <span>Standard interbank settlement clearing timelines normally take <strong>5–7 business days</strong> subject to routine automated RBI routing delays.</span>
        </div>
      </div>
    ),
  },
];

export function RefundPolicyPage() {
  return (
    <StaticContentLayout title="Refunds">
      {/* Expanded wrapper to max-w-7xl for clean full screen usage */}
      <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6 text-slate-600 antialiased">
        
        {/* ── TOP ACTION SUMMARY CARDS ── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="flex items-start gap-3.5 p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Prepaid Refund</h3>
              <p className="mt-1 text-xs md:text-sm text-slate-500 leading-normal">
                Returned to original payment source instrument within 5–7 banking business days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs">
            <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600 shrink-0">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">COD Refund</h3>
              <p className="mt-1 text-xs md:text-sm text-slate-500 leading-normal">
                Complimentary automated digital payout link generated for instant bank account transfer.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTIONS / FAQ WRAPPERS GRID ── */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {refundFaqs.map((faq) => (
            <div
              key={faq.title}
              className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-slate-100 mb-4">
                  <h2 className="text-sm md:text-base font-bold text-slate-900">
                    {faq.title}
                  </h2>
                  <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                </div>

                <div>
                  {faq.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER NOTE ── */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5 flex gap-2.5 items-start">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm font-medium text-amber-800 leading-normal">
            Processing Note: Final transaction realization pacing remains subject to local clearings, public banking holidays, and external provider settlement protocols.
          </p>
        </div>
        
      </div>
    </StaticContentLayout>
  );
}