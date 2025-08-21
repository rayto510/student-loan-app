"use client";

import { ReactNode, useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userToggled, setUserToggled] = useState(false);

  useEffect(() => {
    // On first mount, set based on screen width
    if (window.innerWidth < 768) setOpen(false);
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!userToggled) {
        // Only auto-collapse if user hasn't toggled manually
        if (window.innerWidth < 768 && open) {
          setOpen(false);
        } else if (window.innerWidth >= 768 && !open) {
          setOpen(true);
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open, userToggled]);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        open={open}
        setOpen={(value) => {
          setOpen(value);
          setUserToggled(true); // mark that user toggled manually
        }}
      />

      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-slate-400" />
            </div>
            <span className="text-slate-700 font-medium">Hello, John</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
