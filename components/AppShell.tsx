"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#f0f9ff,_#e2e8f0_38%,_#f8fafc)] text-slate-900">
      <div className="mx-auto flex w-full max-w-[1400px] gap-4 px-3 py-3 md:px-5 md:py-5">
        <Sidebar />
        <main className="min-h-[calc(100vh-24px)] flex-1 overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
