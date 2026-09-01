"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { Coupon } from "../types/coupon.type";

import CouponTable from "./coupon-table";

import CreateCouponModal from "./create-coupon-modal";

import UpdateCouponModal from "./update-coupon-modal";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function CouponPage() {
  const [createOpen, setCreateOpen] =
    useState(false);

  const [updateOpen, setUpdateOpen] =
    useState(false);

  const [selected, setSelected] =
    useState<Coupon | null>(null);

  /**
   * CREATE
   */
  const handleCreate = () => {
    setSelected(null);

    setCreateOpen(true);
  };

  /**
   * EDIT
   */
  const handleEdit = (
    coupon: Coupon
  ) => {
    setSelected(coupon);

    setUpdateOpen(true);
  };

return (
  <div className="p-0 space-y-6">

    {/* BREADCRUMBS */}

    <div className="flex items-center gap-2 text-sm">
      <Link
        href="/"
        className="
          inline-flex
          items-center
          gap-1.5
          font-medium
          text-slate-500
          transition-colors
          hover:text-teal-600
        "
      >
        <Home className="h-4 w-4" />
        Home
      </Link>

      <ChevronRight className="h-4 w-4 text-slate-300" />

      <span className="font-semibold text-teal-600">
        Coupons
      </span>
    </div>

    {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="
            animate-text-shine
            bg-gradient-to-r 
            from-[#001f3f] 
            via-[#0d9488] 
            to-[#001f3f] 
            bg-clip-text 
            text-[28px] 
            font-bold 
            text-transparent
          ">
            Coupons
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage platform coupons
          </p>
        </div>

        <Button onClick={handleCreate}>
          + Create Coupon
        </Button>
      </div>

      {/* TABLE */}
      <CouponTable
        onEdit={handleEdit}
      />

      {/* CREATE */}
      <CreateCouponModal
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
      />

      {/* UPDATE */}
      <UpdateCouponModal
        open={updateOpen}
        onClose={() =>
          setUpdateOpen(false)
        }
        coupon={selected}
      />
    </div>
  );
}