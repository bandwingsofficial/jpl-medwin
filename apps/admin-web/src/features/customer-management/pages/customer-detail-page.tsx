"use client";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
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

    {/* BREADCRUMBS */}

    <div className="flex items-center gap-2 text-sm">
      <Link
        href="/"
        className="
          inline-flex
          items-center
          gap-1.5
          font-medium
          text-slate-500
          transition-colors
          hover:text-teal-600
        "
      >
        <Home className="h-4 w-4" />
        Home
      </Link>

      <ChevronRight className="h-4 w-4 text-slate-300" />

      <Link
        href="/customers"
        className="
          font-medium
          text-slate-500
          transition-colors
          hover:text-teal-600
        "
      >
        Customers
      </Link>

      <ChevronRight className="h-4 w-4 text-slate-300" />

      <span className="font-semibold text-teal-600">
        Customer Details
      </span>
    </div>

    {/* Header */}

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-100">    <div>
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
        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              Profile Information
            </h2>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                {customer.role}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${
                customer.isActive 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}>
                {customer.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Personal</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Salutation" value={customer.profile?.salutation ?? "-"} />
              <Field label="First Name" value={customer.profile?.firstName ?? (customer.profile?.name ? customer.profile.name.split(" ")[0] : "-")} />
              <Field label="Last Name" value={customer.profile?.lastName ?? (customer.profile?.name && customer.profile.name.split(" ").length > 1 ? customer.profile.name.split(" ").slice(1).join(" ") : "-")} />
              <Field label="Customer Type" value={customer.profile?.customerType ?? "-"} />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Mobile / Phone" value={customer.profile?.phoneNumber ?? "-"} />
              <Field label="WhatsApp Number" value={customer.profile?.whatsappNumber ?? "-"} />
              <Field label="Email Address" value={customer.profile?.email ?? "-"} />
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Business</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Clinic / Hospital Name" value={customer.profile?.clinicHospitalName ?? "-"} />
              <Field label="GST Number" value={customer.profile?.gstNumber ?? "-"} />
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

      {/* Customer Addresses */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-teal-600" />
            <span>Customer Addresses</span>
          </h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {customer.addresses?.length ?? 0} {(customer.addresses?.length ?? 0) === 1 ? "Address" : "Addresses"}
          </span>
        </div>

        {(!customer.addresses || customer.addresses.length === 0) ? (
          <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <MapPin className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">No addresses added yet</p>
            <p className="text-xs text-slate-400 mt-0.5">This customer has not added any delivery addresses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customer.addresses.map((address) => (
              <div
                key={address.id}
                className="relative rounded-xl border border-slate-200 bg-slate-50/30 p-4 transition-all hover:border-slate-300 hover:shadow-xs space-y-3"
              >
                {/* Header: Type and Default badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-md border ${
                        address.type === "HOME"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : address.type === "WORK"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }`}
                    >
                      {address.type}
                      {address.alias ? ` (${address.alias})` : ""}
                    </span>
                  </div>

                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      Default
                    </span>
                  )}
                </div>

                {/* Recipient details */}
                <div className="space-y-1">
                  {address.fullName && (
                    <p className="text-sm font-semibold text-slate-800">
                      {address.fullName}
                    </p>
                  )}
                  {address.phoneNumber && (
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{address.phoneNumber}</span>
                    </p>
                  )}
                </div>

                {/* Address lines */}
                <div className="text-xs text-slate-600 space-y-0.5 border-t border-slate-100 pt-2">
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {address.addressLine1}
                  </p>
                  {address.addressLine2 && (
                    <p className="text-slate-600 leading-relaxed">
                      {address.addressLine2}
                    </p>
                  )}
                  {address.landmark && (
                    <p className="text-slate-500 italic">
                      Landmark: {address.landmark}
                    </p>
                  )}
                  <p className="text-slate-700 font-medium pt-1">
                    {[address.city, address.state].filter(Boolean).join(", ")}
                    {address.postalCode ? ` - ${address.postalCode}` : ""}
                  </p>
                  {address.country && (
                    <p className="text-slate-500 font-medium">
                      {address.country}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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