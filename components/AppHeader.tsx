"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, LayoutDashboard, UserRound } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function AppHeader() {
  const pathname = usePathname();
  const { isAuthenticated, isSubscribed, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-3 py-3 md:px-5">
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-slate-900 transition hover:bg-slate-100">
          <BrainCircuit size={18} />
          <span className="text-sm font-bold tracking-wide">AutismSkillForge</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <Link
              href="/profile"
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                pathname === "/profile"
                  ? "text-cyan-900"
                  : "text-slate-600 hover:bg-white hover:text-slate-900"
              }`}
            >
              <span className="max-w-[140px] truncate">{user.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  isSubscribed ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
                }`}
              >
                {isSubscribed ? "Premium" : "Free"}
              </span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition ${
                pathname === "/auth"
                  ? "text-cyan-900"
                  : "text-slate-600 hover:bg-white hover:text-slate-900"
              }`}
            >
              Login
            </Link>
          )}

          <nav className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-cyan-100 text-cyan-900"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
