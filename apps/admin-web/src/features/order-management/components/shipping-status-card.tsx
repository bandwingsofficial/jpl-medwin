"use client";

import { useState } from "react";
import { Loader2, Truck, Edit2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useShippingConfiguration } from "@/features/order-management/hooks/use-shipping-configuration";
import { ShippingConfigurationDialog } from "@/features/order-management/components/shipping-configuration-dialog";

export function ShippingStatusCard() {
  const {
    shippingConfiguration,
    hasActiveConfiguration,
    isLoading,
  } = useShippingConfiguration();

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="min-w-[220px] rounded-xl border border-gray-200 bg-white p-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-medium text-gray-500">Shipping</p>
              {!isLoading && hasActiveConfiguration && shippingConfiguration && (
                <button
                  onClick={() => setDialogOpen(true)}
                  className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  title="Update Shipping"
                >
                  <Edit2 size={12} />
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="mt-2 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-sky-600" />
                <span className="text-xs text-gray-500">Loading...</span>
              </div>
            ) : hasActiveConfiguration && shippingConfiguration ? (
              <>
                <h3 className="mt-1 text-xl font-bold text-sky-600">
                  ₹{shippingConfiguration.shippingFee}
                </h3>
                {/* SHIPPING <p className="mt-0.5 text-xs text-gray-500">
                  Free Above ₹{shippingConfiguration.freeShippingThreshold}
                </p>*/}
              </>
            ) : (
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-red-600">Not Configured</p>
                <Button
                  size="sm"
                  variant="primary"
                  className="h-6 px-2 text-[10px]"
                  onClick={() => setDialogOpen(true)}
                >
                  Create
                </Button>
              </div>
            )}
          </div>

          <div className="ml-3 rounded-lg bg-sky-100 p-2 shrink-0">
            <Truck size={18} className="text-sky-600" />
          </div>
        </div>
      </div>

      {shippingConfiguration && (
        <ShippingConfigurationDialog
          open={dialogOpen}
          configuration={shippingConfiguration}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}