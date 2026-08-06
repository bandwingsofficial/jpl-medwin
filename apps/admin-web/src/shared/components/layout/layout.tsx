"use client";

import { Sidebar } from "./admin-sidebar";
import { Header } from "./admin-header";

export function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        h-screen
        w-full
        overflow-hidden
        bg-gray-50
      "
    >
      {/* SIDEBAR BLOCK */}
      <div
        className="
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-64
          shrink-0
        "
      >
        <Sidebar />
      </div>

      {/* MAIN CONTENT REGION CONTAINER */}
      <div
        className="
          ml-64
          flex
          min-w-0
          flex-1
          flex-col
          h-screen
          overflow-hidden
        "
      >
        {/* STICKY LAYOUT APP BAR HEADER */}
        <div
          className="
            sticky
            top-0
            z-40
            bg-white
            w-full
          "
        >
          <Header />
        </div>

        {/* INTERACTIVE COMPOSABLE CORE VIEW CONTENT */}
        <main
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-5
            md:p-6
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}