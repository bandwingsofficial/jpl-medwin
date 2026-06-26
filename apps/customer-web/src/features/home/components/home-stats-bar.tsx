"use client";

import {
  Award,
  BadgeCheck,
  Package,
  ShieldCheck,
} from "lucide-react";

const STATS = [
  { icon: Package, title: "10,000+ Products" },
  { icon: Award, title: "100+ Trusted Brands" },
  { icon: BadgeCheck, title: "100% Original" },
  { icon: ShieldCheck, title: "Assured Best Prices" },
];

export function HomeStatsBar() {
  return (
    <section className="w-full px-4 md:px-6 py-6 bg-white">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Capsule container: Uses a responsive grid layout on mobile (2 columns) and flex row on larger screens */}
        <div className="w-full bg-[#0c8c7f] rounded-[32px] sm:rounded-full py-5 px-6 md:px-12 grid grid-cols-2 sm:flex sm:flex-row flex-wrap items-center justify-around gap-y-5 gap-x-4 select-none shadow-sm">
          {STATS.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 sm:gap-3 justify-start sm:justify-center mx-auto sm:mx-0 w-full sm:w-auto sm:min-w-[200px]"
            >
              {/* Clean white icons with strong stroke */}
              <item.icon className="h-4 w-4 md:h-5 md:w-5 stroke-[2.5] text-white flex-shrink-0" />
              
              {/* Text elements formatted cleanly for tight mobile screens */}
              <span className="text-xs xs:text-sm md:text-base font-medium text-white tracking-tight whitespace-nowrap">
                {item.title}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}