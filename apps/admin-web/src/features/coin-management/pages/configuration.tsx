import { CoinConfigForm } from "@/features/coin-management/components/coin-config-form";

export default function CoinConfigurationPage() {
  return (
    <div
      className="
        flex
        flex-col
        gap-6
        p-6
      "
    >
    

      <CoinConfigForm />
    </div>
  );
}
