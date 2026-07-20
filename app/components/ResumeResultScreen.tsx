"use client";

import type { ResumeData } from "./ResumeChatScreen";

function splitList(value: string): string[] {
  return value
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugify(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "curriculo"
  );
}

function buildResumeText(data: ResumeData): string {
  return [
    data.name,
    data.bio,
    "",
    "OBJETIVO",
    data.objective,
    "",
    "FORMAÇÃO ACADÊMICA",
    data.education,
    "",
    "EXPERIÊNCIA PROFISSIONAL",
    data.experience,
    "",
    "PRINCIPAIS CONQUISTAS",
    data.achievements,
    "",
    "HABILIDADES TÉCNICAS",
    splitList(data.technicalSkills).join(", "),
    "",
    "HABILIDADES COMPORTAMENTAIS",
    splitList(data.softSkills).join(", "),
    "",
    "IDIOMAS",
    splitList(data.languages).join(", "),
  ].join("\n");
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-navy-lighter">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border-2 border-orange/40 bg-orange/10 px-3 py-1 text-xs font-semibold text-orange-dark"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function ResumeResultScreen({
  data,
  onBack,
  onRestart,
}: {
  data: ResumeData;
  onBack: () => void;
  onRestart: () => void;
}) {
  function handleDownload() {
    const blob = new Blob([buildResumeText(data)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `curriculo-${slugify(data.name)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-navy">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-navy-lighter/40 blur-3xl" />

      <header className="relative z-10 flex items-center gap-3 px-4 py-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy-muted transition hover:text-foreground"
        >
          ←
        </button>
        <h1 className="text-lg font-extrabold text-foreground">
          Seu currículo
        </h1>
      </header>

      <main className="animate-step-in relative z-10 flex-1 overflow-y-auto px-4 pb-10">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl bg-foreground px-6 py-7 text-navy shadow-xl">
            <h2 className="text-2xl font-extrabold">{data.name}</h2>
            {data.bio && (
              <p className="mb-5 text-sm leading-relaxed text-navy-lighter">
                {data.bio}
              </p>
            )}

            <Section title="Objetivo">
              <p className="text-sm leading-relaxed">{data.objective}</p>
            </Section>

            <Section title="Formação acadêmica">
              <p className="text-sm leading-relaxed">{data.education}</p>
            </Section>

            <Section title="Experiência profissional">
              <p className="text-sm leading-relaxed">{data.experience}</p>
              {data.achievements && (
                <p className="mt-2 text-sm leading-relaxed">
                  <span className="font-semibold">Conquistas: </span>
                  {data.achievements}
                </p>
              )}
            </Section>

            <Section title="Habilidades">
              <p className="mb-1 text-xs font-semibold text-navy-lighter">
                Técnicas
              </p>
              <div className="mb-3">
                <ChipList items={splitList(data.technicalSkills)} />
              </div>
              <p className="mb-1 text-xs font-semibold text-navy-lighter">
                Comportamentais
              </p>
              <ChipList items={splitList(data.softSkills)} />
            </Section>

            <Section title="Idiomas">
              <ChipList items={splitList(data.languages)} />
            </Section>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full rounded-2xl bg-orange px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-[0_5px_0_0_var(--color-orange-dark)] transition-all duration-100 active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-orange-dark)]"
            >
              Baixar currículo
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="w-full text-center text-sm font-semibold text-orange transition hover:opacity-80"
            >
              🔄 Refazer currículo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
