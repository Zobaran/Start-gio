"use client";

import { useState } from "react";

type Category = "Marketing" | "Tecnologia" | "Finanças" | "Direito" | "Comunicação";
type Modality = "Presencial" | "Híbrido" | "Remoto";

interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  modality: Modality;
  salary: string;
  category: Category;
  minScore: number;
  description: string;
}

const CATEGORIES: Category[] = [
  "Marketing",
  "Tecnologia",
  "Finanças",
  "Direito",
  "Comunicação",
];

const JOBS: Job[] = [
  {
    id: "itau-financas",
    company: "Itaú",
    title: "Estágio em Finanças Corporativas",
    location: "São Paulo, SP",
    modality: "Híbrido",
    salary: "R$ 2.200/mês",
    category: "Finanças",
    minScore: 65,
    description:
      "Você vai apoiar a área de finanças corporativas com análises de fluxo de caixa, relatórios financeiros e projeções de orçamento, acompanhando de perto analistas seniores.",
  },
  {
    id: "shopee-marketing",
    company: "Shopee",
    title: "Estágio em Marketing Digital",
    location: "São Paulo, SP",
    modality: "Remoto",
    salary: "R$ 1.800/mês",
    category: "Marketing",
    minScore: 40,
    description:
      "Apoio na criação e otimização de campanhas digitais, análise de métricas de performance e acompanhamento de redes sociais. Ideal para quem está começando na área.",
  },
  {
    id: "boticario-comunicacao",
    company: "Grupo Boticário",
    title: "Estágio em Comunicação e Branding",
    location: "Rio de Janeiro, RJ",
    modality: "Presencial",
    salary: "R$ 1.700/mês",
    category: "Comunicação",
    minScore: 35,
    description:
      "Apoio na produção de conteúdo institucional, releases e materiais de marca, em contato direto com a equipe de comunicação e agências parceiras.",
  },
  {
    id: "magalu-tecnologia",
    company: "Magazine Luiza",
    title: "Estágio em Tecnologia",
    location: "Franca, SP",
    modality: "Remoto",
    salary: "R$ 2.000/mês",
    category: "Tecnologia",
    minScore: 60,
    description:
      "Participação no desenvolvimento de features para o e-commerce, com times ágeis usando Python e ferramentas de análise de dados no dia a dia.",
  },
  {
    id: "nubank-juridico",
    company: "Nubank",
    title: "Estágio Jurídico / Compliance",
    location: "São Paulo, SP",
    modality: "Híbrido",
    salary: "R$ 2.500/mês",
    category: "Direito",
    minScore: 75,
    description:
      "Apoio à área jurídica em temas de compliance regulatório, contratos e acompanhamento de processos, em um dos maiores fintechs da América Latina.",
  },
];

function OptionTag({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
        active
          ? "border-orange bg-orange text-white"
          : "border-navy-lighter bg-navy-light text-navy-muted hover:border-navy-muted"
      }`}
    >
      {label}
    </button>
  );
}

function JobCard({
  job,
  userOverallScore,
  applied,
  expanded,
  onToggleExpanded,
  onApply,
  onContinueEvoluindo,
}: {
  job: Job;
  userOverallScore: number;
  applied: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  onApply: () => void;
  onContinueEvoluindo: () => void;
}) {
  const belowProfile = userOverallScore < job.minScore;

  return (
    <div className="rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-4">
      <p className="text-sm font-semibold text-navy-muted">{job.company}</p>
      <h3 className="mb-2 text-lg font-extrabold text-foreground">
        {job.title}
      </h3>

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full border-2 border-navy-lighter px-3 py-1 text-xs font-semibold text-navy-muted">
          📍 {job.location}
        </span>
        <span className="rounded-full border-2 border-navy-lighter px-3 py-1 text-xs font-semibold text-navy-muted">
          {job.modality}
        </span>
      </div>

      <p className="mb-4 font-extrabold text-success">{job.salary}</p>

      {expanded && (
        <p className="animate-step-in mb-4 text-sm leading-relaxed text-navy-muted">
          {job.description}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex-1 rounded-2xl bg-orange px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white transition-all duration-150 active:scale-[0.98]"
        >
          {expanded ? "Ver menos" : "Ver vaga"}
        </button>
        {expanded && (
          <button
            type="button"
            onClick={onApply}
            disabled={applied}
            className="flex-1 rounded-2xl border-2 border-success bg-success/10 px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-success transition-all duration-150 disabled:opacity-60"
          >
            {applied ? "Aplicado ✓" : "Aplicar agora"}
          </button>
        )}
      </div>

      {belowProfile && !applied && (
        <div className="mt-4 rounded-2xl border-2 border-warning/40 bg-warning/10 px-4 py-3">
          <p className="mb-3 text-sm text-warning">
            ⚠️ Seu perfil ainda está se preparando para essa vaga. Evolua ou
            aplique assim mesmo.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onApply}
              className="rounded-full border-2 border-warning/50 px-3 py-1.5 text-xs font-bold text-warning transition hover:border-warning"
            >
              Aplicar mesmo assim
            </button>
            <button
              type="button"
              onClick={onContinueEvoluindo}
              className="rounded-full bg-warning px-3 py-1.5 text-xs font-bold text-navy transition hover:opacity-90"
            >
              Continuar evoluindo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VagasScreen({
  userOverallScore,
  onContinueEvoluindo,
}: {
  userOverallScore: number;
  onContinueEvoluindo: () => void;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"Todos" | Category>(
    "Todos",
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const query = search.trim().toLowerCase();
  const visibleJobs = JOBS.filter((job) => {
    const matchesCategory =
      activeCategory === "Todos" || job.category === activeCategory;
    const matchesQuery =
      query === "" ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  function handleApply(jobId: string) {
    setAppliedIds((prev) => new Set(prev).add(jobId));
  }

  return (
    <main className="animate-step-in flex-1 overflow-y-auto px-6 pb-28 pt-6">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-1 text-2xl font-extrabold text-foreground">
          Vagas
        </h1>
        <p className="mb-6 text-navy-muted">
          Oportunidades de estágio combinando com o seu perfil.
        </p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Marketing Digital, SP..."
          className="mb-4 w-full rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-3 text-foreground placeholder:text-navy-muted outline-none transition-colors duration-150 focus:border-orange"
        />

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          <OptionTag
            label="Todos"
            active={activeCategory === "Todos"}
            onClick={() => setActiveCategory("Todos")}
          />
          {CATEGORIES.map((category) => (
            <OptionTag
              key={category}
              label={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {visibleJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              userOverallScore={userOverallScore}
              applied={appliedIds.has(job.id)}
              expanded={expandedId === job.id}
              onToggleExpanded={() =>
                setExpandedId((current) =>
                  current === job.id ? null : job.id,
                )
              }
              onApply={() => handleApply(job.id)}
              onContinueEvoluindo={onContinueEvoluindo}
            />
          ))}
          {visibleJobs.length === 0 && (
            <p className="mt-6 text-center text-navy-muted">
              Nenhuma vaga encontrada com esses filtros.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
