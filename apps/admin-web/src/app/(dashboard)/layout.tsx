"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAdminMe } from "@/infrastructure/api/auth.api";
import {
  startSilentRefresh,
  stopSilentRefresh,
} from "@/shared/lib/silent-refresh";

import { AdminLayout } from "@/shared/components/layout/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        await getAdminMe();

        if (!isMounted) return;

        startSilentRefresh();
      } catch {
        router.replace("/login");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
      stopSilentRefresh();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-gray-500">
          Checking session...
        </p>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}