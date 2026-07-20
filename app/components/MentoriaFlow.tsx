"use client";

import { useState } from "react";
import MentorListScreen from "./MentorListScreen";
import MentorScheduleScreen from "./MentorScheduleScreen";

export type MentorStatus = "Livre" | "Agendado";

export interface Mentor {
  id: string;
  name: string;
  area: string;
  company: string;
  specialty: string;
  status: MentorStatus;
  avatarColor: "orange" | "success" | "error" | "warning";
}

const INITIAL_MENTORS: Mentor[] = [
  {
    id: "ana-ribeiro",
    name: "Ana Ribeiro",
    area: "Marketing",
    company: "Nubank",
    specialty: "Currículos e estratégias de marketing digital",
    status: "Livre",
    avatarColor: "orange",
  },
  {
    id: "carlos-silva",
    name: "Carlos Silva",
    area: "Tecnologia",
    company: "iFood",
    specialty: "Carreira em programação e entrevistas técnicas",
    status: "Agendado",
    avatarColor: "success",
  },
  {
    id: "beatriz-souza",
    name: "Beatriz Souza",
    area: "Recursos Humanos",
    company: "Ambev",
    specialty: "Recrutamento e desenvolvimento de carreira",
    status: "Livre",
    avatarColor: "error",
  },
  {
    id: "rafael-costa",
    name: "Rafael Costa",
    area: "Dados",
    company: "Itaú",
    specialty: "Python, Excel e análise de dados para iniciantes",
    status: "Livre",
    avatarColor: "warning",
  },
  {
    id: "juliana-alves",
    name: "Juliana Alves",
    area: "Design",
    company: "Magalu",
    specialty: "Portfólio e transição de carreira para UX",
    status: "Agendado",
    avatarColor: "orange",
  },
  {
    id: "pedro-martins",
    name: "Pedro Martins",
    area: "Finanças",
    company: "XP Investimentos",
    specialty: "Planejamento financeiro e carreira em finanças",
    status: "Livre",
    avatarColor: "success",
  },
];

type Stage = "list" | "schedule";

export default function MentoriaFlow() {
  const [mentors, setMentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [stage, setStage] = useState<Stage>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMentor = mentors.find((m) => m.id === selectedId) ?? null;

  if (stage === "schedule" && selectedMentor) {
    return (
      <MentorScheduleScreen
        mentor={selectedMentor}
        onBack={() => setStage("list")}
        onConfirmed={() => {
          setMentors((prev) =>
            prev.map((m) =>
              m.id === selectedMentor.id ? { ...m, status: "Agendado" } : m,
            ),
          );
          setStage("list");
        }}
      />
    );
  }

  return (
    <MentorListScreen
      mentors={mentors}
      onSelectMentor={(id) => {
        setSelectedId(id);
        setStage("schedule");
      }}
      onCancelMentor={(id) => {
        setMentors((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: "Livre" } : m)),
        );
      }}
    />
  );
}
