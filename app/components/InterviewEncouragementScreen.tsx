"use client";

import type { InterviewConfig } from "./InterviewFlow";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-sm text-navy-muted">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

export default function InterviewEncouragementScreen({
  config,
  onBack,
  onReady,
}: {
  config: InterviewConfig;
  onBack: () => void;
  onReady: () => void;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-navy-deep px-6 py-6 text-center">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange/10 blur-3xl" />

      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="relative z-10 mb-4 mr-auto flex h-9 w-9 items-center justify-center rounded-full text-navy-muted transition hover:text-white"
      >
        ←
      </button>

      <div className="animate-step-in relative z-10 flex flex-1 flex-col items-center justify-center">
        <div className="animate-pop-in mb-6 text-7xl">😌</div>
        <h1 className="mb-8 max-w-xs text-2xl font-extrabold text-white">
          É só um treinamento. Aqui não existe errar.
        </h1>

        <div className="mb-10 w-full max-w-sm rounded-2xl border-2 border-white/10 bg-white/5 px-5 py-4">
          <SummaryRow label="Empresa" value={config.company} />
          <SummaryRow label="Vaga" value={config.role} />
          <SummaryRow label="Entrevistador" value={config.interviewer} />
          <SummaryRow label="Dificuldade" value={config.difficulty} />
          <SummaryRow label="Duração" value={`${config.duration} min`} />
        </div>

        <button
          type="button"
          onClick={onReady}
          className="w-full max-w-sm rounded-2xl bg-orange px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-[0_5px_0_0_var(--color-orange-dark)] transition-all duration-100 active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-orange-dark)]"
        >
          Estou pronto! Começar 💪
        </button>
      </div>
    </div>
  );
}
