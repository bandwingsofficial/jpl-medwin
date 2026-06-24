"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { 
  useCoinConfig, 
  useCreateCoinConfig 
} from "@/features/coin-management/hooks/use-coin-config";
import { 
  Coins, 
  IndianRupee, 
  ShoppingBag, 
  Percent, 
  CalendarDays, 
  CheckCircle2, 
  XCircle,   
  X 
} from "lucide-react";

const configSchema = z.object({
  earnRateAmount: z.number().min(1),
  earnRateCoins: z.number().min(1),
  coinValue: z.number().min(1),
  minimumOrderAmount: z.number().min(1),
  maxRedemptionPercentage: z.number().min(1).max(100),
  expiryMonths: z.number().min(1),
  isActive: z.boolean(),
});

type ConfigFormValues = z.infer<typeof configSchema>;

export const CoinConfigForm = () => {
  const [open, setOpen] = useState(false);

  // =========================
  // GET CONFIG
  // =========================
  const { data: config, isLoading } = useCoinConfig();

  // =========================
  // FORM
  // =========================
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      earnRateAmount: 100,
      earnRateCoins: 10,
      coinValue: 1,
      minimumOrderAmount: 200,
      maxRedemptionPercentage: 20,
      expiryMonths: 6,
      isActive: true,
    },
  });

  // =========================
  // RESET FORM
  // =========================
  useEffect(() => {
    if (!config) return;

    reset({
      earnRateAmount: config.earnRateAmount,
      earnRateCoins: config.earnRateCoins,
      coinValue: config.coinValue,
      minimumOrderAmount: config.minimumOrderAmount,
      maxRedemptionPercentage: config.maxRedemptionPercentage,
      expiryMonths: config.expiryMonths,
      isActive: config.isActive,
    });
  }, [config, reset]);

  // =========================
  // MUTATION
  // =========================
  const { mutate, isPending } = useCreateCoinConfig();

  // =========================
  // SUBMIT
  // =========================
  const onSubmit = (values: ConfigFormValues) => {
    mutate(values, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  // =========================
  // LOADING
  // =========================
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-100 py-10 text-center text-sm font-medium text-gray-400">
        Loading configuration...
      </div>
    );
  }

  return (
    <>
      {/* MAIN CARD CONTAINER */}
      <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col shadow-sm">
        
        {/* HEADER BLOCK */}
        <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600 border border-teal-100/30">
              <Coins className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-none">
                Coin System Configuration
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-1">
                Manage rule weights for automated system earning parameters, user redemption, and balances.
              </p>
            </div>
          </div>

          {/* 👉 FIX: Restored button look to clear text invisible glitch */}
          <Button
            onClick={() => setOpen(true)}
            className="rounded-xl px-4 border border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900"
          >
            Edit Configuration
          </Button>
        </div>

        {/* DISPLAY METRICS CONFIG GRID */}
        <div className="p-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ConfigItem
            label="Earn Rate Amount"
            value={`₹${config?.earnRateAmount}`}
            icon={IndianRupee}
            iconClass="bg-blue-50 text-blue-600 border-blue-100/30"
          />

          <ConfigItem
            label="Earn Rate Coins"
            value={`${config?.earnRateCoins} Coins`}
            icon={Coins}
            iconClass="bg-teal-50 text-teal-600 border-teal-100/30"
          />

          <ConfigItem
            label="Coin Value"
            value={`₹${config?.coinValue}`}
            icon={IndianRupee}
            iconClass="bg-green-50 text-green-600 border-green-100/30"
          />

          <ConfigItem
            label="Minimum Order"
            value={`₹${config?.minimumOrderAmount}`}
            icon={ShoppingBag}
            iconClass="bg-purple-50 text-purple-600 border-purple-100/30"
          />

          <ConfigItem
            label="Max Redemption"
            value={`${config?.maxRedemptionPercentage}%`}
            icon={Percent}
            iconClass="bg-indigo-50 text-indigo-600 border-indigo-100/30"
          />

          <ConfigItem
            label="Expiry Lifecycle"
            value={`${config?.expiryMonths} Months`}
            icon={CalendarDays}
            iconClass="bg-amber-50 text-amber-600 border-amber-100/30"
          />

          <ConfigItem
            label="System Status"
            value={config?.isActive ? "Active" : "Inactive"}
            active={config?.isActive}
            icon={config?.isActive ? CheckCircle2 : XCircle}
            iconClass={config?.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100/30" : "bg-rose-50 text-rose-600 border-rose-100/30"}
          />
        </div>
      </div>

      {/* POPUP SYSTEM FORM OVERLAY DIALOG */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col transform scale-100 transition-all">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Edit Configuration Settings
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Tweak system rule triggers for your digital wallet ecosystem.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* INTERACTIVE DATA CONVERSION FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 max-h-[60vh] overflow-y-auto">
                <FormInput label="Earn Rate Amount (₹)" error={errors.earnRateAmount?.message}>
                  <input
                    type="number"
                    {...register("earnRateAmount", { valueAsNumber: true })}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                  />
                </FormInput>

                <FormInput label="Earn Rate Reward (Coins)" error={errors.earnRateCoins?.message}>
                  <input
                    type="number"
                    {...register("earnRateCoins", { valueAsNumber: true })}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                  />
                </FormInput>

                <FormInput label="Single Coin Value (₹)" error={errors.coinValue?.message}>
                  <input
                    type="number"
                    {...register("coinValue", { valueAsNumber: true })}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                  />
                </FormInput>

                <FormInput label="Minimum Bound Order Amount (₹)" error={errors.minimumOrderAmount?.message}>
                  <input
                    type="number"
                    {...register("minimumOrderAmount", { valueAsNumber: true })}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                  />
                </FormInput>

                <FormInput label="Max Redemption Limit per Order (%)" error={errors.maxRedemptionPercentage?.message}>
                  <input
                    type="number"
                    {...register("maxRedemptionPercentage", { valueAsNumber: true })}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                  />
                </FormInput>

                <FormInput label="Coin Expiry Period (Months)" error={errors.expiryMonths?.message}>
                  <input
                    type="number"
                    {...register("expiryMonths", { valueAsNumber: true })}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                  />
                </FormInput>

                {/* ACTIVE FLAG SLIDER EMULATOR BLOCK */}
                <div className="sm:col-span-2 flex items-center justify-between p-3.5 border border-gray-100 rounded-xl bg-gray-50/50 mt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-gray-900">Activate System Framework</span>
                    <span className="text-[11px] font-medium text-gray-400">Toggle whether point conversions run live on user checkouts.</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActiveToggle"
                      {...register("isActive")}
                      className="h-4 w-4 rounded border-gray-300 text-teal-600 accent-teal-600 outline-none transition-all focus:ring-teal-50"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON FOOTER */}
              <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 border border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl px-4 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 h-9 shadow-sm"
                >
                  {isPending ? (
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Saving Changes...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// =========================
// CONFIG DISPLAY BOX NODE
// =========================
function ConfigItem({
  label,
  value,
  active,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: string;
  active?: boolean;
  icon: any;
  iconClass: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200/70 bg-white p-3.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${iconClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="space-y-0.5 min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 truncate leading-none">
          {label}
        </p>
        <h2 className={`text-base font-black tracking-tight truncate ${
          active !== undefined 
            ? active 
              ? "text-emerald-600" 
              : "text-rose-600" 
            : "text-gray-900"
        }`}>
          {value}
        </h2>
      </div>
    </div>
  );
}

// =========================
// FIELD WRAPPER TRANSFORMATION
// =========================
function FormInput({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col space-y-1.5 min-w-0">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-[11px] font-semibold text-rose-500 tracking-wide font-mono mt-0.5">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

// Clean embedded loading micro-spinner element component mapping reference
function Loader2({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}