"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AlertCircle, MapPin, Loader2 } from "lucide-react";
import { useCurrentLocation } from "@/shared/hooks/use-current-location";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ADDRESS_TYPES } from "@/features/address/constants/address.constant";
import { SavedAddress, AddressType } from "@/features/address/types/address.type";
import { useAddresses, useCreateAddress, useUpdateAddress } from "@/features/address/hooks/use-addresses";

interface Props {
  initialData?: SavedAddress | null;
  onSuccess?: () => void;
}

export function AddressForm({ initialData, onSuccess }: Props) {
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const { data } = useAddresses();

  // ========================================
  // CURRENT LOCATION
  // ========================================
  const { location, loading: locationLoading } = useCurrentLocation();

  const addresses = data?.data || [];
  const isEdit = !!initialData;

  // ========================================
  // EXISTING TYPE CHECK
  // ========================================
  const hasHome = useMemo(() => {
    return addresses.some(
      (item) => item.type === "HOME" && item.id !== initialData?.id
    );
  }, [addresses, initialData]);

  const hasWork = useMemo(() => {
    return addresses.some(
      (item) => item.type === "WORK" && item.id !== initialData?.id
    );
  }, [addresses, initialData]);

  // ========================================
  // STATES
  // ========================================
  const [type, setType] = useState<AddressType>("HOME");
  const [alias, setAlias] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // AUTO FILL CURRENT LOCATION
  // ========================================
  useEffect(() => {
    if (!location || initialData) return;

    setAddressLine1(location.formatted || "");
    setCity(location.city || "");
    setState(location.state || "");
    setCountry(location.country || "India");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
      });
    }

    const fetchPostalCode = async () => {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            location.formatted
          )}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`
        );
        const data = await response.json();
        const result = data?.results?.[0];
        const postcode = result?.components?.postcode || "";
        setPostalCode(postcode);
      } catch (error) {
      }
    };

    fetchPostalCode();
  }, [location, initialData]);

  // ========================================
  // AUTO HIDE ERROR
  // ========================================
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 3500);
    return () => clearTimeout(timer);
  }, [error]);

  // ========================================
  // PREFILL
  // ========================================
  useEffect(() => {
    if (!initialData) return;

    setType(initialData.type);
    setAlias(initialData.alias || "" );
    setFullName(initialData.fullName || "");
    setPhoneNumber(initialData.phoneNumber || "");
    setAddressLine1(initialData.addressLine1);
    setAddressLine2(initialData.addressLine2 || "");
    setLandmark(initialData.landmark || "");
    setCity(initialData.city);
    setState(initialData.state);
    setCountry(initialData.country);
    setPostalCode(initialData.postalCode);
    setLatitude(initialData.latitude ? String(initialData.latitude) : "");
    setLongitude(initialData.longitude ? String(initialData.longitude) : "");
    setIsDefault(initialData.isDefault);
  }, [initialData]);

  // ========================================
  // SUBMIT
  // ========================================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (type === "HOME" && hasHome) {
      setError("Home address already exists.");
      return;
    }
    if (type === "WORK" && hasWork) {
      setError("Work address already exists.");
      return;
    }
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (phoneNumber.length < 10) {
      setError("Enter valid phone number.");
      return;
    }
    if (!postalCode.trim()) {
      setError("Postal code is required.");
      return;
    }

    const payload = {
      type,
      alias,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      country,
      postalCode,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      isDefault,
    };

    try {
      if (isEdit && initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          ...payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSuccess?.();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setError(message || "Something went wrong");
      }
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      {/* FLOATING ERROR */}
      {error && (
        <div className="fixed right-6 top-6 z-[9999] flex items-center gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 shadow-xl">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm font-semibold text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 select-none text-left">
        {/* CURRENT LOCATION */}
        {!isEdit && (
          <div className="flex items-center gap-2.5 rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-3">
            {locationLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
            ) : (
              <MapPin className="h-4 w-4 text-teal-600" />
            )}
            <p className="text-xs font-semibold text-teal-800">
              {locationLoading
                ? "Fetching current location framework..."
                : location?.formatted || "Current location detected"}
            </p>
          </div>
        )}

        {/* TYPE */}
        <div className="space-y-2">
          {/* 👉 FIX: Converted custom components to native semantic labels to fix compilation flags */}
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
            Address Type <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {ADDRESS_TYPES.map((item) => {
              const isDisabled =
                (item.value === "HOME" && hasHome) ||
                (item.value === "WORK" && hasWork);

              return (
                <button
                  key={item.value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => setType(item.value)}
                  className={`rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:active:scale-100 ${
                    type === item.value
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${isDisabled ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* IDENTITY AND META GRID PANEL */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* FULL NAME */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-teal-500/20"
              required
            />
          </div>

          {/* PHONE NUMBER */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-teal-500/20 font-mono"
              required
            />
          </div>

          {/* ALIAS */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Alias <span className="text-rose-500">*</span>
            </label>
            <Input
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="e.g. Clinic, Office, Home 2"
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-teal-500/20"
            />
          </div>

          {/* POSTAL CODE */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              Postal Code <span className="text-rose-500">*</span>
            </label>
            <Input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="6-digit PIN code"
              maxLength={6}
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-teal-500/20 font-mono font-semibold"
              required
            />
          </div>
        </div>

        {/* CORE ADDRESS VALUES */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              Address Line 1 <span className="text-rose-500">*</span>
            </label>
            <Input
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Flat, House no., Building, Company, Apartment"
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-teal-500/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Address Line 2 <span className="text-[10px] font-medium text-gray-400 font-sans lowercase italic">(optional)</span>
            </label>
            <Input
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Area, Street, Sector, Village"
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Landmark <span className="text-[10px] font-medium text-gray-400 font-sans lowercase italic">(optional)</span>
            </label>
            <Input
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Apollo Hospital"
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-teal-500/20"
            />
          </div>
        </div>

        {/* CITY AND REGION SELECTION GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              City <span className="text-rose-500">*</span>
            </label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Bengaluru"
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-blue-500/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              State <span className="text-rose-500">*</span>
            </label>
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Karnataka"
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-blue-500/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              Country <span className="text-rose-500">*</span>
            </label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="India"
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-teal-500/20"
              required
            />
          </div>
        </div>

        {/* OPTIONAL COORDINATES BOX LAYER */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Latitude <span className="text-[10px] font-medium text-gray-400 font-sans lowercase italic">(optional)</span>
            </label>
            <Input
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g. 12.9716"
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-blue-500/20 font-mono text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Longitude <span className="text-[10px] font-medium text-gray-400 font-sans lowercase italic">(optional)</span>
            </label>
            <Input
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g. 77.5946"
              className="h-10 rounded-xl border-gray-200 focus-visible:ring-blue-500/20 font-mono text-gray-500"
            />
          </div>
        </div>

        {/* DEFAULT OVERLAY CONTROLLER */}
        <label className="flex items-center gap-2.5 p-3 border border-gray-100 rounded-xl bg-gray-50/50 cursor-pointer transition-all hover:bg-gray-50">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600 outline-none focus-visible:ring-blue-500/20"
          />
          <span className="text-xs font-bold text-gray-700">
            Set as default shipping address destination
          </span>
        </label>

        {/* SUBMIT ACTIONS FOOTER */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-xl h-10 px-6 text-xs font-bold uppercase tracking-wider text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all active:scale-98"
          >
            {isPending ? (
              <div className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{isEdit ? "Updating..." : "Saving..."}</span>
              </div>
            ) : isEdit ? (
              "Update Address"
            ) : (
              "Add Address"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}