"use client";

import Image from "next/image";
import Link from "next/link";

import { MoveRight } from "lucide-react";

export function HomeCta() {
  return (
    <section className="w-full px-3 py-4 sm:px-4 sm:py-6">
      <div className="relative w-full overflow-hidden rounded-[18px] sm:rounded-[24px]">
        {/* BACKGROUND IMAGE */}
        <div
          className="
            relative
            h-[230px]
            w-full
            xs:h-[245px]
            sm:h-[260px]
            md:h-[340px]
          "
        >
          <Image
            src="/Images/CTA4.png"
            alt="Dental Clinic"
            fill
            priority
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 100vw"
            className="
              object-cover
              object-[65%_center]
              sm:object-center
            "
          />

          {/* OVERLAY */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#0F172A]/90
              via-[#0F172A]/70
              to-[#0F172A]/15
              sm:from-[#0F172A]/85
              sm:via-[#0F172A]/60
              sm:to-transparent
            "
          />
        </div>

        {/* CONTENT */}
        <div className="absolute inset-0 flex items-center">
          <div
            className="
              w-full
              max-w-2xl
              px-5
              sm:px-6
              md:px-10
            "
          >
            {/* TITLE */}
            <h2
              className="
                max-w-[280px]
                text-[20px]
                font-bold
                leading-[1.25]
                text-white

                xs:text-[22px]
                sm:max-w-[400px]
                sm:text-2xl
                md:max-w-none
                md:text-5xl
              "
            >
              Everything Your Practice Needs.
              <br />
              All in One Place.
            </h2>

            {/* DESCRIPTION */}
            <p
              className="
                mt-2
                max-w-[285px]
                text-[11px]
                leading-5
                text-gray-200

                xs:mt-3
                xs:text-xs
                xs:leading-6

                sm:max-w-xl
                sm:text-sm
                sm:leading-6

                md:text-base
                md:leading-7
              "
            >
              Explore trusted dental, medical and surgical products from
              leading brands—supported by expert guidance, competitive
              pricing, and reliable delivery.
            </p>

            {/* BUTTON */}
            <div className="mt-4 sm:mt-5">
              <Link
                href="/contact-us"
                className="
                  inline-flex
                  max-w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-4
                  py-2.5
                  text-[11px]
                  font-semibold
                  text-black
                  transition-all
                  duration-200
                  hover:bg-gray-100

                  xs:px-5
                  xs:text-xs
                  sm:px-5
                  sm:py-3
                  sm:text-sm
                "
              >
                <span className="whitespace-nowrap">
                  Contact Us for Bulk Order
                </span>

                <MoveRight
                  size={16}
                  className="shrink-0 sm:h-[18px] sm:w-[18px]"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}