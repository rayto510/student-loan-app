"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  CreditCardIcon,
  CogIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LogOutIcon,
  DatabaseIcon,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/loans", label: "Loans", icon: CreditCardIcon },
  { href: "/settings", label: "Settings", icon: CogIcon },
];

export default function DashboardSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "bg-slate-900 text-slate-50 flex flex-col relative transition-all duration-300",
        open ? "w-72" : "w-20"
      )}
    >
      {/* Logo / Title */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800 relative">
        {open ? (
          <>
            <h1 className="text-2xl font-bold tracking-wide flex-1">
              Loan Manager
            </h1>
            <button
              className="text-slate-50 hover:bg-slate-800 rounded p-1 transition-transform"
              onClick={() => setOpen(false)}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <DatabaseIcon className="w-6 h-6 mx-auto" />
            <button
              className="absolute top-6 right-2 text-slate-50 hover:bg-slate-800 rounded p-1 transition-transform"
              onClick={() => setOpen(true)}
            >
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col mt-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-300",
                open ? "justify-start" : "justify-center",
                isActive
                  ? "bg-slate-800 text-indigo-400 font-semibold"
                  : "text-slate-50 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {open && <span className="truncate">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <button
          className={cn(
            "w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-all justify-center"
          )}
        >
          <LogOutIcon className="w-5 h-5" />
          {open && <span className="truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
