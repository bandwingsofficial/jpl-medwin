"use client";

import type { ReactNode } from "react";

import {
  Boxes,
  Info,
  Scale,
  Star,
} from "lucide-react";

import { ProductVariant } from "@/features/product-management/types/variant.type";

// =========================================
// TYPES
// =========================================

interface VariantDetailsContentProps {
  variant: ProductVariant;
}

// =========================================
// COMPONENT
// =========================================

export function VariantDetailsContent({
  variant,
}: VariantDetailsContentProps) {
  // =========================================
  // VALUES
  // =========================================

  const stockQuantity =
    variant.stock?.quantity ?? 0;

  const isAvailable =
    variant.status === "ACTIVE" &&
    stockQuantity > 0;

  const attributes = Object.entries(
    variant.attributes ?? {}
  );

  const sellingPrice =
    variant.pricing?.sellingPrice ?? 0;

  const mrp =
    variant.pricing?.mrp ?? 0;

  const purchasePrice =
    variant.pricing?.purchasePrice ?? 0;

  const ratingAverage =
    variant.ratings?.average ?? 0;

  const ratingCount =
    variant.ratings?.count ?? 0;

  // =========================================
  // FORMAT PRICE
  // =========================================

  const formatPrice = (value: number): string => {
    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="space-y-4">

      {/* ===================================== */}
      {/* SUMMARY */}
      {/* ===================================== */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        {/* SELLING PRICE */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Selling Price
          </p>

          <p className="mt-1 text-lg font-bold text-gray-900">
            {formatPrice(sellingPrice)}
          </p>
        </div>

        {/* MRP */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            MRP
          </p>

          <p className="mt-1 text-lg font-bold text-gray-900">
            {formatPrice(mrp)}
          </p>
        </div>

        {/* RATING */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Rating
          </p>

          <div className="mt-1 flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

            <span className="text-lg font-bold text-gray-900">
              {ratingAverage}
            </span>

            <span className="text-[10px] text-gray-400">
              ({ratingCount})
            </span>
          </div>
        </div>

        {/* STOCK */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Stock
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {stockQuantity}
            </span>

            <span
              className={
                isAvailable
                  ? "rounded-md bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700"
                  : "rounded-md bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600"
              }
            >
              {isAvailable
                ? "Available"
                : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

        {/* ================================= */}
        {/* ATTRIBUTES */}
        {/* ================================= */}

        <section className="rounded-xl border border-gray-100 bg-white p-4">

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Variant Attributes
            </h2>

            <span className="text-[10px] text-gray-400">
              {attributes.length}{" "}
              {attributes.length === 1
                ? "attribute"
                : "attributes"}
            </span>
          </div>

          {attributes.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {attributes.map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5"
                >
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    {key}
                  </p>

                  <p className="mt-0.5 break-words text-xs font-semibold text-gray-800">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-xs text-gray-400">
              No attributes available.
            </p>
          )}
        </section>

        {/* ================================= */}
        {/* PRICING */}
        {/* ================================= */}

        <section className="rounded-xl border border-gray-100 bg-white p-4">

          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Pricing
          </h2>

          <div className="overflow-hidden rounded-lg border border-gray-100">

            <div className="grid grid-cols-[1fr_auto] border-b border-gray-100 bg-gray-50/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              <span>Price Type</span>
              <span>Amount</span>
            </div>

            <PriceRow
              label="Selling Price"
              value={formatPrice(sellingPrice)}
            />

            <PriceRow
              label="MRP"
              value={formatPrice(mrp)}
            />

            <PriceRow
              label="Purchase Price"
              value={formatPrice(purchasePrice)}
              last
            />
          </div>
        </section>

        {/* ================================= */}
        {/* INVENTORY */}
        {/* ================================= */}

        <section className="rounded-xl border border-gray-100 bg-white p-4">

          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Inventory
          </h2>

          <div className="overflow-hidden rounded-lg border border-gray-100">

            <InfoRow
              label="Stock Quantity"
              icon={
                <Boxes className="h-3.5 w-3.5 text-gray-400" />
              }
              value={stockQuantity}
            />

            <InfoRow
              label="Availability"
              value={
                <StatusBadge
                  active={isAvailable}
                  activeText="Available"
                  inactiveText="Out of Stock"
                />
              }
            />

            <InfoRow
              label="Backend Stock Flag"
              value={
                <StatusBadge
                  active={
                    variant.stock?.inStock === true
                  }
                  activeText="In Stock"
                  inactiveText="Not In Stock"
                  blue
                />
              }
            />

            <InfoRow
              label="Weighted Product"
              icon={
                <Scale className="h-3.5 w-3.5 text-gray-400" />
              }
              value={
                variant.isWeighted
                  ? "Yes"
                  : "No"
              }
              last
            />
          </div>
        </section>

        {/* ================================= */}
        {/* VARIANT INFORMATION */}
        {/* ================================= */}

        <section className="rounded-xl border border-gray-100 bg-white p-4">

          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Variant Information
          </h2>

          <div className="overflow-hidden rounded-lg border border-gray-100">

            <InfoTableRow
              label="SKU"
              value={variant.sku || "N/A"}
            />

            <InfoTableRow
              label="Slug"
              value={variant.slug || "N/A"}
              mono
            />

            <InfoTableRow
              label="Product ID"
              value={variant.productId}
              mono
            />

            <InfoTableRow
              label="Warranty"
              value={`${variant.warrantyMonths ?? 0} Months`}
            />

            <InfoTableRow
              label="Status"
              value={variant.status}
              last
            />
          </div>
        </section>
      </div>

      {/* ===================================== */}
      {/* RATINGS */}
      {/* ===================================== */}

      <section className="rounded-xl border border-gray-100 bg-white p-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

            <h2 className="text-sm font-semibold text-gray-900">
              Ratings
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">
              {ratingAverage}
            </span>

            <span className="text-xs text-gray-400">
              from {ratingCount} reviews
            </span>
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* ADDITIONAL INFORMATION */}
      {/* ===================================== */}

      <section className="rounded-xl border border-gray-100 bg-white p-4">

        <div className="mb-3 flex items-center gap-2">

          <Info className="h-4 w-4 text-teal-600" />

          <h2 className="text-sm font-semibold text-gray-900">
            Additional Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

          <InfoBox
            label="Variant ID"
            value={variant.id}
            mono
          />

          <InfoBox
            label="Product ID"
            value={variant.productId}
            mono
          />
        </div>
      </section>
    </div>
  );
}

// =========================================
// PRICE ROW
// =========================================

interface PriceRowProps {
  label: string;
  value: string;
  last?: boolean;
}

function PriceRow({
  label,
  value,
  last = false,
}: PriceRowProps) {
  return (
    <div
      className={
        last
          ? "grid grid-cols-[1fr_auto] items-center px-3 py-2.5"
          : "grid grid-cols-[1fr_auto] items-center border-b border-gray-100 px-3 py-2.5"
      }
    >
      <span className="text-xs text-gray-500">
        {label}
      </span>

      <span className="text-sm font-bold text-gray-800">
        {value}
      </span>
    </div>
  );
}

// =========================================
// INFO ROW
// =========================================

interface InfoRowProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  last?: boolean;
}

function InfoRow({
  label,
  value,
  icon,
  last = false,
}: InfoRowProps) {
  return (
    <div
      className={
        last
          ? "grid grid-cols-[1fr_auto] items-center px-3 py-2.5"
          : "grid grid-cols-[1fr_auto] items-center border-b border-gray-100 px-3 py-2.5"
      }
    >
      <div className="flex items-center gap-2 text-xs text-gray-600">
        {icon}
        {label}
      </div>

      <div className="text-xs font-semibold text-gray-800">
        {value}
      </div>
    </div>
  );
}

// =========================================
// STATUS BADGE
// =========================================

interface StatusBadgeProps {
  active: boolean;
  activeText: string;
  inactiveText: string;
  blue?: boolean;
}

function StatusBadge({
  active,
  activeText,
  inactiveText,
  blue = false,
}: StatusBadgeProps) {
  let className =
    "rounded-md px-2 py-1 text-[10px] font-semibold";

  if (active) {
    className += blue
      ? " bg-blue-50 text-blue-700"
      : " bg-green-50 text-green-700";
  } else {
    className +=
      " bg-gray-100 text-gray-500";
  }

  return (
    <span className={className}>
      {active
        ? activeText
        : inactiveText}
    </span>
  );
}

// =========================================
// INFO TABLE ROW
// =========================================

interface InfoTableRowProps {
  label: string;
  value: ReactNode;
  mono?: boolean;
  last?: boolean;
}

function InfoTableRow({
  label,
  value,
  mono = false,
  last = false,
}: InfoTableRowProps) {
  let valueClassName =
    "break-all text-right text-xs font-semibold text-gray-800";

  if (mono) {
    valueClassName +=
      " font-mono text-[10px]";
  }

  return (
    <div
      className={
        last
          ? "grid grid-cols-[130px_minmax(0,1fr)] gap-4 px-3 py-2.5"
          : "grid grid-cols-[130px_minmax(0,1fr)] gap-4 border-b border-gray-100 px-3 py-2.5"
      }
    >
      <span className="text-xs text-gray-500">
        {label}
      </span>

      <span className={valueClassName}>
        {value}
      </span>
    </div>
  );
}

// =========================================
// INFO BOX
// =========================================

interface InfoBoxProps {
  label: string;
  value: string;
  mono?: boolean;
}

function InfoBox({
  label,
  value,
  mono = false,
}: InfoBoxProps) {
  const valueClassName = mono
    ? "mt-1 break-all font-mono text-[10px] font-semibold text-gray-700"
    : "mt-1 break-all text-xs font-semibold text-gray-700";

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5">

      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className={valueClassName}>
        {value}
      </p>

    </div>
  );
}