"use client";

import { Modal } from "@/shared/components/ui/modal";

import {
  SavedAddress,
} from "@/features/address/types/address.type";

import { AddressForm } from "./address-form";

interface Props {
  open: boolean;

  onClose: () => void;

  initialData?: SavedAddress | null;
  
  onAddressCreated?: (
  address: SavedAddress
) => void;
}

export function AddressModal({
  open,
  onClose,
  initialData,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        initialData
          ? "Edit Address"
          : "Add Address"
      }
    >
      <AddressForm
        initialData={
          initialData
        }
        onSuccess={onClose}
      />
    </Modal>
  );
}