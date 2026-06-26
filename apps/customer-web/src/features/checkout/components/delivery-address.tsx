"use client";


import { useMemo, useState, useEffect } from "react";
import { Check, MapPin, Pencil, Plus } from "lucide-react";


import { useAddresses } from "@/features/address/hooks/use-addresses";
import { SavedAddress } from "@/features/address/types/address.type";
import { AddressModal } from "@/features/address/components/address-modal";


interface DeliveryAddressProps {
  selectedAddress: SavedAddress | null;
  onSelectAddress: (
    address: SavedAddress
  ) => void;

  selectedBillingAddress:
    SavedAddress | null;

  onSelectBillingAddress: (
    address: SavedAddress
  ) => void;

  isBillingSameAsShipping: boolean;

  onBillingSameChange: (
    value: boolean
  ) => void;
}


export function DeliveryAddress({
  selectedAddress,
  onSelectAddress,

  selectedBillingAddress,
  onSelectBillingAddress,

  isBillingSameAsShipping,
  onBillingSameChange,
}: DeliveryAddressProps) {
  /*
   |------------------------------------------------------------------
   | API
   |------------------------------------------------------------------
   */
  const { data, isLoading, isError } = useAddresses();


  /*
   |------------------------------------------------------------------
   | STATES
   |------------------------------------------------------------------
   */
  const [open, setOpen] = useState(false);


  const [editingAddress, setEditingAddress] =
    useState<SavedAddress | null>(null);

const [addressMode, setAddressMode] =
  useState<"shipping" | "billing">(
    "shipping"
  );
  /*
   |------------------------------------------------------------------
   | DATA
   |------------------------------------------------------------------
   */
  const addresses = data?.data || [];


  /*
   |------------------------------------------------------------------
   | DEFAULT ADDRESS & AUTO SELECT
   |------------------------------------------------------------------
   */
  const defaultAddress = useMemo(() => {
    if (!addresses.length) return null;


    return (
      addresses.find((address) => address.isDefault) || addresses[0]
    );
  }, [addresses]);


  /*
   |------------------------------------------------------------------
   | AUTO SELECT DEFAULT ADDRESS
   |------------------------------------------------------------------
   */
  useEffect(() => {
    if (defaultAddress && !selectedAddress) {
      onSelectAddress(defaultAddress);
    }
    if (
  defaultAddress &&
  !selectedBillingAddress
) {
  onSelectBillingAddress(
    defaultAddress
  );
}
 }, [
  defaultAddress,
  selectedAddress,
  selectedBillingAddress,
  onSelectAddress,
  onSelectBillingAddress,
]);
  /*
   |------------------------------------------------------------------
   | HANDLERS
   |------------------------------------------------------------------
   */
  const handleAddAddress = () => {
    setEditingAddress(null);
    setOpen(true);
  };


  const handleEditAddress = (address: SavedAddress) => {
    setEditingAddress(address);
    setOpen(true);
  };


  /*
   |------------------------------------------------------------------
   | LOADING
   |------------------------------------------------------------------
   */
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="animate-pulse">
          <div className="h-5 w-40 rounded bg-slate-200" />


          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="h-24 rounded-lg bg-slate-100" />
            <div className="h-24 rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }


  /*
   |------------------------------------------------------------------
   | ERROR
   |------------------------------------------------------------------
   */
  if (isError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <p className="text-xs font-medium text-red-600">
          Failed to load addresses.
        </p>
      </div>
    );
  }


  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold leading-tight text-slate-900">
              Delivery Address
            </h2>


            <p className="text-xs text-slate-500">
              Choose destination
            </p>
          </div>


          <button
            type="button"
            onClick={() => {
    setAddressMode("shipping");
    handleAddAddress();
  }}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-teal-700"
          >
            <Plus size={14} />
            Add Shipping Address
          </button>
        </div>


<label className="flex items-center gap-2 mb-4">
  <input
    type="checkbox"
    checked={isBillingSameAsShipping}
    onChange={(e) =>
      onBillingSameChange(
        e.target.checked
      )
    }
  />

  <span className="text-sm">
    Billing address same as shipping
  </span>
