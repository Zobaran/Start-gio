"use client";

import { useState } from "react";
import type { Mentor, MentorStatus } from "./MentoriaFlow";

const AVATAR_CLASSES: Record<Mentor["avatarColor"], string> = {
  orange: "bg-orange text-white",
  success: "bg-success text-white",
  error: "bg-error text-white",
  warning: "bg-warning text-navy",
};

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
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

function MentorCard({
  mentor,
  onSelect,
}: {
  mentor: Mentor;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-start gap-4 rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-4 text-left transition-all duration-150 hover:border-navy-muted active:scale-[0.99]"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-extrabold ${AVATAR_CLASSES[mentor.avatarColor]}`}
      >
        {initialsOf(mentor.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center justify-between gap-2">
          <p className="truncate font-semibold text-foreground">
            {mentor.name}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
              mentor.status === "Livre"
                ? "bg-success/15 text-success"
                : "bg-orange/15 text-orange"
            }`}
          >
            {mentor.status}
          </span>
        </div>
        <p className="mb-1 text-sm text-navy-muted">
          {mentor.area} · {mentor.company}
        </p>
        <p className="mb-3 text-xs text-navy-muted/80">{mentor.specialty}</p>
        <span className="inline-block rounded-xl bg-orange px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
          {mentor.status === "Agendado" ? "Ver agendamento" : "Agendar sessão"}
        </span>
      </div>
    </button>
  );
}

export default function MentorListScreen({
  mentors,
  onSelectMentor,
}: {
  mentors: Mentor[];
  onSelectMentor: (id: string) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [areaFilter, setAreaFilter] = useState("Todos");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "Todos" | MentorStatus
  >("Todos");

  const areas = ["Todos", ...Array.from(new Set(mentors.map((m) => m.area)))];
  const availabilityOptions: ("Todos" | MentorStatus)[] = [
    "Todos",
    "Livre",
    "Agendado",
  ];

  const visibleMentors = mentors.filter(
    (m) =>
      (areaFilter === "Todos" || m.area === areaFilter) &&
      (availabilityFilter === "Todos" || m.status === availabilityFilter),
  );

  return (
    <main className="animate-step-in flex-1 overflow-y-auto px-6 pb-28 pt-6">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-1 text-2xl font-extrabold text-foreground">
          Mentoria
        </h1>
        <p className="mb-6 text-navy-muted">
          Converse com profissionais que já passaram pelo que você está
          vivendo.
        </p>

        {filtersOpen && (
          <div className="animate-step-in mb-6 rounded-2xl border-2 border-navy-lighter bg-navy-light px-4 py-4">
            <p className="mb-2 text-sm font-semibold text-navy-muted">
              Área
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {areas.map((area) => (
                <OptionTag
                  key={area}
                  label={area}
                  active={areaFilter === area}
                  onClick={() => setAreaFilter(area)}
                />
              ))}
            </div>
            <p className="mb-2 text-sm font-semibold text-navy-muted">
              Disponibilidade
            </p>
            <div className="flex flex-wrap gap-2">
              {availabilityOptions.map((option) => (
                <OptionTag
                  key={option}
                  label={option}
                  active={availabilityFilter === option}
                  onClick={() => setAvailabilityFilter(option)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {visibleMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onSelect={() => onSelectMentor(mentor.id)}
            />
          ))}
          {visibleMentors.length === 0 && (
            <p className="mt-6 text-center text-navy-muted">
              Nenhum mentor encontrado com esses filtros.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          className="mt-6 w-full rounded-2xl border-2 border-orange/40 bg-orange/10 px-5 py-3 text-sm font-bold text-orange transition-all duration-150 hover:border-orange"
        >
          {filtersOpen ? "Ocultar filtros ✕" : "Encontrar mentor 🔍"}
        </button>
      </div>
    </main>
  );
}
