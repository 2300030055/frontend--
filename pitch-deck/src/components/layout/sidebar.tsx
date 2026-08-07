"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  LayoutDashboard,
  Presentation,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generating", label: "Generate", icon: Sparkles },
  { href: "/result", label: "Results", icon: Presentation },
  { href: "/payment", label: "Payment", icon: CreditCard },
  { href: "#", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/20 bg-white/60 backdrop-blur-xl lg:flex"
      aria-label="Dashboard sidebar"
    >
      <div className="flex h-16 items-center gap-2 border-b border-slate-200/60 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30">
          <Presentation className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="font-semibold text-slate-900">
          README<span className="gradient-text">Deck</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-violet-600/10 to-indigo-600/10 text-violet-700"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/60 p-4">
        <div className="glass-card rounded-lg p-4">
          <p className="text-xs font-medium text-slate-900">Pro Tip</p>
          <p className="mt-1 text-xs text-slate-500">
            Paste a GitHub URL for automatic README detection.
          </p>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-200/60 bg-white/80 backdrop-blur-xl lg:hidden"
      aria-label="Mobile navigation"
    >
      {navItems.slice(0, 4).map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
              isActive ? "text-violet-700" : "text-slate-500"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
