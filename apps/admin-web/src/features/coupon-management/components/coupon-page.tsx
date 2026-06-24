"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { Coupon } from "../types/coupon.type";

import CouponTable from "./coupon-table";

import CreateCouponModal from "./create-coupon-modal";

import UpdateCouponModal from "./update-coupon-modal";

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
    <div className="p-6 space-y-6">
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