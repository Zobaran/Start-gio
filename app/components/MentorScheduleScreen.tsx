"use client";

import { useState } from "react";
import type { Mentor } from "./MentoriaFlow";

const AVATAR_CLASSES: Record<Mentor["avatarColor"], string> = {
  orange: "bg-orange text-white",
  success: "bg-success text-white",
  error: "bg-error text-white",
  warning: "bg-warning text-navy",
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function nextDays(count: number): Date[] {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });
}

function isSlotTaken(dayIndex: number, slotIndex: number): boolean {
  return (dayIndex * 3 + slotIndex * 2) % 5 === 0;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export default function MentorScheduleScreen({
  mentor,
  onBack,
  onConfirmed,
}: {
  mentor: Mentor;
  onBack: () => void;
  onConfirmed: () => void;
}) {
  const [days] = useState<Date[]>(() => nextDays(7));
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const selectedDay = days[selectedDayIndex];

  function handleSelectDay(index: number) {
    setSelectedDayIndex(index);
    setSelectedTime(null);
  }

  function handleConfirm() {
    if (!selectedTime) return;
    setConfirmed(true);
  }

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

        {confirmed ? (
          <div className="flex flex-col items-center pt-10 text-center">
            <div className="animate-pop-in mb-6 text-6xl">✅</div>
            <h2 className="mb-2 text-2xl font-extrabold text-foreground">
              Sessão agendada!
            </h2>
            <p className="mb-8 text-navy-muted">
              Você vai conversar com {mentor.name} em {formatDate(selectedDay)}{" "}
              às {selectedTime}.
            </p>
            <button
              type="button"
              onClick={onConfirmed}
              className="w-full rounded-2xl bg-orange px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-[0_5px_0_0_var(--color-orange-dark)] transition-all duration-100 active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-orange-dark)]"
            >
              Voltar para mentores
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-extrabold ${AVATAR_CLASSES[mentor.avatarColor]}`}
              >
                {initialsOf(mentor.name)}
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-foreground">
                  {mentor.name}
                </p>
                <p className="text-sm text-navy-muted">
                  {mentor.area} · {mentor.company}
                </p>
              </div>
            </div>
            <p className="mb-8 text-sm text-navy-muted">{mentor.specialty}</p>

            <h2 className="mb-3 text-lg font-extrabold text-foreground">
              Escolha uma data
            </h2>
            <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
              {days.map((date, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectDay(i)}
                  className={`flex shrink-0 flex-col items-center rounded-2xl border-2 px-4 py-2 transition-all duration-150 ${
                    selectedDayIndex === i
                      ? "border-orange bg-orange text-white"
                      : "border-navy-lighter bg-navy-light text-navy-muted hover:border-navy-muted"
                  }`}
                >
                  <span className="text-xs font-semibold uppercase">
                    {WEEKDAYS[date.getDay()]}
                  </span>
                  <span className="text-lg font-extrabold">
                    {date.getDate()}
                  </span>
                </button>
              ))}
            </div>

            <h2 className="mb-3 text-lg font-extrabold text-foreground">
              Horários disponíveis
            </h2>
            <div className="mb-10 grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot, i) => {
                const taken = isSlotTaken(selectedDayIndex, i);
                const active = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={taken}
                    onClick={() => setSelectedTime(slot)}
                    className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all duration-150 ${
                      taken
                        ? "cursor-not-allowed border-navy-lighter bg-navy-light text-navy-muted opacity-40"
                        : active
                          ? "border-orange bg-orange text-white"
                          : "border-navy-lighter bg-navy-light text-foreground hover:border-navy-muted"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!selectedTime}
              onClick={handleConfirm}
              className="w-full rounded-2xl bg-orange px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-[0_5px_0_0_var(--color-orange-dark)] transition-all duration-100 active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-orange-dark)] disabled:cursor-not-allowed disabled:bg-navy-light disabled:text-navy-muted disabled:shadow-none"
            >
              Confirmar agendamento
            </button>
          </>
        )}
      </div>
    </main>
  );
}
