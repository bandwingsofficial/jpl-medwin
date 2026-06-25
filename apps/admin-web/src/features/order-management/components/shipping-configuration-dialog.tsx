"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Truck,
} from "lucide-react";

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


import {
  ShippingConfiguration,
} from "@/features/order-management/types/shipping-configuration.type";

import {
  useUpdateShippingConfiguration,
} from "@/features/order-management/hooks/use-update-shipping-configuration";

interface ShippingConfigurationDialogProps {
  open: boolean;

  configuration: ShippingConfiguration;

  onOpenChange: (
    open: boolean,
  ) => void;
}

export function ShippingConfigurationDialog({
  open,
  configuration,
  onOpenChange,
}: ShippingConfigurationDialogProps) {
  const updateShippingConfiguration =
    useUpdateShippingConfiguration();

  const [
    shippingFee,
    setShippingFee,
  ] = useState(0);

  const [
    freeShippingThreshold,
    setFreeShippingThreshold,
  ] = useState(0);

  const [
    isActive,
    setIsActive,
  ] = useState(true);

  useEffect(() => {
    if (!configuration) {
      return;
    }

    setShippingFee(
      configuration.shippingFee,
    );

    setFreeShippingThreshold(
      configuration.freeShippingThreshold,
    );

    setIsActive(
      configuration.isActive,
    );
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
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck
              size={18}
            />

            Shipping Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          <div className="space-y-2">
            <Label>
              Shipping Fee
            </Label>

            <Input
              type="number"
              value={
                shippingFee
              }
              onChange={(e) =>
                setShippingFee(
                  Number(
                    e.target
                      .value,
                  ),
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label>
              Free Shipping Threshold
            </Label>

            <Input
              type="number"
              value={
                freeShippingThreshold
              }
              onChange={(e) =>
                setFreeShippingThreshold(
                  Number(
                    e.target
                      .value,
                  ),
                )
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
  <Label htmlFor="is-active">
    Active Configuration
  </Label>

  <input
    id="is-active"
    type="checkbox"
    checked={isActive}
    onChange={(event) =>
      setIsActive(event.target.checked)
    }
    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600"
  />
</div>

        </div>

        <DialogFooter>

          <Button
            variant="primary"
            onClick={() =>
              onOpenChange(
                false,
              )
            }
          >
            Cancel
          </Button>

          <Button
            onClick={
              handleSave
            }
            disabled={
              updateShippingConfiguration.isPending
            }
          >
            {updateShippingConfiguration.isPending && (
              <Loader2
                size={16}
                className="mr-2 animate-spin"
              />
            )}

            Save Changes
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}