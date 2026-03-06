import Link from "next/link";
import { notFound } from "next/navigation";
import { Bell, Brain, ChevronLeft } from "lucide-react";
import { getLessonById } from "@/constants/lessons";
import { LessonEngine } from "@/components/LessonEngine";

type LessonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const lesson = getLessonById(id);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-700 p-2 text-white">
              <Brain size={22} />
            </div>
            <h2 className="text-lg font-bold tracking-tight">AutismSkillForge</h2>
          </div>

          <nav className="hidden gap-8 md:flex">
            <Link href="/" className="text-sm font-medium hover:text-blue-700">
              Курсы
            </Link>
            <span className="text-sm font-medium text-slate-500">Прогресс</span>
            <span className="text-sm font-medium text-slate-500">Библиотека</span>
          </nav>

          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 text-slate-600 hover:bg-slate-100">
              <Bell size={18} />
            </button>
            <div className="h-10 w-10 rounded-full border-2 border-blue-200 bg-slate-300" />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 pt-6 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          <ChevronLeft size={16} /> К главной
        </Link>
      </div>

      <LessonEngine lesson={lesson} />
    </div>
  );
}
