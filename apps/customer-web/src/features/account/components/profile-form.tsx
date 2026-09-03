"use client";

import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";

import {
  useCreateProfile,
  useProfile,
  useUpdateProfile,
} from "@/features/account/hooks/use-profile";

import {
  showError,
} from "@/shared/store/toast.store";

import {
  Salutation,
  CustomerType,
} from "@/features/account/types/profile.type";

import { ProfileAvatarUpload } from "./profile-avatar-upload";
import { ProfileSkeleton } from "./profile-skelton";

interface Props {
  onSuccess?: () => void;
}

export function ProfileForm({
  onSuccess,
}: Props) {
  // =========================================
  // PROFILE QUERY
  // =========================================

  const { data, isLoading } = useProfile();

  // =========================================
  // MUTATIONS
  // =========================================

  const createMutation = useCreateProfile();
  const updateMutation = useUpdateProfile();

  // =========================================
  // PROFILE DATA
  // =========================================

  const profile = data?.data;

  // DETECT MODE
  const isEditMode = !!profile;

  // =========================================
  // AUTH FIELD DETECTION
  // =========================================

  const isEmailLocked = !!profile?.email;
  const isPhoneLocked = !!profile?.phoneNumber;

  // =========================================
  // HYDRATION SAFE
  // =========================================

  const [mounted, setMounted] = useState(false);

  // =========================================
  // FORM STATES
  // =========================================

  const [salutation, setSalutation] = useState<Salutation | "">("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerType, setCustomerType] = useState<CustomerType | "">("");
  const [clinicHospitalName, setClinicHospitalName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // =========================================
  // HYDRATION FIX
  // =========================================

  useEffect(() => {
    setMounted(true);
  }, []);

  // =========================================
  // SET PROFILE DATA
  // =========================================

  useEffect(() => {
    if (!profile) return;

    setSalutation(profile.salutation || "");
    setFirstName(
      profile.firstName ||
        (profile.name ? profile.name.split(" ")[0] : "")
    );
    setLastName(
      profile.lastName ||
        (profile.name && profile.name.split(" ").length > 1
          ? profile.name.split(" ").slice(1).join(" ")
          : "")
    );
    setName(profile.name || "");
    setEmail(profile.email || "");
    setPhoneNumber(profile.phoneNumber || "");
    setCustomerType(profile.customerType || "");
    setClinicHospitalName(profile.clinicHospitalName || "");
    setWhatsappNumber(profile.whatsappNumber || "");
    setGstNumber(profile.gstNumber || "");

    setPreview(profile.avatarUrl || null);
  }, [profile]);

  // =========================================
  // CLEANUP OBJECT URL
  // =========================================

  useEffect(() => {
    return () => {
      if (
        preview &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // =========================================
  // HYDRATION SAFE RENDER
  // =========================================

  if (!mounted) {
    return <ProfileSkeleton />;
  }

  // =========================================
  // LOADING STATE
  // =========================================

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // =========================================
  // SUBMIT HANDLER
  // =========================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    // Indian GSTIN validation when provided
  // Indian GSTIN validation when provided
const normalizedGst = gstNumber.trim().toUpperCase();

if (
  normalizedGst &&
  !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
    normalizedGst
  )
) {
  showError(
    "Please enter a valid 15-character GSTIN (e.g. 29ABCDE1234F1Z5)"
  );
  return;
}

    // WhatsApp number format validation when provided
    if (whatsappNumber && !/^(\+?\d{10,15})$/.test(whatsappNumber.replace(/\s+/g, ""))) {
      showError("Please enter a valid WhatsApp phone number (10-15 digits)");
      return;
    }

    const computedName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || name.trim();

    const payload = {
      salutation: (salutation as Salutation) || null,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: computedName,
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      customerType: (customerType as CustomerType) || null,
      clinicHospitalName: clinicHospitalName.trim(),
     whatsappNumber: whatsappNumber.trim() || null,
gstNumber: gstNumber.trim()
  ? gstNumber.trim().toUpperCase()
  : null,
      avatar,
    };

    try {
      let response;

      // =========================================
      // CREATE PROFILE
      // =========================================

      if (!isEditMode) {
        response = await createMutation.mutateAsync(payload);
      }

      // =========================================
      // UPDATE PROFILE
      // =========================================

      else {
        response = await updateMutation.mutateAsync(payload);
      }

      // =========================================
      // UPDATE IMAGE PREVIEW
      // =========================================

      setPreview(
        response.data.avatarUrl || null
      );

      // =========================================
      // RESET FILE
      // =========================================

      setAvatar(null);

      // =========================================
      // CALLBACK
      // =========================================

      onSuccess?.();
    } catch (error: any) {
      // =========================================
      // EXACT BACKEND MESSAGE
      // =========================================

      const backendMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to save profile.";

      // =========================================
      // SHOW BACKEND ERROR
      // =========================================

      showError(backendMessage);
    }
  }

  // =========================================
  // SUBMITTING STATE
  // =========================================

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        min-w-0
        space-y-6
        sm:space-y-8
      "
    >
      {/* HEADER */}
      <div className="min-w-0">
        <h2
          className="
            text-xl
            font-semibold
            tracking-tight
            sm:text-2xl
          "
        >
          {isEditMode
            ? "Profile Details"
            : "Create Profile"}
        </h2>

        <p
          className="
            mt-1
            text-sm
            leading-5
            text-muted-foreground
            sm:leading-normal
          "
        >
          {isEditMode
            ? "Update your personal and business information"
            : "Complete your profile information"}
        </p>
      </div>

      {/* 1. AVATAR (EXISTING - UNTOUCHED) */}
      <div className="w-full min-w-0">
        <ProfileAvatarUpload
          preview={preview}
          onChange={(file) => {
            setAvatar(file);

            if (file) {
              const objectUrl =
                URL.createObjectURL(file);

              setPreview(objectUrl);
            }
          }}
        />
      </div>

      {/* FORM FIELDS - MOBILE-FIRST STACKING ORDER */}
      <div className="space-y-5">
        {/* PERSONAL INFORMATION SECTION */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Personal Information
          </h3>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-12">
            {/* 2. SALUTATION */}
            <div className="min-w-0 space-y-1.5 sm:col-span-3">
              <Label htmlFor="salutation">Salutation</Label>
              <Select
                id="salutation"
                value={salutation}
                onChange={(e) => setSalutation(e.target.value as Salutation)}
                className="w-full min-w-0 text-[16px] sm:text-sm"
              >
                <option value="">Select</option>
                <option value="Dr">Dr</option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
              </Select>
            </div>

            {/* 3. FIRST NAME */}
            <div className="min-w-0 space-y-1.5 sm:col-span-4">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                required
                className="w-full min-w-0 text-[16px] sm:text-sm"
              />
            </div>

            {/* 4. LAST NAME */}
            <div className="min-w-0 space-y-1.5 sm:col-span-5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full min-w-0 text-[16px] sm:text-sm"
              />
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 5. CUSTOMER TYPE */}
            <div className="min-w-0 space-y-1.5">
              <Label htmlFor="customerType">Customer Type</Label>
              <Select
                id="customerType"
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as CustomerType)}
                className="w-full min-w-0 text-[16px] sm:text-sm"
              >
                <option value="">Select Customer Type</option>
                <option value="Dentist">Dentist</option>
                <option value="Clinic">Clinic</option>
                <option value="Hospital">Hospital</option>
                <option value="Dealer">Dealer</option>
                <option value="Other">Other</option>
              </Select>
            </div>

            {/* 6. CLINIC / HOSPITAL NAME */}
            <div className="min-w-0 space-y-1.5">
              <Label htmlFor="clinicHospitalName">Clinic / Hospital Name</Label>
              <Input
                id="clinicHospitalName"
                value={clinicHospitalName}
                onChange={(e) => setClinicHospitalName(e.target.value)}
                placeholder="Enter clinic or hospital name"
                className="w-full min-w-0 text-[16px] sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* CONTACT INFORMATION SECTION */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Contact Information
          </h3>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 7. MOBILE / PHONE (EXISTING - UNTOUCHED) */}
            <div className="min-w-0 space-y-1.5">
              <Label htmlFor="phoneNumber">Mobile / Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                disabled={isPhoneLocked}
                className="w-full min-w-0 text-[16px] sm:text-sm"
              />
              {isPhoneLocked && (
                <p className="text-xs leading-5 text-muted-foreground">
                  Phone number linked with your login account
                </p>
              )}
            </div>

            {/* 8. WHATSAPP NUMBER (NEW) */}
            <div className="min-w-0 space-y-1.5">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Enter WhatsApp number"
                className="w-full min-w-0 text-[16px] sm:text-sm"
              />
            </div>
          </div>

          {/* 9. EMAIL (EXISTING - UNTOUCHED) */}
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required={isEmailLocked}
              disabled={isEmailLocked}
              className="w-full min-w-0 text-[16px] sm:text-sm"
            />
            {isEmailLocked && (
              <p className="text-xs leading-5 text-muted-foreground">
                Email linked with your login account
              </p>
            )}
          </div>
        </div>

        {/* BUSINESS / TAX INFORMATION SECTION */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Tax Information
          </h3>

          {/* 10. GST NUMBER (NEW) */}
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="gstNumber">GST Number (Optional)</Label>
            <Input
              id="gstNumber"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
              placeholder="e.g. 29ABCDE1234F1Z5"
              maxLength={15}
              className="w-full min-w-0 uppercase text-[16px] sm:text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* 11. ACTION (SAVE / UPDATE) */}
      <div
        className="
          flex
          w-full
          justify-stretch
          sm:justify-end
        "
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full
            sm:w-auto
          "
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Profile"
              : "Create Profile"}
        </Button>
      </div>
    </form>
  );
}
