import Link from "next/link";
import {
  Bell,
  BookOpen,
  Brain,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  User,
} from "lucide-react";
import { lessons } from "@/constants/lessons";

const stepNames = [
  "Шаг 1: Введение",
  "Шаг 2: Готовность",
  "Шаг 3: Идентификация",
  "Шаг 4: Ассоциации",
  "Шаг 5: Первые связи",
  "Шаг 6: Контекст",
  "Шаг 7: Закрепление",
  "Шаг 8: Проверка",
  "Шаг 9: Обобщение",
  "Шаг 10: Финал",
];

export default function HomePage() {
  const activeLesson = lessons[1];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-4 py-3 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-700 p-2 text-white">
              <Brain size={22} />
            </div>
            <h1 className="text-lg font-extrabold tracking-tight">
              AutismSkillForge Академия
            </h1>
          </div>

          <div className="hidden w-full max-w-sm flex-col gap-1 md:flex">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-500">
              <span>Общий прогресс</span>
              <span className="text-blue-700">35%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[35%] rounded-full bg-blue-700" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 text-slate-600 hover:bg-slate-100">
              <Bell size={18} />
            </button>
            <Link
              href="/profile"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200 bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              aria-label="Профиль"
            >
              <User size={18} />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            Навигация по урокам
          </h2>
          <nav className="space-y-1">
            {lessons.map((lesson, index) => {
              const isActive = index === 1;

              return (
                <div key={lesson.id}>
                  <Link
                    href={`/lesson/${lesson.id}`}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "bg-blue-100 font-bold text-blue-800"
                        : "font-semibold text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <BookOpen size={16} />
                    {lesson.title.replace("Lesson 2: ", "").replace("Lesson 1: ", "").replace("Lesson 3: ", "")}
                    <ChevronRight className="ml-auto" size={14} />
                  </Link>

                  {isActive && (
                    <div className="ml-4 mt-2 border-l-2 border-blue-200 pl-3">
                      {stepNames.map((step, stepIndex) => (
                        <p
                          key={step}
                          className={`py-1 text-xs ${
                            stepIndex === 0
                              ? "font-bold text-blue-700"
                              : "font-medium text-slate-500"
                          }`}
                        >
                          {step}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8 lg:p-12">
          <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
            <span>Обучение</span>
            <ChevronRight size={14} />
            <span className="font-semibold text-slate-900">Персонажи</span>
          </div>

          <section className="mb-10">
            <h2 className="mb-4 text-4xl font-black tracking-tight">
              Модуль: Персонажи
            </h2>
            <p className="max-w-2xl text-lg text-slate-600">
              Изучение социальных связей и логических выводов через взаимодействие с
              персонажами.
            </p>
          </section>

          <section className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-8">
              <div>
                <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-700">
                  Ключевое понятие
                </p>
                <h3 className="text-2xl font-extrabold">Транзитивность</h3>
              </div>
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <TrendingUp size={30} />
              </div>
            </div>

            <div className="p-8">
              <p className="mb-6 max-w-3xl border-l-4 border-blue-200 pl-4 italic text-slate-600">
                Если A связано с B, а B связано с C, то A связано с C.
              </p>

              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold">
                  {activeLesson.chain.a} -&gt; {activeLesson.chain.b}
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold">
                  {activeLesson.chain.b} -&gt; {activeLesson.chain.c}
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-900">
                  {activeLesson.chain.a} -&gt; {activeLesson.chain.c}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 bg-slate-50 px-8 py-5">
              <Link
                href={`/lesson/${activeLesson.id}`}
                className="rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Начать практику
              </Link>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-3 flex items-center gap-2 font-bold">
                <Lightbulb size={18} className="text-blue-700" />
                Совет для учителя
              </div>
              <p className="text-sm text-slate-600">
                Используйте знакомые ребенку имена и изображения, чтобы быстрее
                сформировать связи A -&gt; B -&gt; C.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="mb-3 font-bold">Последние результаты</h3>
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-500">Точность вывода</span>
                <span className="font-bold text-emerald-600">85%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[85%] rounded-full bg-emerald-500" />
              </div>
            </article>
          </section>

          <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm text-slate-700">
              Часть контента доступна только в Premium.
            </p>
            <Link href="/premium" className="mt-2 inline-block text-sm font-semibold text-blue-700 hover:underline">
              Открыть премиум-модалку
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
