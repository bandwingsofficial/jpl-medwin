"use client";

import Link from "next/link";
import { 
  BarChart3, 
  Settings, 
  Layers, 
  Megaphone, 
  Wallet, 
  History, 
  ArrowRight 
} from "lucide-react";

const sections = [
  {
    title: "Analytics",
    description: "View overall coin statistics and platform analytics.",
    href: "/coins/analytics",
    icon: BarChart3,
  },
  {
    title: "Coin Configuration",
    description: "Manage global coin settings and reward configurations.",
    href: "/coins/configuration",
    icon: Settings,
  },
  {
    title: "Reward Tiers",
    description: "Create and manage reward tiers.",
    href: "/coins/tiers",
    icon: Layers,
  },
  {
    title: "Campaigns",
    description: "Manage promotional campaigns and bonus rewards.",
    href: "/coins/campaigns",
    icon: Megaphone,
  },
  {
    title: "Wallet Management",
    description: "Search user wallets and manage coins.",
    href: "/coins/wallets",
    icon: Wallet,
  },
  {
    title: "Transactions",
    description: "View all coin transactions and history.",
    href: "/coins/transactions",
    icon: History,
  },
];

export default function CoinsPage() {
  return (
    <div className="w-full space-y-5 select-none">
      
      {/* 🪙 COMPACT SECTION HEADER */}
      <div className="pb-1 border-b border-gray-100">
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
          Coins Management
        </h1>
        <p className="mt-0.5 text-xs text-gray-400 font-medium">
          Configure rewards, promotional campaigns, user wallets, and transaction statements.
        </p>
      </div>

      {/* 🎛️ SIMPLE REFINED DIRECTORY GRID */}
      <div 
        className="
          grid 
          grid-cols-1 
          gap-3.5
          sm:grid-cols-2 
          lg:grid-cols-3
        "
      >
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.href}
              href={section.href}
              className="
                group 
                relative
                flex 
                flex-col 
                justify-between
                rounded-xl 
                border 
                border-gray-200/80
                bg-white 
                p-4
                shadow-sm
                transition-all 
                duration-200 
                hover:border-teal-500/30
                hover:shadow-md
                hover:pl-4.5
              "
            >
              {/* Left active line indicator fallback effect */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-teal-500 opacity-0 group-hover:opacity-100 transition-all duration-200" />

              <div className="space-y-2">
                {/* ICON CONTAINER */}
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 border border-teal-100/40">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="space-y-0.5">
                  <h2 className="text-[14px] font-bold text-gray-900 transition-colors group-hover:text-teal-700">
                    {section.title}
                  </h2>
                  <p className="text-[12px] text-gray-400 leading-normal font-medium">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* ACTION LINK MINI FOOTER */}
              <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-gray-50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-teal-600 transition-colors">
                  Open Control
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-teal-600" />
              </div>

            </Link>
          );
        })}
      </div>

    </div>
  );
}