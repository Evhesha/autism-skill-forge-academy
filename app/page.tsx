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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-700 via-blue-700 to-slate-900 p-6 text-white md:p-8">
  {/* Декоративный элемент фона */}
  <div className="absolute right-0 top-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
  <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
  
  <div className="relative z-10">
    <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] backdrop-blur-sm">
      <Sparkles size={14} /> AutismSkillForge Academy
    </p>
    
    <h1 className="max-w-3xl text-3xl font-black leading-tight md:text-5xl">
      С возвращением в 
      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-100">
        мир структурированного обучения
      </span>
    </h1>
    
    <p className="mt-4 max-w-2xl text-sm text-cyan-100 md:text-base">
      {user?.name ? (
        <>Рады видеть вас, <span className="font-semibold text-white">{user.name}</span>! </>  
      ) : (
        <>Рады приветствовать вас! </>
      )}
      Продолжайте развивать навыки с нашими интерактивными уроками, чеклистами и тестами.
    </p>

    {/* Блок с мобильным приложением */}
    <div className="mt-8 rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">📱 Мобильное приложение</h3>
          <p className="text-sm text-cyan-100">
            Занимайтесь где угодно. Скачайте наше приложение для iOS и Android.
          </p>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href="https://play.google.com/store/apps/details?id=com.ASF.Sort&hl=ru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black/30 px-4 py-2.5 text-sm font-semibold transition hover:bg-black/40 hover:scale-105 active:scale-100 border border-white/20"
          >
            <img 
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play"
              className="h-8 w-auto"
            />
          </a>
          
          <a
            href="https://apps.apple.com/by/app/autism-skillforge/id6759347576"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black/30 px-4 py-2.5 text-sm font-semibold transition hover:bg-black/40 hover:scale-105 active:scale-100 border border-white/20"
          >
            <img 
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on the App Store"
              className="h-8 w-auto"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
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
