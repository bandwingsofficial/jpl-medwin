"use client";

import { Loader } from "@/shared/components/ui/loader";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { useCustomer } from "@/features/customer-management/hooks/use-customer";
import { CustomerOrderTable } from "@/features/customer-management/components/customer-order-table";
interface Props {
  customerId: string;
}

export function CustomerDetailPage({ customerId }: Props) {
  const { customer, isLoading, error } = useCustomer(customerId);

  if (isLoading) return <Loader />;
  if (error || !customer) return <EmptyState title="Customer not found" />;

  return (
    <div className="space-y-5 max-w-7xl mx-auto p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h1 className="
              animate-text-shine
              bg-gradient-to-r 
              from-[#001f3f] 
              via-[#0d9488] 
              to-[#001f3f] 
              bg-clip-text 
              text-[28px] 
              font-bold 
              text-transparent
            ">Customer Details</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage profile, activity, and security identities</p>
        </div>
      </div>

      {/* Main Grid: Profile & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Profile Details (Takes 2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4 text-slate-900 flex items-center gap-2">
            Profile Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
            <Field label="Name" value={customer.profile?.name ?? "-"} />
            <Field label="Email" value={customer.profile?.email ?? "-"} />
            <Field label="Phone" value={customer.profile?.phoneNumber ?? "-"} />
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Role</p>
              <span className="inline-flex items-center px-2 py-0.5 mt-1 text-xs font-medium rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                {customer.role}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</p>
              <span className={`inline-flex items-center px-2 py-0.5 mt-1 text-xs font-medium rounded-md border ${
                customer.isActive 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}>
                {customer.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics (Takes 1/3 width) */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col justify-between gap-4">
          <h2 className="text-sm font-semibold text-slate-900">Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 my-auto">
            <div className="bg-slate-50/70 border-l-2 border-indigo-500 p-3 rounded-r-lg">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total Orders</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{customer.stats.totalOrders}</p>
            </div>
            <div className="bg-slate-50/70 border-l-2 border-emerald-500 p-3 rounded-r-lg">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total Spent</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">₹{customer.stats.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Identities & Audit Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Identities Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-3 text-slate-900">Identities</h2>
          <div className="divide-y divide-slate-100 max-h-[180px] overflow-y-auto pr-1">
            {customer.identities.map((identity) => (
              <div key={identity.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <div>
                  <p className="font-semibold text-xs text-slate-800">{identity.type}</p>
                  <p className="text-xs text-muted-foreground">{identity.value}</p>
                </div>
                <div className="flex gap-1.5">
                  {identity.isVerified && (
                    <span className="px-2 py-0.5 text-[9px] uppercase font-bold rounded bg-emerald-50 border border-emerald-200 text-emerald-700 tracking-wider">
                      Verified
                    </span>
                  )}
                  {identity.isTotpEnabled && (
                    <span className="px-2 py-0.5 text-[9px] uppercase font-bold rounded bg-sky-50 border border-sky-200 text-sky-700 tracking-wider">
                      TOTP
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Information Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4 text-slate-900">Audit Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Created At" value={new Date(customer.createdAt).toLocaleString()} />
            <Field label="Updated At" value={new Date(customer.updatedAt).toLocaleString()} />
          </div>
        </div>

      </div>
          {/* Customer Orders */}

<CustomerOrderTable
  customerId={customerId}
/>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-700 truncate" title={value}>{value}</p>
    </div>
  );
}