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
        
        {/* Capsule container updated to your website's exact brand teal background */}
        <div className="w-full bg-[#0c8c7f] rounded-full py-4 px-6 md:px-12 flex flex-col sm:flex-row flex-wrap items-center justify-around gap-y-4 gap-x-6 select-none shadow-sm">
          {STATS.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 justify-center min-w-[200px]"
            >
              {/* Icons switched to clean white with a slightly punchier stroke */}
              <item.icon className="h-5 w-5 stroke-[2.5] text-white flex-shrink-0" />
              
              {/* Text elements set to white matching the header menu typography layout */}
              <span className="text-sm md:text-base font-medium text-white tracking-tight whitespace-nowrap">
                {item.title}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}