</label>
        {/* EMPTY STATE */}
        {!addresses.length && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <MapPin
              size={20}
              className="mx-auto text-slate-400"
            />


            <h3 className="mt-2 text-sm font-semibold text-slate-900">
              No addresses
            </h3>


            <button
              onClick={handleAddAddress}
              className="mt-3 text-xs font-bold text-slate-900 underline underline-offset-4"
            >
              Add your first address
            </button>
          </div>
        )}


        {/* ADDRESS LIST */}
        {!!addresses.length && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {addresses.map((address) => {
              const isSelected =
                selectedAddress?.id === address.id;


              return (
                <div
                  key={address.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectAddress(address)}
                  className={`
                    group relative cursor-pointer rounded-lg border p-3.5 text-left transition-all
                    ${
                      isSelected
  ? "border-teal-600 bg-teal-50/50 ring-1 ring-teal-600"
  : "border-slate-200 bg-white hover:border-slate-300"
                    }
                  `}
                >
                  {/* SELECT INDICATOR */}
                  {isSelected && (
                    <div className="absolute right-2 top-2 text-slate-900">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  )}


                  <div className="flex gap-3">
                    {/* ICON */}
                    <div
                      className={`
                        flex h-8 w-8 shrink-0 items-center justify-center rounded-md
                        ${
                         isSelected
  ? "bg-teal-600 text-white"
  : "bg-slate-100 text-slate-500"
                        }
                      `}
                    >
                      <MapPin size={16} />
                    </div>


                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {address.alias || address.type}
                        </h3>


                        {address.isDefault && (
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-600">
                            Default
                          </span>
                        )}
                      </div>


                      <p className="mt-1 line-clamp-2 text-xs leading-normal text-slate-500">
                        {address.addressLine1},{" "}
                        {address.city},{" "}
                        {address.postalCode}
                      </p>


                      <div className="mt-3 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();


                            handleEditAddress(address);
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900"
                        >
                          <Pencil size={10} />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {!isBillingSameAsShipping && (
  <div className="mt-8 border-t border-slate-200 pt-6">

    {/* BILLING HEADER */}
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Billing Address
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Choose a different billing address
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setAddressMode("billing");
          handleAddAddress();
        }}
        className="
          inline-flex
          items-center
          gap-2
          rounded-lg
          bg-teal-600
          px-4
          py-2
          text-xs
          font-semibold
          text-white
          transition-colors
          hover:bg-teal-700
        "
      >
        <Plus size={14} />
        Add Billing Address
      </button>
    </div>

    {/* BILLING ADDRESS LIST */}
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {addresses.map((address) => {
        const isSelected =
          selectedBillingAddress?.id === address.id;

        return (
          <div
            key={`billing-${address.id}`}
            role="button"
            tabIndex={0}
            onClick={() =>
              onSelectBillingAddress(address)
            }
            className={`
              group
              relative
              cursor-pointer
              rounded-lg
              border
              p-3.5
              text-left
              transition-all
              ${
               isSelected
  ? "border-teal-600 bg-teal-50/50 ring-1 ring-teal-600"
  : "border-slate-200 bg-white hover:border-slate-300"
              }
            `}
          >
            {isSelected && (
              <div className="absolute right-2 top-2 text-slate-900">
                <Check
                  size={16}
                  strokeWidth={3}
                />
              </div>
            )}

            <div className="flex gap-3">
              <div
                className={`
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  ${
                    isSelected
  ? "bg-teal-600 text-white"
  : "bg-slate-100 text-slate-500"
                  }
                `}
              >
                <MapPin size={16} />
              </div>

              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-slate-900">
                    {address.alias || address.type}
                  </h3>

                  {address.isDefault && (
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-600">
                      Default
                    </span>
                  )}
                </div>

                <p className="mt-1 line-clamp-2 text-xs leading-normal text-slate-500">
                  {address.addressLine1},{" "}
                  {address.city},{" "}
                  {address.postalCode}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEditAddress(address);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900"
                  >
                    <Pencil size={10} />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}
      </div>


      <AddressModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={editingAddress}
      />
    </>
  );
}

