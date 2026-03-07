"use client";

import { useMemo, useState } from "react";
import type { LessonScreen } from "@/constants/lessons";

type Props = {
  screen: LessonScreen;
};

export function LessonScreenRenderer({ screen }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showCaptions, setShowCaptions] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [expandedProtocolStep, setExpandedProtocolStep] = useState<number | null>(0);

  const checklistProgress = useMemo(() => {
    const values = Object.values(checked);
    if (values.length === 0) return 0;
    const done = values.filter(Boolean).length;
    return Math.round((done / values.length) * 100);
  }, [checked]);

  switch (screen.type) {
    case "checklist": {
      return (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{screen.title}</h2>
            {screen.subtitle && <p className="mt-1 text-sm text-slate-600">{screen.subtitle}</p>}
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
            {screen.items.map((item, idx) => {
              const key = `${screen.id}-${idx}`;
              const isChecked = checked[key] ?? false;

              return (
                <label key={key} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setChecked((prev) => ({ ...prev, [key]: !isChecked }))}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600"
                  />
                  <span className={`text-sm ${isChecked ? "text-slate-400 line-through" : "text-slate-700"}`}>
                    {item}
                  </span>
                </label>
              );
            })}
            <div className="pt-2">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Checklist progress: {checklistProgress}%
              </p>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "video": {
      return (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{screen.title}</h2>
            {screen.subtitle && <p className="mt-1 text-sm text-slate-600">{screen.subtitle}</p>}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
            <video controls className="aspect-video w-full" src={screen.videoUrl}>
              Ваш браузер не поддерживает видео.
            </video>
          </div>

          <button
            type="button"
            onClick={() => setShowCaptions((value) => !value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
          >
            {showCaptions ? "Скрыть" : "Показать"} captions
          </button>

          {showCaptions && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Custom captions</p>
              <ul className="space-y-1 text-sm text-slate-700">
                {screen.captions.map((caption) => (
                  <li key={caption}>• {caption}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      );
    }

    case "quiz": {
      const isAnswered = selectedOption !== null;
      const isCorrect = selectedOption === screen.question.correctIndex;

      return (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{screen.title}</h2>
            <p className="mt-1 text-sm text-slate-700">{screen.question.question}</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
            {screen.question.options.map((option, idx) => {
              const picked = selectedOption === idx;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    picked
                      ? "border-cyan-500 bg-cyan-50 text-cyan-900"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                isCorrect
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-rose-300 bg-rose-50 text-rose-800"
              }`}
            >
              <p className="font-semibold">{isCorrect ? "Верно" : "Почти"}</p>
              <p className="mt-1">{screen.question.explanation}</p>
            </div>
          )}
        </section>
      );
    }

    case "protocol": {
      return (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{screen.title}</h2>
            {screen.subtitle && <p className="mt-1 text-sm text-slate-600">{screen.subtitle}</p>}
          </div>

          <div className="space-y-2">
            {screen.steps.map((step, idx) => {
              const expanded = expandedProtocolStep === idx;
              return (
                <article key={step.title} className="rounded-2xl border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setExpandedProtocolStep(expanded ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                  >
                    <span className="font-semibold text-slate-800">{idx + 1}. {step.title}</span>
                    <span className="text-xs text-slate-500">{expanded ? "Hide" : "Expand"}</span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden px-4 pb-3 text-sm text-slate-600">{step.details}</div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}
