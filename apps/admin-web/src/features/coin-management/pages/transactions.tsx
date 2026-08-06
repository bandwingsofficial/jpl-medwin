import { TransactionTable } from "@/features/coin-management/components/transaction-table";

export default function CoinTransactionsPage() {
  return (
    <div
      className="
        flex
        flex-col
        gap-6
        p-6
      "
    >
      <div>
        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View all wallet transactions.
        </p>
      </div>

      <TransactionTable />
    </div>
  );
}