"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#f0f9ff,_#e2e8f0_38%,_#f8fafc)] text-slate-900">
      <AppHeader />
      <main className="mx-auto w-full max-w-[1400px] px-3 py-4 md:px-5 md:py-6">{children}</main>
    </div>
  );
}
