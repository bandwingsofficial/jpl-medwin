"use client";

import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";

interface Props {
  open: boolean;

  loading?: boolean;

  onClose: () => void;

  onConfirm: () => void;
}

export function DeleteAddressDialog({
  open,
  loading,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Address"
    >
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to
          delete this address?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}