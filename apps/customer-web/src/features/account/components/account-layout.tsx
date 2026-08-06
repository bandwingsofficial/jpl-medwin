"use client";

import { ReactNode, useState } from "react";
import { AccountSidebar } from "@/features/account/components/account-sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface Props {
  children: ReactNode;
}

export function AccountLayout({ children }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <section className="bg-gray-50/50 w-full flex-1 relative">
      {/* 📱 MOBILE FLOATING MENU TOGGLE BUTTON */}
      {/* Shifted to bottom-24 to avoid header collision and sit comfortably above the bottom navigation/footer */}
      <div className="lg:hidden fixed bottom-24 right-6 z-[9999]">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-14 w-14 rounded-full shadow-2xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center border border-teal-500 transition-transform active:scale-95"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* 📱 MOBILE SIDEBAR DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[9998] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-2 shadow-2xl animate-in slide-in-from-bottom-10 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 pt-3 pb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Navigation</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Closes drawer automatically when navigation links inside are clicked */}
            <div onClick={() => setIsMobileMenuOpen(false)}>
              <AccountSidebar isMobile={true} />
            </div>
          </div>
        </div>
      )}

      <div 
        className="
          mx-auto 
          w-full 
          max-w-[1280px] 
          px-4 
          py-6 
          sm:px-6 
          lg:py-10
        "
      >
        <div className="flex flex-col gap-6 lg:flex-row items-start">
          
          {/* 🏷️ DESKTOP SIDEBAR PANEL (Hidden on Mobile) */}
          <div className="hidden lg:block w-full lg:sticky lg:top-28 lg:w-[280px] flex-shrink-0">
            <AccountSidebar />
          </div>

          {/* 📦 MAIN PAGE CONTENT PANEL */}
          <div className="min-w-0 flex-1 w-full bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            {children}
          </div>

        </div>
      </div>
    </section>
  );
}