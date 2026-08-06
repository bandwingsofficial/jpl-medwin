import {
  CreditCard,
  Wallet,
  Landmark,
  Smartphone,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import { StaticContentLayout } from "../components/static-content-layout";

const paymentMethods = [
  {
    icon: Smartphone,
    title: "UPI Payments",
    description: "Pay securely using BHIM, Google Pay, PhonePe, Paytm, or any UPI app.",
    color: "text-purple-600",
    bg: "bg-purple-50/50 border-purple-100/80",
  },
  {
    icon: CreditCard,
    title: "Credit Cards",
    description: "All major Visa, Mastercard, American Express, and RuPay cards accepted.",
    color: "text-blue-600",
    bg: "bg-blue-50/50 border-blue-100/80",
  },
  {
    icon: CreditCard,
    title: "Debit Cards",
    description: "Secure debit card payments from all leading domestic and international banks.",
    color: "text-sky-600",
    bg: "bg-sky-50/50 border-sky-100/80",
  },
  {
    icon: Landmark,
    title: "Net Banking",
    description: "Direct, instant payment panel using your personal or corporate bank account.",
    color: "text-emerald-600",
    bg: "bg-emerald-50/50 border-emerald-100/80",
  },
  {
    icon: Wallet,
    title: "Wallets",
    description: "Fast checkout using your pre-linked balances in supported digital wallets.",
    color: "text-amber-600",
    bg: "bg-amber-50/50 border-amber-100/80",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    description: "COD processing option available on eligible medical equipment and select pin codes.",
    color: "text-rose-600",
    bg: "bg-rose-50/50 border-rose-100/80",
  },
];

export function PaymentPage() {
  return (
    <StaticContentLayout title="Payment Information">
      {/* Expanded wrapper to max-w-7xl to maximize widescreen layout spacing */}
      <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6 text-slate-600 antialiased">
        
        {/* Simplified Header/Intro panel */}
        <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Secure Payment Options
          </h2>
          <p className="mt-1.5 text-xs md:text-sm text-slate-600 max-w-4xl leading-relaxed">
            We support multiple safe, compliant, and convenient payment avenues to ensure a 
            seamless procurement workflow for medical facilities and professionals. All workflows 
            are built over heavily guarded standard infrastructure properties.
          </p>
        </div>

        {/* Clean, tightened payment grid updated to scale smoothly up to large monitors */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;

            return (
              <div
                key={method.title}
                className={`group rounded-xl border p-4 transition-all duration-200 hover:shadow-sm ${method.bg}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-white shadow-xs border border-slate-100">
                    <Icon className={`h-5 w-5 ${method.color}`} />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">
                    {method.title}
                  </h3>
                </div>
                <p className="mt-2 text-xs md:text-sm text-slate-500 leading-normal">
                  {method.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Minimalist Security note */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="text-xs md:text-sm font-medium text-emerald-800 leading-normal">
              End-to-End Encryption: All online transactions are fully tokenized and processed through PCI-DSS compliant secure encrypted payment gateways.
            </p>
          </div>
        </div>
        
      </div>
    </StaticContentLayout>
  );
}