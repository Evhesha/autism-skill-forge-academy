export type LessonProgressRecord = {
  lessonSlug: string;
  currentStep: number;
  isCompleted: boolean;
  lastAccessed?: string;
};

type BackendProgressItem = {
  currentStep?: number;
  isCompleted?: boolean;
  lastAccessed?: string;
  lesson?: {
    slug?: string;
  };
  Lesson?: {
    slug?: string;
  };
};

function toProgressRecord(item: BackendProgressItem): LessonProgressRecord | null {
  const lessonSlug = item.lesson?.slug ?? item.Lesson?.slug;
  if (!lessonSlug) {
    return null;
  }

  return {
    lessonSlug,
    currentStep: Math.max(0, Number(item.currentStep ?? 0)),
    isCompleted: Boolean(item.isCompleted),
    lastAccessed: item.lastAccessed,
  };
}

export async function fetchAllLessonProgress(): Promise<Record<string, LessonProgressRecord>> {
  const response = await fetch("/api/lessons/progress", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      return {};
    }
    throw new Error("Не удалось загрузить прогресс по урокам");
  }

  const payload = (await response.json()) as BackendProgressItem[];
  return payload.reduce<Record<string, LessonProgressRecord>>((acc, item) => {
    const mapped = toProgressRecord(item);
    if (mapped) {
      acc[mapped.lessonSlug] = mapped;
    }
    return acc;
  }, {});
}

export async function fetchLessonProgress(slug: string): Promise<LessonProgressRecord | null> {
  const response = await fetch(`/api/lessons/${slug}/progress`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      return null;
    }
    throw new Error("Не удалось загрузить прогресс урока");
  }

  const payload = (await response.json()) as {
    progress?: {
      currentStep?: number;
      isCompleted?: boolean;
      lastAccessed?: string;
    };
  };

  return {
    lessonSlug: slug,
    currentStep: Math.max(0, Number(payload.progress?.currentStep ?? 0)),
    isCompleted: Boolean(payload.progress?.isCompleted),
    lastAccessed: payload.progress?.lastAccessed,
  };
}

export async function saveLessonProgress(slug: string, currentStep: number, totalSteps: number) {
  const safeTotalSteps = Math.max(1, totalSteps);
  const safeStep = Math.max(1, Math.min(safeTotalSteps, currentStep));

  const response = await fetch(`/api/lessons/${slug}/progress`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      currentStep: safeStep,
      isCompleted: safeStep >= safeTotalSteps,
    }),
  });

  if (!response.ok) {
    throw new Error("Не удалось сохранить прогресс урока");
  }
}

export function progressToPercent(currentStep: number, isCompleted: boolean, totalSteps: number) {
  const safeTotalSteps = Math.max(1, totalSteps);
  if (isCompleted) return 100;
  if (currentStep <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((currentStep / safeTotalSteps) * 100)));
}
