"use client";

import { useEffect, useState } from "react";
import { Loader2, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import { ShippingConfiguration } from "@/features/order-management/types/shipping-configuration.type";
import { useUpdateShippingConfiguration } from "@/features/order-management/hooks/use-update-shipping-configuration";

interface ShippingConfigurationDialogProps {
  open: boolean;
  configuration: ShippingConfiguration;
  onOpenChange: (open: boolean) => void;
}

export function ShippingConfigurationDialog({
  open,
  configuration,
  onOpenChange,
}: ShippingConfigurationDialogProps) {
  const updateShippingConfiguration = useUpdateShippingConfiguration();

  const [shippingFee, setShippingFee] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!configuration) {
      return;
    }

    setShippingFee(configuration.shippingFee);
    setFreeShippingThreshold(configuration.freeShippingThreshold);
    setIsActive(configuration.isActive);
  }, [configuration]);

  async function handleSave() {
    await updateShippingConfiguration.mutateAsync({
      id: configuration.id,
      payload: {
        shippingFee,
        freeShippingThreshold,
        isActive,
      },
    });

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg text-slate-900 border border-slate-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <Truck size={20} className="text-slate-700" />
            Shipping Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 my-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Shipping Fee
            </Label>
            <Input
              type="number"
              value={shippingFee}
              onChange={(e) => setShippingFee(Number(e.target.value))}
              className="bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Free Shipping Threshold
            </Label>
            <Input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 bg-slate-50">
            <Label htmlFor="is-active" className="text-sm font-medium text-slate-700 cursor-pointer">
              Active Configuration
            </Label>
            <input
              id="is-active"
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="h-5 w-5 cursor-pointer rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-2">
          <Button
            variant="primary"
            onClick={() => onOpenChange(false)}
            className="border-teal-600 text-teal-600 hover:bg-teal-50"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={updateShippingConfiguration.isPending}
            className="bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {updateShippingConfiguration.isPending && (
              <Loader2 size={16} className="mr-2 animate-spin" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}