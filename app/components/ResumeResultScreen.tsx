"use client";

import type { ResumeData } from "./ResumeChatScreen";

function splitSkills(skills: string): string[] {
  return skills
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
    data.area,
    "",
    "FORMAÇÃO ACADÊMICA",
    data.education,
    "",
    "HABILIDADES",
    splitSkills(data.skills).join(", "),
    "",
    "SOBRE MIM",
    data.bio,
  ].join("\n");
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
            <p className="mb-5 font-semibold text-orange-dark">{data.area}</p>

            <div className="mb-5">
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-navy-lighter">
                Formação acadêmica
              </h3>
              <p className="text-sm leading-relaxed">{data.education}</p>
            </div>

            <div className="mb-5">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy-lighter">
                Habilidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {splitSkills(data.skills).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border-2 border-orange/40 bg-orange/10 px-3 py-1 text-xs font-semibold text-orange-dark"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-navy-lighter">
                Sobre mim
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {data.bio}
              </p>
            </div>
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
