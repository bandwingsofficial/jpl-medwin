"use client";

import { useState } from "react";

import { Sidebar } from "./admin-sidebar";
import { Header } from "./admin-header";

export function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((previousState) => !previousState);
  };

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
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          shrink-0
          transition-[width]
          duration-300
          ease-in-out
          ${
            isSidebarCollapsed
              ? "w-20"
              : "w-64"
          }
        `}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* MAIN CONTENT REGION CONTAINER */}
      <div
        className={`
          flex
          min-w-0
          flex-1
          flex-col
          h-screen
          overflow-hidden
          transition-[margin]
          duration-300
          ease-in-out
          ${
            isSidebarCollapsed
              ? "ml-20"
              : "ml-64"
          }
        `}
      >
        {/* STICKY LAYOUT APP BAR HEADER */}
        <div
          className="
            sticky
            top-0
            z-40
            w-full
            bg-white
          "
        >
          <Header
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
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
