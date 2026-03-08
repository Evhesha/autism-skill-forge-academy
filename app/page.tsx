"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import type { Lesson } from "@/constants/lessons";
import { useAuth } from "@/app/context/AuthContext";
import { fetchAllLessonProgress, progressToPercent, type LessonProgressRecord } from "@/lib/lessonProgress";

export default function HomePage() {
  const { isAuthenticated, isSubscribed, user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgressRecord>>({});

  useEffect(() => {
    let isCancelled = false;

    fetch("/api/lessons", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Не удалось загрузить уроки");
        }
        return response.json() as Promise<Lesson[]>;
      })
      .then((data) => {
        if (isCancelled) return;
        setLessons(data);
      })
      .catch(() => {
        if (isCancelled) return;
        setLessons([]);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    fetchAllLessonProgress(isAuthenticated)
      .then((progress) => {
        if (isCancelled) return;
        setProgressMap(progress);
      })
      .catch(() => {
        if (isCancelled) return;
        setProgressMap({});
      });

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-cyan-700 via-blue-700 to-slate-900 p-6 text-white md:p-8">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
          <Sparkles size={14} /> AutismSkillForge Academy
        </p>
        <h1 className="max-w-3xl text-3xl font-black md:text-5xl">Интерактивная платформа электронного обучения для структурированного развития навыков.</h1>
        <p className="mt-3 max-w-2xl text-sm text-cyan-100 md:text-base">
          Добро пожаловать{user?.name ? `, ${user.name}` : ""}. Выберите урок и проходите экраны с чеклистами,
          видео, тестами и протоколами в одном динамическом потоке.
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Уроки</h2>
          {!isSubscribed && (
            <Link href="/premium" className="text-sm font-semibold text-cyan-700 hover:underline">
              Получить Premium
            </Link>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson, index) => {
            const requiresAuth = Boolean(lesson.requiresAuth);
            const locked = lesson.premium ? !isSubscribed : requiresAuth && !isAuthenticated;
            const lessonProgress = progressMap[lesson.id];
            const progress = lessonProgress
              ? progressToPercent(lessonProgress.currentStep, lessonProgress.isCompleted, lesson.screens.length)
              : 0;

            return (
              <Link
                key={lesson.id}
                href={`/lesson/${lesson.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Lesson {index + 1}</span>
                  <div className="flex items-center gap-2">
                    {lesson.premium ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                        Premium
                      </span>
                    ) : requiresAuth ? (
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-700">
                        Members
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                        Free
                      </span>
                    )}
                    {locked && <Lock size={14} className="text-slate-500" />}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{lesson.shortTitle}</h3>
                <p className="mt-1 text-sm text-slate-600">{lesson.subtitle}</p>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700">
                  Open lesson <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
