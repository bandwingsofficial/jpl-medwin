"use client";

import { MapPin, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { SavedAddress } from "@/features/address/types/address.type";
// 👉 INTEGRATION: Import custom platform toast handlers to align warning layout metrics
import { showWarning } from "@/shared/store/toast.store";

interface Props {
  address: SavedAddress;
  onEdit: (address: SavedAddress) => void;
  onDelete: (address: SavedAddress) => void;
}

export function AddressCard({ address, onEdit, onDelete }: Props) {
  
  // =========================================
  // SAFE GUARDED DELETE INTERCEPTOR
  // =========================================
  const handleProtectedDelete = () => {
    // If the address is set as the active default checkout destination, stop execution and alert
    if (address.isDefault) {
      showWarning("Set another default address before deleting this location");
      return;
    }
    
    // Otherwise pass cleanly down into your existing state modal flow
    onDelete(address);
  };

  return (
    <Card className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200/80 flex flex-col justify-between select-none">
      <div className="flex h-full flex-col justify-between">
        {/* TOP */}
        <div className="space-y-4">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-gray-900 capitalize leading-none">
                  {address.alias || address.type}
                </h3>

                {address.isDefault && (
                  <span className="rounded-md bg-teal-50 border border-teal-100/40 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider animate-in fade-in duration-200">
                    Default
                  </span>
                )}
              </div>

              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 leading-none">
                {address.type}
              </p>
            </div>

            {/* ACTION BUTTON CONTROLS */}
            <div className="flex items-center gap-2 shrink-0">
              {/* EDIT BUTTON */}
              <button
                type="button"
                onClick={() => onEdit(address)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-95"
                title="Edit Address"
              >
                <Pencil className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>

              {/* DELETE BUTTON */}
              <button
                type="button"
                onClick={handleProtectedDelete}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 shadow-sm transition-all hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 active:scale-95"
                title={address.isDefault ? "Clear default status before deleting" : "Delete Address"}
              >
                <Trash2 className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* ADDRESS STATEMENT CONTENT BLOCK */}
          <div className="space-y-2 text-sm">
            <div className="flex gap-2.5 items-start">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500/70" />

              <div className="space-y-1 text-xs font-medium text-gray-600 leading-relaxed min-w-0 flex-1">
                <p className="text-gray-900 font-semibold truncate">
                  {address.addressLine1}
                </p>

                {address.addressLine2 && (
                  <p className="truncate">{address.addressLine2}</p>
                )}

                {address.landmark && (
                  <p className="text-gray-500 italic bg-gray-50 rounded px-1.5 py-0.5 inline-block text-[11px] border border-gray-100 mt-0.5">
                    <span className="font-semibold text-gray-400 not-italic">Landmark:</span>{" "}
                    {address.landmark}
                  </p>
                )}

                <p className="pt-0.5">
                  {address.city}, {address.state}
                </p>

                <p className="font-semibold text-gray-800 tracking-wide font-mono text-[11px]">
                  {address.country} — {address.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}