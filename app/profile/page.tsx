import Link from "next/link";
import {
  BarChart3,
  Bell,
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
  Sparkles,
  Star,
  Timer,
  Trophy,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-6 py-3 md:px-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-blue-700" size={24} />
            <h2 className="text-lg font-bold tracking-tight">AutismSkillForge Academy</h2>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 md:flex">
              <Link href="/" className="text-sm font-medium text-slate-700 hover:text-blue-700">Курсы</Link>
              <p className="text-sm font-medium text-slate-500">Прогресс</p>
              <p className="text-sm font-medium text-slate-500">Библиотека</p>
            </nav>

            <button className="rounded-lg bg-slate-100 p-2 text-slate-700">
              <Bell size={18} />
            </button>

            <div className="h-10 w-10 rounded-full border-2 border-blue-200 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuC1UIc9Vc7Ar3TXOgAYAbj436jFnDXd6lHCZU0REOBIpwgt0m-TQ0t70wwhLKv4k97xQtU9UvNn6Kz_fY8fzTrhzbihsGM9qsRFoAsfB3XLBnoOhyAT0aQ2oh7FjUdVrWaVancS3IX8TMglhjqu6rkwX4UwbaU4xdZaA9QTPjVPp_iqMBvBXcwQdnAAfEQHETRLf7wNhefROX9lq7ZlxaAeruZoT-6odV8zDc9qo4eUgPwBvm7hPSQoSbxA0rXA7Ndve4ONdZVkSDGB')] bg-cover bg-center" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <section className="mb-8 flex flex-col gap-8 rounded-xl border border-slate-100 bg-white p-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
            <div className="h-32 w-32 rounded-full bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuAaQRkXzeyjlakjQwwd4RoCBUKoWo5WWV9lS9JFkhzD3zRWlrSzEuEQjHG7X4Aq8uDZ0sDzT05fxIS8Ck2Gu9veDn6BM1Rb4KkB3_cq9qHDKokTAa10L5I-eq3-QMaroTW86tq9F6P39OidB6LF-VQta_YE2jpa1QnPBRb9Evu2ntmE4Q4cBv0kOs1ZBPUu8dM6J_I8bmC89fsUviNrl2mMN1Hn9q08_n8PmNhCoQulNzr7z8rCIQ3wCZGkhv0RC4BtsyDnvl0Y44Dq')] bg-cover bg-center ring-4 ring-blue-100" />

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">Иван Иванов</h1>
              <p className="text-lg text-slate-500">ivan.ivanov@email.com</p>
              <div className="mt-3 flex justify-center gap-2 md:justify-start">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">Студент</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">Pro аккаунт</span>
              </div>
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
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700"><CheckCircle2 size={16} /> Активен</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <span className="text-slate-600">Тариф</span>
                <span className="font-bold">Профессиональный (Pro)</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <span className="text-slate-600">Следующее списание</span>
                <span className="font-bold">15 октября 2023</span>
              </div>
            </div>

            <Link href="/premium" className="mt-5 inline-flex w-full items-center justify-center rounded-lg border-2 border-blue-200 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50">
              Управление подпиской
            </Link>
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
                <span className="inline-flex items-center gap-3 text-sm font-medium"><Bell size={16} className="text-slate-400" /> Уведомления</span>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
              <button className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-slate-50">
                <span className="inline-flex items-center gap-3 text-sm font-medium"><Languages size={16} className="text-slate-400" /> Язык интерфейса</span>
                <span className="text-sm text-slate-400">Русский</span>
              </button>
              <button className="mt-2 flex w-full items-center justify-between rounded-lg p-3 text-red-600 hover:bg-red-50">
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
                  <div className="h-full w-[65%] bg-emerald-600" />
                </div>
                <span className="font-bold text-emerald-700">65%</span>
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <h3 className="mb-4 inline-flex items-center gap-2 font-bold">
                <BookOpen size={16} className="text-blue-700" /> Завершенные модули
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="inline-flex items-center gap-2 text-slate-700"><CheckCircle2 size={14} className="text-emerald-600" /> Введение в коммуникацию</li>
                <li className="inline-flex items-center gap-2 text-slate-700"><CheckCircle2 size={14} className="text-emerald-600" /> Персонажи и эмоции</li>
                <li className="inline-flex items-center gap-2 text-slate-500"><Globe size={14} className="text-slate-300" /> Социальное взаимодействие (в процессе)</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <h3 className="mb-4 inline-flex items-center gap-2 font-bold">
                <Trophy size={16} className="text-blue-700" /> Последние достижения
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                <div className="min-w-[80px] text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600"><Star size={18} /></div>
                  <p className="text-[10px] font-bold uppercase text-slate-500">Новичок</p>
                </div>
                <div className="min-w-[80px] text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600"><Timer size={18} /></div>
                  <p className="text-[10px] font-bold uppercase text-slate-500">3 дня в ряд</p>
                </div>
                <div className="min-w-[80px] text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-100 text-emerald-600"><Sparkles size={18} /></div>
                  <p className="text-[10px] font-bold uppercase text-slate-500">Модуль 1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h3 className="mb-4 font-bold">Мои сертификаты</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-center">
                  <BookOpen size={34} className="mb-2 text-slate-300" />
                  <p className="mb-1 text-xs font-bold uppercase tracking-tight text-slate-500">Основы Forge</p>
                  <p className="text-[10px] text-slate-400">Сентябрь 2023</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-blue-700/90 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded bg-white px-4 py-2 text-sm font-bold text-blue-700">Скачать PDF</button>
                </div>
              </div>

              <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-slate-400">
                <Lock size={28} className="mb-1" />
                <span className="text-xs font-medium">Модуль 2 не завершен</span>
              </div>
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
          <p className="text-xs text-slate-400">© 2023 Все права защищены</p>
        </div>
      </footer>
    </div>
  );
}
