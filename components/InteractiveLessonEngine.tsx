"use client";

import { useEffect, useMemo, useState } from "react";
import { Lock, StepBack, StepForward } from "lucide-react";
import type { Lesson } from "@/constants/lessons";
import { TOTAL_STEPS } from "@/constants/lessons";
import { LessonScreenRenderer } from "@/components/LessonScreenRenderer";
import { PaywallOverlay } from "@/components/PaywallOverlay";
import { useAuth } from "@/app/context/AuthContext";

const storageKey = "asf_progress_map";

type Props = {
  lesson: Lesson;
};

function readProgress(lessonId: string): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return 1;
    const parsed = JSON.parse(raw) as Record<string, number>;
    const step = parsed[lessonId] ?? 1;
    return Math.max(1, Math.min(TOTAL_STEPS, step));
  } catch {
    return 1;
  }
}

function writeProgress(lessonId: string, step: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    const prev = parsed[lessonId] ?? 1;
    parsed[lessonId] = Math.max(prev, step);
    localStorage.setItem(storageKey, JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
}

export function InteractiveLessonEngine({ lesson }: Props) {
  const { isSubscribed } = useAuth();
  const locked = lesson.premium && !isSubscribed;

  const [currentStep, setCurrentStep] = useState(() => readProgress(lesson.id));

  useEffect(() => {
    writeProgress(lesson.id, currentStep);
  }, [lesson.id, currentStep]);

  const activeScreen = useMemo(
    () => lesson.screens[Math.max(0, Math.min(lesson.screens.length - 1, currentStep - 1))],
    [lesson.screens, currentStep],
  );

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-900 p-6 text-white">
        <p className="mb-1 text-xs uppercase tracking-[0.16em] text-cyan-200">Interactive lesson engine</p>
        <h1 className="text-3xl font-black">{lesson.title}</h1>
        <p className="mt-2 text-sm text-cyan-100">{lesson.subtitle}</p>
      </header>

      <div className="relative">
        <div className={`space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:p-6 ${locked ? "blur-sm" : ""}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Step {currentStep} / {TOTAL_STEPS}</p>
            {lesson.premium && (
              <p className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                <Lock size={12} /> Premium lesson
              </p>
            )}
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>

          <div key={activeScreen.id} className="animate-fade-slide rounded-3xl border border-slate-200 bg-white p-4 md:p-6">
            <LessonScreenRenderer screen={activeScreen} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep((value) => Math.max(1, value - 1))}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <StepBack size={16} /> Previous
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep((value) => Math.min(TOTAL_STEPS, value + 1))}
              disabled={currentStep === TOTAL_STEPS}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next <StepForward size={16} />
            </button>
          </div>
        </div>

        {locked && <PaywallOverlay lessonTitle={lesson.shortTitle} />}
      </div>
    </section>
  );
}
