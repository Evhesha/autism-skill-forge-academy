"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Crown,
  Lock,
  Rocket,
  ShieldCheck,
  X,
} from "lucide-react";

type FlowStep = "locked" | "payment" | "success";

type CardData = {
  number: string;
  expiry: string;
  cvc: string;
  zip: string;
};

const initialCard: CardData = {
  number: "",
  expiry: "",
  cvc: "",
  zip: "",
};

export function PremiumAccessFlow() {
  const [step, setStep] = useState<FlowStep>("locked");
  const [card, setCard] = useState<CardData>(initialCard);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return (
      card.number.trim().length >= 16 &&
      card.expiry.trim().length >= 4 &&
      card.cvc.trim().length >= 3
    );
  }, [card]);

  const pay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!isValid) {
      setError("Проверьте номер карты, срок действия и CVC.");
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setLoading(false);
    setStep("success");
  };

  return (
    <section className="relative mx-auto min-h-[calc(100vh-5rem)] w-full max-w-6xl overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto mt-10 w-full max-w-4xl space-y-6">
          <div className="h-8 w-64 rounded-lg bg-slate-200" />
          <div className="aspect-video rounded-xl bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-200" />
            <div className="h-4 w-5/6 rounded bg-slate-200" />
            <div className="h-4 w-2/3 rounded bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-10 bg-white/30 backdrop-blur-sm" />

      <div className="relative z-20 mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
        {step === "locked" && (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Lock size={30} />
            </div>
            <h1 className="mb-3 text-2xl font-extrabold text-slate-900">
              Этот контент доступен по Premium подписке
            </h1>
            <p className="mb-6 text-sm leading-6 text-slate-600">
              Получите полный доступ к урокам, протоколам и трекингу прогресса.
            </p>

            <div className="mb-6 grid gap-2 text-left text-sm text-slate-700">
              <p className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-700" /> Все модули без ограничений</p>
              <p className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-700" /> Подробные протоколы обучения</p>
              <p className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-700" /> Расширенная аналитика прогресса</p>
            </div>

            <button
              type="button"
              onClick={() => setStep("payment")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Rocket size={16} /> Оформить подписку
            </button>
          </div>
        )}

        {step === "payment" && (
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Оплата подписки</h2>
              <button
                type="button"
                onClick={() => setStep("locked")}
                className="text-slate-500 hover:text-slate-800"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm font-semibold text-slate-900">Premium: 29 BYN / месяц</p>
              <p className="mt-1 text-xs text-slate-600">Отмена в любое время.</p>
            </div>

            <form className="space-y-4" onSubmit={pay}>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Номер карты</span>
                <input
                  value={card.number}
                  onChange={(event) => setCard((prev) => ({ ...prev, number: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-700/20 focus:border-blue-500 focus:ring"
                  placeholder="0000 0000 0000 0000"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Срок действия</span>
                  <input
                    value={card.expiry}
                    onChange={(event) => setCard((prev) => ({ ...prev, expiry: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-700/20 focus:border-blue-500 focus:ring"
                    placeholder="MM/YY"
                  />
                </label>

                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">CVC</span>
                  <input
                    value={card.cvc}
                    onChange={(event) => setCard((prev) => ({ ...prev, cvc: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-700/20 focus:border-blue-500 focus:ring"
                    placeholder="123"
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Индекс (опционально)</span>
                <input
                  value={card.zip}
                  onChange={(event) => setCard((prev) => ({ ...prev, zip: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-700/20 focus:border-blue-500 focus:ring"
                  placeholder="220000"
                />
              </label>

              {error && <p className="text-sm text-rose-700">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400"
              >
                {loading ? "Обработка..." : "Оплатить"}
              </button>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <ShieldCheck size={30} />
            </div>
            <h2 className="mb-2 text-2xl font-extrabold text-slate-900">Оплата прошла успешно</h2>
            <p className="mb-6 text-sm text-slate-600">
              Подписка Premium активирована. Контент разблокирован.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setStep("locked")}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Закрыть
              </button>
              <button
                type="button"
                onClick={() => {
                  setCard(initialCard);
                  setStep("payment");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                <Crown size={16} /> Управление подпиской
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
