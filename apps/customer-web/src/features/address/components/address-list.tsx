"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

import {
  useAddresses,
  useDeleteAddress,
} from "@/features/address/hooks/use-addresses";

import { SavedAddress } from "@/features/address/types/address.type";

import { AddressCard } from "./address-card";
import { AddressModal } from "./address-modal";
import { AddressSkeleton } from "./address-skeleton";
import { EmptyAddress } from "./empty-address";
import { DeleteAddressDialog } from "./delete-address-dialog";

export function AddressList() {
  const { data, isLoading } = useAddresses();
  const deleteMutation = useDeleteAddress();

  const addresses = data?.data || [];

  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [deleteAddress, setDeleteAddress] = useState<SavedAddress | null>(null);

  function handleCreate() {
    setSelectedAddress(null);
    setOpen(true);
  }

  function handleEdit(address: SavedAddress) {
    setSelectedAddress(address);
    setOpen(true);
  }

  async function handleDelete() {
    if (!deleteAddress) return;

    try {
      await deleteMutation.mutateAsync(deleteAddress.id);
      setDeleteAddress(null);
    } catch (error) {
      console.error(error);
    }
  }

  if (isLoading) {
    return <AddressSkeleton />;
  }

  return (
    /* 👉 UI FIX: Wrapped everything in a premium container box to structure the layout perfectly like your screenshot */
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl border border-gray-100 p-6 shadow-sm select-none">
      
      {/* 📍 PREMIUM HEAD HEADER CONTAINER SECTION */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-gray-100/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-600 text-white rounded-xl border border-teal-100/40 shadow-sm shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Saved Addresses
            </h1>
            <p className="mt-1 text-xs text-gray-400 font-medium leading-none">
              Manage your default and secondary shipping delivery locations.
            </p>
          </div>
        </div>

        {/* REFINED ADD ADDRESS TOGGLE BUTTON */}
        <Button
          onClick={handleCreate}
          className="
            inline-flex 
            items-center 
            gap-1.5 
            rounded-xl 
            bg-teal-600 
            px-4 
            h-10
            text-xs 
            font-bold 
            uppercase 
            tracking-wider 
            text-white 
            shadow-sm 
            transition-all 
            hover:bg-teal-700 
            active:scale-98
          "
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Add Address</span>
        </Button>
      </div>

      {/* RENDER CONTENT CONDITIONALLY */}
      {!addresses.length ? (
        <EmptyAddress />
      ) : (
        /* UI GRID DENSITY: Reconfigured responsive auto scaling spaces smoothly */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={(value) => setDeleteAddress(value)}
            />
          ))}
        </div>
      )}

      {/* CORE ADDRESS DATA OPERATION MODALS */}
      <AddressModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={selectedAddress}
      />

      {/* DESTRUCTIVE DELETE VERIFICATION CONTEXT OVERLAY */}
      <DeleteAddressDialog
        open={!!deleteAddress}
        onClose={() => setDeleteAddress(null)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}