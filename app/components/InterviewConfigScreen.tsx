"use client";

import { useState } from "react";
import type {
  Difficulty,
  DurationMinutes,
  InterviewConfig,
  Interviewer,
} from "./InterviewFlow";

const INTERVIEWERS: Interviewer[] = ["Gestor", "RH", "Banca"];
const DIFFICULTIES: Difficulty[] = ["Iniciante", "Médio", "Avançado"];
const DURATIONS: DurationMinutes[] = [5, 10, 15];

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-left">
      <span className="text-sm font-semibold text-navy-muted">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-4 text-foreground placeholder:text-navy-muted/70 outline-none transition-colors duration-150 focus:border-orange"
      />
    </label>
  );
}

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
      className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all duration-150 ${
        active
          ? "border-orange bg-orange text-white"
          : "border-navy-lighter bg-navy-light text-navy-muted hover:border-navy-muted"
      }`}
    >
      {label}
    </button>
  );
}

export default function InterviewConfigScreen({
  initialConfig,
  onLeave,
  onStart,
}: {
  initialConfig: InterviewConfig | null;
  onLeave: () => void;
  onStart: (config: InterviewConfig) => void;
}) {
  const [company, setCompany] = useState(initialConfig?.company ?? "");
  const [role, setRole] = useState(initialConfig?.role ?? "");
  const [interviewer, setInterviewer] = useState<Interviewer>(
    initialConfig?.interviewer ?? "Gestor",
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialConfig?.difficulty ?? "Médio",
  );
  const [duration, setDuration] = useState<DurationMinutes>(
    initialConfig?.duration ?? 10,
  );

  const canStart = company.trim() !== "" && role.trim() !== "";

  function handleStart() {
    if (!canStart) return;
    onStart({
      company: company.trim(),
      role: role.trim(),
      interviewer,
      difficulty,
      duration,
    });
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-navy">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-navy-lighter/40 blur-3xl" />

      <main className="animate-step-in relative z-10 flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={onLeave}
            aria-label="Voltar"
            className="mb-4 flex h-9 w-9 items-center justify-center rounded-full text-navy-muted transition hover:text-foreground"
          >
            ←
          </button>

          <h1 className="mb-1 text-2xl font-extrabold text-foreground">
            Simulador de Entrevista
          </h1>
          <p className="mb-8 text-navy-muted">
            Configure sua simulação antes de começar.
          </p>

          <div className="flex flex-col gap-5">
            <TextField
              label="Empresa"
              value={company}
              onChange={setCompany}
              placeholder="Ex: Google, Nubank..."
            />
            <TextField
              label="Vaga"
              value={role}
              onChange={setRole}
              placeholder="Ex: Estágio em Marketing"
            />

            <div>
              <p className="mb-2 text-sm font-semibold text-navy-muted">
                Quem vai te entrevistar?
              </p>
              <div className="flex flex-wrap gap-2">
                {INTERVIEWERS.map((option) => (
                  <OptionTag
                    key={option}
                    label={option}
                    active={interviewer === option}
                    onClick={() => setInterviewer(option)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-navy-muted">
                Nível de dificuldade
              </p>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map((option) => (
                  <OptionTag
                    key={option}
                    label={option}
                    active={difficulty === option}
                    onClick={() => setDifficulty(option)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-navy-muted">
                Duração
              </p>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((option) => (
                  <OptionTag
                    key={option}
                    label={`${option} min`}
                    active={duration === option}
                    onClick={() => setDuration(option)}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={!canStart}
            onClick={handleStart}
            className="mt-10 w-full rounded-2xl bg-orange px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-[0_5px_0_0_var(--color-orange-dark)] transition-all duration-100 active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-orange-dark)] disabled:cursor-not-allowed disabled:bg-navy-light disabled:text-navy-muted disabled:shadow-none"
          >
            Começar simulação →
          </button>
        </div>
      </main>
    </div>
  );
}
