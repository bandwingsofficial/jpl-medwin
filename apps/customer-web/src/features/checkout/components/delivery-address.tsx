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

  gstNumber?: string;
  onGstNumberChange?: (val: string) => void;
  gstError?: string;
}


export function DeliveryAddress({
  selectedAddress,
  onSelectAddress,

  selectedBillingAddress,
  onSelectBillingAddress,

  isBillingSameAsShipping,
  onBillingSameChange,

  gstNumber,
  onGstNumberChange,
  gstError,
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
      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
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
          Your Address....
        </p>
      </div>
    );
  }


  return (
    <>
      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        {/* HEADER */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
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
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-teal-700 sm:w-auto sm:shrink-0"
          >
            <Plus size={14} />
            Add Shipping Address
          </button>
        </div>


<label className="mb-4 flex min-w-0 items-start gap-2">
  <input
    type="checkbox"
    checked={isBillingSameAsShipping}
    onChange={(e) =>
      onBillingSameChange(
        e.target.checked
      )
    }
  />

  <span className="min-w-0 text-sm leading-5 break-words">
    Billing address same as shipping
  </span>
</label>
        {/* EMPTY STATE */}
        {!addresses.length && (
          <div className="w-full min-w-0 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center sm:p-8">
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
                    group relative min-w-0 w-full cursor-pointer overflow-hidden rounded-lg border p-3 text-left transition-all sm:p-3.5
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


                  <div className="flex min-w-0 w-full gap-3">
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


                    <div className="min-w-0 flex-1 pr-1 sm:pr-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3 className="min-w-0 truncate text-sm font-bold text-slate-900">
                          {address.alias || address.type}
                        </h3>


                        {address.isDefault && (
                          <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-600">
                            Default
                          </span>
                        )}
                      </div>


                      <p className="mt-1 line-clamp-2 break-words text-xs leading-normal text-slate-500">
                        {address.addressLine1},{" "}
                        {address.city},{" "}
                        {address.postalCode}
                      </p>


                      <div className="mt-3 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();


                            handleEditAddress(address);
                          }}
                          className="inline-flex min-h-8 items-center gap-1 px-1 text-[11px] font-bold text-slate-600 hover:text-slate-900"
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
  <div className="mt-6 min-w-0 border-t border-slate-200 pt-5 sm:mt-8 sm:pt-6">

    {/* BILLING HEADER */}
    <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
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
          w-full
          items-center
          justify-center
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
          sm:w-auto
          sm:shrink-0
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
              min-w-0
              w-full
              cursor-pointer
              overflow-hidden
              rounded-lg
              border
              p-3
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

            <div className="flex min-w-0 w-full gap-3">
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

              <div className="min-w-0 flex-1 pr-1 sm:pr-4">
                <div className="flex min-w-0 items-center gap-2">
                  <h3 className="min-w-0 truncate text-sm font-bold text-slate-900">
                    {address.alias || address.type}
                  </h3>

                  {address.isDefault && (
                    <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-600">
                      Default
                    </span>
                  )}
                </div>

                <p className="mt-1 line-clamp-2 break-words text-xs leading-normal text-slate-500">
                  {address.addressLine1},{" "}
                  {address.city},{" "}
                  {address.postalCode}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEditAddress(address);
                    }}
                    className="inline-flex min-h-8 items-center gap-1 px-1 text-[11px] font-bold text-slate-600 hover:text-slate-900"
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

        {/* GST NUMBER (OPTIONAL) */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="gst-number-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              GST Number{" "}
              <span className="text-[11px] font-normal lowercase tracking-normal text-slate-400">
                (optional)
              </span>
            </label>
          </div>

          <div className="mt-1.5">
            <input
              id="gst-number-input"
              type="text"
              maxLength={15}
              value={gstNumber || ""}
              onChange={(e) => {
                const val = e.target.value
                  .toUpperCase()
                  .replace(/[^0-9A-Z]/g, "");
                onGstNumberChange?.(val);
              }}
              placeholder="e.g. 29ABCDE1234F1Z5"
              className={`w-full rounded-lg border px-3 py-2.5 font-mono text-sm uppercase tracking-wide text-slate-900 placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                gstError
                  ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:bg-white focus:ring-teal-100"
              }`}
            />

            {gstError && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {gstError}
              </p>
            )}
          </div>

          <p className="mt-1 text-[11px] text-slate-400">
            Enter a 15-character GSTIN if you require a business tax invoice.
          </p>
        </div>
      </div>


      <AddressModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={editingAddress}
      />
    </>
  );
}
