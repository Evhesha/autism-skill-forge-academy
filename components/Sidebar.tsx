"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Home, Lock, UserRound } from "lucide-react";
import { lessons } from "@/constants/lessons";
import { useAuth } from "@/app/context/AuthContext";

function lessonProgress(lessonId: string): number {
  if (typeof window === "undefined") return 0;

  try {
    const raw = localStorage.getItem("asf_progress_map");
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as Record<string, number>;
    const value = parsed[lessonId] ?? 0;
    return Math.max(0, Math.min(100, Math.round((value / 10) * 100)));
  } catch {
    return 0;
  }
}

export function Sidebar() {
  const pathname = usePathname();
  const { isSubscribed } = useAuth();

  const progressMap = Object.fromEntries(lessons.map((lesson) => [lesson.id, lessonProgress(lesson.id)]));

  return (
    <aside className="sticky top-3 h-[calc(100vh-24px)] w-72 shrink-0 rounded-3xl border border-white/60 bg-white/55 p-4 shadow-[0_16px_44px_rgba(15,23,42,0.18)] backdrop-blur-md">
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-slate-900 px-3 py-3 text-white">
        <BrainCircuit size={22} />
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-300">AutismSkillForge</p>
          <p className="text-sm font-semibold">Academy</p>
        </div>
      </div>

      <nav className="mb-5 space-y-2">
        <Link
          href="/"
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
            pathname === "/" ? "bg-cyan-100 text-cyan-900" : "text-slate-600 hover:bg-white/70"
          }`}
        >
          <Home size={16} /> Dashboard
        </Link>
        <Link
          href="/profile"
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
            pathname === "/profile" ? "bg-cyan-100 text-cyan-900" : "text-slate-600 hover:bg-white/70"
          }`}
        >
          <UserRound size={16} /> My Profile
        </Link>
      </nav>

      <div>
        <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Lesson Tree</p>
        <ul className="space-y-2">
          {lessons.map((lesson, index) => {
            const href = `/lesson/${lesson.id}`;
            const active = pathname === href;
            const locked = lesson.premium && !isSubscribed;

            return (
              <li key={lesson.id}>
                <Link
                  href={href}
                  className={`block rounded-xl border px-3 py-2 transition ${
                    active
                      ? "border-cyan-200 bg-cyan-100/80"
                      : "border-transparent bg-white/40 hover:border-slate-200 hover:bg-white/75"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">
                      {index + 1}. {lesson.shortTitle}
                    </p>
                    <div className="flex items-center gap-1">
                      {lesson.premium ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                          Premium
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                          Free
                        </span>
                      )}
                      {locked && <Lock size={13} className="text-slate-500" />}
                    </div>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
                      style={{ width: `${progressMap[lesson.id] ?? 0}%` }}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
