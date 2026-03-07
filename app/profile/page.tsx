"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Globe,
  GraduationCap,
  Languages,
  Lock,
  LogOut,
  Pencil,
  Settings,
  ShieldCheck,
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
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <main className="mx-auto w-full max-w-5xl px-4 py-8">
          <section className="rounded-xl border border-slate-100 bg-white p-8">
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <section className="mb-8 flex flex-col gap-8 rounded-xl border border-slate-100 bg-white p-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
            <div className="h-32 w-32 rounded-full bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuAaQRkXzeyjlakjQwwd4RoCBUKoWo5WWV9lS9JFkhzD3zRWlrSzEuEQjHG7X4Aq8uDZ0sDzT05fxIS8Ck2Gu9veDn6BM1Rb4KkB3_cq9qHDKokTAa10L5I-eq3-QMaroTW86tq9F6P39OidB6LF-VQta_YE2jpa1QnPBRb9Evu2ntmE4Q4cBv0kOs1ZBPUu8dM6J_I8bmC89fsUviNrl2mMN1Hn9q08_n8PmNhCoQulNzr7z8rCIQ3wCZGkhv0RC4BtsyDnvl0Y44Dq')] bg-cover bg-center ring-4 ring-blue-100" />

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-lg text-slate-500">{user.email}</p>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800">
            <Pencil size={14} /> Редактировать профиль
          </button>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <section className="rounded-xl border border-slate-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
              <ShieldCheck className="text-blue-700" size={20} />
              <h2 className="text-xl font-bold">Подписка</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <span className="text-slate-600">Статус</span>
                <span className={`inline-flex items-center gap-1 font-bold ${isSubscribed ? "text-emerald-700" : "text-slate-600"}`}>
                  {isSubscribed ? <CheckCircle2 size={16} /> : null} {isSubscribed ? "Активен" : "Не активен"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <span className="text-slate-600">Тариф</span>
                <span className="font-bold">{isSubscribed ? "Premium" : "Free"}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <span className="text-slate-600">Следующее списание</span>
                <span className="font-bold">{isSubscribed ? "По графику платежей" : "—"}</span>
              </div>
            </div>

            {isSubscribed ? (
              <Link href="/premium" className="mt-5 inline-flex w-full items-center justify-center rounded-lg border-2 border-blue-200 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50">
                Управление подпиской
              </Link>
            ) : (
              <Link href="/premium" className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-700 py-2.5 text-sm font-bold text-white hover:bg-blue-800">
                Оплатить подписку
              </Link>
            )}
          </section>

          <section className="rounded-xl border border-slate-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
              <Settings className="text-blue-700" size={20} />
              <h2 className="text-xl font-bold">Настройки аккаунта</h2>
            </div>

            <div className="space-y-1">
              <button className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-slate-50">
                <span className="inline-flex items-center gap-3 text-sm font-medium"><Lock size={16} className="text-slate-400" /> Изменить пароль</span>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
              <button className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-slate-50">
                <span className="inline-flex items-center gap-3 text-sm font-medium"><Languages size={16} className="text-slate-400" /> Язык интерфейса</span>
                <span className="text-sm text-slate-400">Русский</span>
              </button>
              <button onClick={handleLogout} className="mt-2 flex w-full items-center justify-between rounded-lg p-3 text-red-600 hover:bg-red-50">
                <span className="inline-flex items-center gap-3 text-sm font-bold"><LogOut size={16} /> Выйти из системы</span>
              </button>
            </div>
          </section>
        </div>

        <section className="mb-8 rounded-xl border border-slate-100 bg-white p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-blue-700" size={22} />
              <h2 className="text-2xl font-bold">Мой прогресс</h2>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-slate-50 px-4 py-2">
              <span className="text-sm text-slate-500">Общий прогресс:</span>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-32 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full bg-emerald-600" style={{ width: `${lessonStats.totalPercent}%` }} />
                </div>
                <span className="font-bold text-emerald-700">{lessonStats.totalPercent}%</span>
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <h3 className="mb-4 inline-flex items-center gap-2 font-bold">
                <BookOpen size={16} className="text-blue-700" /> Завершенные модули
              </h3>
              <ul className="space-y-3 text-sm">
                {lessonStats.completed.length > 0 ? (
                  lessonStats.completed.map((item) => (
                    <li key={item.lesson.id} className="inline-flex items-center gap-2 text-slate-700">
                      <CheckCircle2 size={14} className="text-emerald-600" /> {item.lesson.title}
                    </li>
                  ))
                ) : (
                  <li className="inline-flex items-center gap-2 text-slate-500">
                    <Globe size={14} className="text-slate-300" /> Пока нет завершенных уроков
                  </li>
                )}
                {lessonStats.inProgress.map((item) => (
                  <li key={`in-progress-${item.lesson.id}`} className="inline-flex items-center gap-2 text-slate-500">
                    <Globe size={14} className="text-slate-300" /> {item.lesson.title} (в процессе, {item.percent}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-8 md:px-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="inline-flex items-center gap-2 opacity-60">
            <GraduationCap size={16} />
            <span className="text-sm font-bold">AutismSkillForge Academy</span>
          </div>
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
