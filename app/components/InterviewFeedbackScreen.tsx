"use client";

import type { InterviewConfig, QuestionResult } from "./InterviewFlow";

const IMPROVEMENT_POINTS = [
  "Pratique respostas mais objetivas, com até 1-2 minutos por pergunta.",
  "Traga exemplos reais de projetos ou experiências.",
  "Treine a linguagem corporal e o tom de voz — grave-se respondendo.",
];

const CATEGORY_DOT: Record<QuestionResult["category"], string> = {
  blank: "bg-error",
  short: "bg-error",
  medium: "bg-warning",
  long: "bg-success",
};

function scoreLabel(score: number): string {
  if (score >= 85) return "Excelente! 🌟";
  if (score >= 70) return "Muito bom!";
  if (score >= 55) return "Bom começo!";
  return "Continue praticando!";
}

function buildOverallComment({
  score,
  goodCount,
  okCount,
  badCount,
  total,
  company,
}: {
  score: number;
  goodCount: number;
  okCount: number;
  badCount: number;
  total: number;
  company?: string;
}): string {
  const companyPhrase = company ? ` para a vaga na ${company}` : "";
  const breakdown = `Foram ${goodCount} de ${total} respostas boas, ${okCount} razoáveis e ${badCount} que precisam de mais desenvolvimento.`;

  if (score >= 85) {
    return `Sua simulação${companyPhrase} teve nota ${score}/100 — um desempenho excelente. ${breakdown} Você está bem preparado(a); mantenha esse padrão de exemplos concretos e respostas completas.`;
  }
  if (score >= 70) {
    return `Sua simulação${companyPhrase} teve nota ${score}/100 — um bom resultado. ${breakdown} Reforce as respostas mais fracas com exemplos concretos e você fica ainda mais pronto(a).`;
  }
  if (score >= 55) {
    return `Sua simulação${companyPhrase} teve nota ${score}/100 — um começo razoável. ${breakdown} Foque em desenvolver mais cada resposta, com exemplos reais e evitando expressões que passam insegurança.`;
  }
  return `Sua simulação${companyPhrase} teve nota ${score}/100. ${breakdown} Vale praticar bastante antes da entrevista real: respostas muito curtas ou em branco custam pontos importantes com recrutadores.`;
}

export default function InterviewFeedbackScreen({
  config,
  results,
  score,
  onRestart,
  onLeave,
}: {
  config: InterviewConfig | null;
  results: QuestionResult[];
  score: number;
  onRestart: () => void;
  onLeave: () => void;
}) {
  const goodCount = results.filter((r) => r.category === "long").length;
  const okCount = results.filter((r) => r.category === "medium").length;
  const badCount = results.filter(
    (r) => r.category === "short" || r.category === "blank",
  ).length;
  const overallComment = buildOverallComment({
    score,
    goodCount,
    okCount,
    badCount,
    total: results.length,
    company: config?.company,
  });

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-navy">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-navy-lighter/40 blur-3xl" />

      <main className="animate-step-in relative z-10 flex-1 overflow-y-auto px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="mb-3 text-navy-muted">Simulação concluída</p>
            <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-full border-4 border-orange text-4xl font-extrabold text-orange">
              {score}
            </div>
            <p className="mb-4 text-xl font-extrabold text-foreground">
              {scoreLabel(score)}
            </p>
            <p className="text-sm leading-relaxed text-navy-muted">
              {overallComment}
            </p>
          </div>

          <div className="mb-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border-2 border-success bg-success/10 px-3 py-4 text-center">
              <p className="text-2xl font-extrabold text-success">
                {goodCount}
              </p>
              <p className="text-xs text-navy-muted">Boas</p>
            </div>
            <div className="rounded-2xl border-2 border-warning bg-warning/10 px-3 py-4 text-center">
              <p className="text-2xl font-extrabold text-warning">
                {okCount}
              </p>
              <p className="text-xs text-navy-muted">Razoáveis</p>
            </div>
            <div className="rounded-2xl border-2 border-error bg-error/10 px-3 py-4 text-center">
              <p className="text-2xl font-extrabold text-error">
                {badCount}
              </p>
              <p className="text-xs text-navy-muted">Ruins</p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-extrabold text-foreground">
              Resumo por pergunta
            </h2>
            <div className="flex flex-col gap-3">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="rounded-2xl border-2 border-navy-lighter bg-navy-light px-4 py-3"
                >
                  <p className="mb-1 flex items-start gap-2 text-sm font-semibold text-foreground">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${CATEGORY_DOT[r.category]}`}
                    />
                    <span>
                      {i + 1}. {r.question}
                    </span>
                  </p>
                  <p className="pl-4 text-xs text-navy-muted">{r.feedback}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-3 text-lg font-extrabold text-foreground">
              Pontos de melhora
            </h2>
            <ul className="flex flex-col gap-2">
              {IMPROVEMENT_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex gap-2 text-sm text-navy-muted"
                >
                  <span>💡</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onRestart}
              className="w-full rounded-2xl bg-orange px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-[0_5px_0_0_var(--color-orange-dark)] transition-all duration-100 active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-orange-dark)]"
            >
              🔄 Fazer nova simulação
            </button>
            <button
              type="button"
              onClick={onLeave}
              className="w-full text-center text-sm font-semibold text-orange transition hover:opacity-80"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
