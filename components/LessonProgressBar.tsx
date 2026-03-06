import { Check } from "lucide-react";

type LessonProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export function LessonProgressBar({
  currentStep,
  totalSteps,
}: LessonProgressBarProps) {
  return (
    <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">Module Progress</p>
        <p className="text-sm font-bold text-slate-950">
          {currentStep}/{totalSteps}
        </p>
      </div>

      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className={`flex h-8 items-center justify-center rounded-lg border text-xs font-bold ${
                isDone
                  ? "border-emerald-700 bg-emerald-600 text-white"
                  : isCurrent
                    ? "border-blue-900 bg-blue-700 text-white"
                    : "border-slate-300 bg-slate-100 text-slate-700"
              }`}
              aria-label={`Step ${stepNumber}`}
            >
              {isDone ? <Check size={14} aria-hidden="true" /> : stepNumber}
            </div>
          );
        })}
      </div>
    </div>
  );
}
