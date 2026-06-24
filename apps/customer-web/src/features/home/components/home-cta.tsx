"use client";

import Image from "next/image";
import Link from "next/link";

import { MoveRight } from "lucide-react";

export function HomeCta() {
  return (
    <section className="px-4 py-6">
      <div
        className="
          relative
          overflow-hidden
          rounded-[24px]
        "
      >
        {/* BACKGROUND IMAGE */}
        <div className="relative h-[260px] w-full md:h-[340px]">
          <Image
            src="images/CTA2.jpg"
            alt="Dental Clinic"
            fill
            priority
            unoptimized
            className="object-cover"
          />

          {/* OVERLAY */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#0F172A]/85
              via-[#0F172A]/60
              to-transparent
            "
          />
        </div>

        {/* CONTENT */}
        <div
          className="
            absolute
            inset-0
            flex
            items-center
          "
        >
          <div
            className="
              max-w-2xl
              px-6

              md:px-10
            "
          >
            {/* TITLE */}
            <h2
              className="
                text-2xl
                font-bold
                leading-tight
                text-white

                md:text-5xl
              "
            >
              Build Your Modern
              <br />
              Dental Practice
            </h2>

            {/* DESCRIPTION */}
            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-7
                text-gray-200

                md:text-base
              "
            >
              Premium equipment, trusted brands,
              and complete clinic setup solutions
              for healthcare professionals.
            </p>

            {/* BUTTON */}
            <div className="mt-5">
              <Link href="/contact-us">
                <button
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-black
                    transition-all
                    duration-200
                    hover:bg-gray-100
                  "
                >
                  Contact Us for Bulk Order

                  <MoveRight
                    size={18}
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}