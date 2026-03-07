import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export function PaywallOverlay({ lessonTitle }: { lessonTitle: string }) {
  const { isAuthenticated } = useAuth();
  const ctaHref = isAuthenticated ? "/premium" : "/auth";
  const ctaLabel = isAuthenticated ? "Перейти к оплате" : "Зарегистрироваться";

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-slate-900/35 p-4">
      <div className="max-w-md rounded-2xl border border-white/30 bg-white/95 p-6 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Lock size={22} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Upgrade to Premium</h3>
        <p className="mt-2 text-sm text-slate-600">
          Урок <span className="font-semibold">{lessonTitle}</span> доступен только в премиум-подписке.
        </p>
        {!isAuthenticated && (
          <p className="mt-1 text-xs text-slate-500">Сначала регистрация, затем можно оформить Premium.</p>
        )}
        <Link
          href={ctaHref}
          className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
