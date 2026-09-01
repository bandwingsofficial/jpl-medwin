"use client";

import {
  Users,
  UserCheck,
  UserX,
  IndianRupee,
} from "lucide-react";
import { CustomerAnalytics } from "@/features/customer-management/types/customer.types";

interface Props {
  analytics: CustomerAnalytics;
}

export function CustomerAnalyticsCards({ analytics }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        title="Total Customers"
        value={analytics.totalCustomers}
        icon={<Users size={16} />}
        iconClass="text-blue-600 bg-blue-50"
      />
      <Card
        title="Active Customers"
        value={analytics.activeCustomers}
        icon={<UserCheck size={16} />}
        iconClass="text-emerald-600 bg-emerald-50"
      />
      <Card
        title="Inactive Customers"
        value={analytics.inactiveCustomers}
        icon={<UserX size={16} />}
        iconClass="text-red-600 bg-red-50"
      />
      <Card
        title="Total Revenue"
        value={`₹${analytics.totalRevenue.toLocaleString()}`}
        icon={<IndianRupee size={16} />}
        iconClass="text-slate-600 bg-slate-100"
      />
    </div>
  );
}

function Card({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>
        <div className={`p-1.5 rounded-md ${iconClass}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 truncate">
        {value}
      </h3>
    </div>
  );
}