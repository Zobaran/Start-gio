"use client";

import type { Job } from "./VagasScreen";

export default function JobDetailScreen({
  job,
  userOverallScore,
  applied,
  onBack,
  onToggleApply,
  onContinueEvoluindo,
}: {
  job: Job;
  userOverallScore: number;
  applied: boolean;
  onBack: () => void;
  onToggleApply: () => void;
  onContinueEvoluindo: () => void;
}) {
  const belowProfile = userOverallScore < job.minScore;

  return (
    <main className="animate-step-in flex-1 overflow-y-auto px-6 pb-28 pt-6">
      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-full text-navy-muted transition hover:text-foreground"
        >
          ←
        </button>

        <p className="text-sm font-semibold text-navy-muted">{job.company}</p>
        <h1 className="mb-2 text-2xl font-extrabold text-foreground">
          {job.title}
        </h1>
        {applied && (
          <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">
            Candidatura enviada ✓
          </span>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full border-2 border-navy-lighter px-3 py-1 text-xs font-semibold text-navy-muted">
            📍 {job.location}
          </span>
          <span className="rounded-full border-2 border-navy-lighter px-3 py-1 text-xs font-semibold text-navy-muted">
            {job.modality}
          </span>
          <span className="rounded-full border-2 border-navy-lighter px-3 py-1 text-xs font-semibold text-navy-muted">
            {job.category}
          </span>
        </div>

        <p className="mb-6 text-xl font-extrabold text-success">
          {job.salary}
        </p>

        <section className="mb-6">
          <h2 className="mb-2 text-lg font-extrabold text-foreground">
            Descrição da vaga
          </h2>
          <p className="text-sm leading-relaxed text-navy-muted">
            {job.description}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-lg font-extrabold text-foreground">
            Requisitos
          </h2>
          <ul className="flex flex-col gap-1.5">
            {job.requirements.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm text-navy-muted"
              >
                <span className="text-orange">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-extrabold text-foreground">
            Benefícios
          </h2>
          <ul className="flex flex-col gap-1.5">
            {job.benefits.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm text-navy-muted"
              >
                <span className="text-success">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {belowProfile && !applied && (
          <div className="mb-6 rounded-2xl border-2 border-warning/40 bg-warning/10 px-4 py-3">
            <p className="text-sm text-warning">
              ⚠️ Seu perfil ainda está se preparando para essa vaga. Evolua ou
              aplique assim mesmo.
            </p>
            <button
              type="button"
              onClick={onContinueEvoluindo}
              className="mt-3 rounded-full bg-warning px-3 py-1.5 text-xs font-bold text-navy transition hover:opacity-90"
            >
              Continuar evoluindo
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleApply}
          className={`w-full rounded-2xl px-6 py-4 text-lg font-extrabold uppercase tracking-wide transition-all duration-100 active:translate-y-[3px] ${
            applied
              ? "bg-navy-light text-error shadow-[0_5px_0_0_var(--color-navy-lighter)] active:shadow-[0_2px_0_0_var(--color-navy-lighter)]"
              : "bg-orange text-white shadow-[0_5px_0_0_var(--color-orange-dark)] active:shadow-[0_2px_0_0_var(--color-orange-dark)]"
          }`}
        >
          {applied ? "Cancelar candidatura" : "Candidatar-me"}
        </button>
      </div>
    </main>
  );
}
