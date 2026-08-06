"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";

import { Customer } from "@/features/customer-management/types/customer.types";

interface Props {
  open: boolean;

  customer: Customer | null;

  isLoading: boolean;

  onConfirm: () => void;

  onOpenChange: (
    open: boolean
  ) => void;
}

export function DeactivateCustomerDialog({
  open,
  customer,
  isLoading,
  onConfirm,
  onOpenChange,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Deactivate Customer
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want
          to deactivate{" "}
          <strong>
            {customer?.name ??
              "this customer"}
          </strong>
          ?
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(
                false
              )
            }
          >
            Cancel
          </Button>

          <Button
            disabled={
              isLoading
            }
            onClick={
              onConfirm
            }
          >
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}