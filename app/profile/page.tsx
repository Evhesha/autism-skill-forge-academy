"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  BrainCircuit,
  Languages,
  Lock,
  LogOut,
  Pencil,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import type { Lesson } from "@/constants/lessons";
import { fetchAllLessonProgress, progressToPercent, type LessonProgressRecord } from "@/lib/lessonProgress";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isSubscribed, logout } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgressRecord>>({});

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

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

    if (!isAuthenticated) return () => { isCancelled = true; };

    fetchAllLessonProgress()
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

  const lessonStats = useMemo(() => {
    const records = lessons.map((lesson) => {
      const progress = progressMap[lesson.id];
      const currentStep = progress?.currentStep ?? 0;
      const isCompleted = Boolean(progress?.isCompleted);
      const percent = progressToPercent(currentStep, isCompleted, lesson.screens.length);
      return {
        lesson,
        currentStep,
        isCompleted,
        percent,
      };
    });

    const completed = records.filter((item) => item.isCompleted);
    const inProgress = records.filter((item) => item.currentStep > 0 && !item.isCompleted);
    const totalPercent =
      records.length > 0
        ? Math.round(records.reduce((acc, item) => acc + item.percent, 0) / records.length)
        : 0;

    return { records, completed, inProgress, totalPercent };
  }, [lessons, progressMap]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe,transparent_24%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_55%,#eef4ff_100%)] text-slate-900">
        <main className="mx-auto w-full max-w-5xl px-4 py-8">
          <section className="rounded-[28px] border border-white/80 bg-white/85 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <h1 className="text-2xl font-bold">Профиль недоступен</h1>
            <p className="mt-2 text-slate-600">Войдите или зарегистрируйтесь, чтобы открыть настройки аккаунта.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/auth" className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800">
                Войти
              </Link>
              <Link href="/auth" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                Зарегистрироваться
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe,transparent_20%),radial-gradient(circle_at_90%_20%,#cffafe,transparent_24%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_45%,#eef4ff_100%)] text-slate-900">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        <section className="mb-6 overflow-hidden rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-cyan-100 via-white to-blue-200 text-3xl font-black text-slate-900 shadow-inner ring-1 ring-white/80">
                {user.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase() ?? "")
                  .join("") || "AS"}
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
                  <UserRound size={12} /> Personal Cabinet
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight md:text-4xl">{user.name}</h1>
                  <p className="mt-1 text-base text-slate-500">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${isSubscribed ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
                    {isSubscribed ? "Premium active" : "Free plan"}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800">
                    Общий прогресс {lessonStats.totalPercent}%
                  </span>
                </div>
              </div>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
              <Pencil size={14} /> Редактировать профиль
            </button>
          </div>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Прогресс</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{lessonStats.totalPercent}%</p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600" style={{ width: `${lessonStats.totalPercent}%` }} />
            </div>
          </article>

          <article className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Завершено</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{lessonStats.completed.length}</p>
            <p className="mt-2 text-sm text-slate-500">уроков завершено полностью</p>
          </article>

          <article className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Тариф</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{isSubscribed ? "Premium" : "Free"}</p>
            <p className="mt-2 text-sm text-slate-500">{isSubscribed ? "Доступ к premium-урокам открыт" : "Можно открыть дополнительные уроки"}</p>
          </article>
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur">
            <div className="mb-6 flex items-center gap-2">
              <BarChart3 className="text-blue-700" size={20} />
              <h2 className="text-2xl font-black">Прогресс по урокам</h2>
            </div>

            <div className="space-y-4">
              {lessonStats.records.length > 0 ? lessonStats.records.map((item) => (
                <div key={item.lesson.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-base font-bold text-slate-900">{item.lesson.title}</p>
                      <p className="text-sm text-slate-500">{item.lesson.subtitle}</p>
                    </div>
                    <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${item.isCompleted ? "bg-emerald-100 text-emerald-800" : item.currentStep > 0 ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-700"}`}>
                      {item.isCompleted ? "Завершён" : item.currentStep > 0 ? `В процессе ${item.percent}%` : "Не начат"}
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  Уроки пока не загружены.
                </div>
              )}
            </div>
          </article>

          <div className="space-y-6">
            <article className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur">
              <div className="mb-5 flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={20} />
                <h2 className="text-xl font-black">Подписка</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Статус</span>
                  <span className={`font-bold ${isSubscribed ? "text-emerald-700" : "text-slate-700"}`}>{isSubscribed ? "Активен" : "Не активен"}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Тариф</span>
                  <span className="font-bold text-slate-900">{isSubscribed ? "Premium" : "Free"}</span>
                </div>
              </div>

              <Link href="/premium" className={`mt-5 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-bold transition ${isSubscribed ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
                {isSubscribed ? "Управление подпиской" : "Открыть Premium"}
              </Link>
            </article>

            <article className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur">
              <div className="mb-5 flex items-center gap-2">
                <Settings className="text-cyan-700" size={20} />
                <h2 className="text-xl font-black">Настройки</h2>
              </div>

              <div className="space-y-2">
                <button className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-slate-50">
                  <span className="inline-flex items-center gap-3 text-sm font-medium"><Lock size={16} className="text-slate-400" /> Изменить пароль</span>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
                <button className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-slate-50">
                  <span className="inline-flex items-center gap-3 text-sm font-medium"><Languages size={16} className="text-slate-400" /> Язык интерфейса</span>
                  <span className="text-sm text-slate-400">Русский</span>
                </button>
                <button onClick={handleLogout} className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-red-600 transition hover:bg-red-50">
                  <span className="inline-flex items-center gap-3 text-sm font-bold"><LogOut size={16} /> Выйти из системы</span>
                </button>
              </div>
            </article>

            <article className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="text-blue-700" size={18} />
                <h2 className="text-xl font-black">Итоги</h2>
              </div>

              <ul className="space-y-3 text-sm text-slate-600">
                <li className="rounded-2xl bg-slate-50 px-4 py-3">
                  Завершено уроков: <span className="font-bold text-slate-900">{lessonStats.completed.length}</span>
                </li>
                <li className="rounded-2xl bg-slate-50 px-4 py-3">
                  В процессе: <span className="font-bold text-slate-900">{lessonStats.inProgress.length}</span>
                </li>
                <li className="rounded-2xl bg-slate-50 px-4 py-3">
                  Средний прогресс: <span className="font-bold text-slate-900">{lessonStats.totalPercent}%</span>
                </li>
              </ul>
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/70 bg-white/70 px-6 py-8 backdrop-blur md:px-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-slate-900 transition hover:bg-slate-100">
          <BrainCircuit size={18} />
          <span className="text-sm font-bold tracking-wide">AutismSkillForge</span>
        </Link>
          <div className="flex gap-6">
            <a className="text-xs text-slate-500 hover:text-blue-700" href="#">Поддержка</a>
            <a className="text-xs text-slate-500 hover:text-blue-700" href="#">Политика конфиденциальности</a>
            <a className="text-xs text-slate-500 hover:text-blue-700" href="#">Условия использования</a>
          </div>
          <p className="text-xs text-slate-400">© 2026 Все права защищены</p>
        </div>
      </footer>
    </div>
  );
}
