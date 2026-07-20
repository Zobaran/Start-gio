"use client";

import { useState } from "react";
import ResumeChatScreen, {
  type ResumeData,
} from "./ResumeChatScreen";
import ResumeResultScreen from "./ResumeResultScreen";
import InterviewFlow from "./InterviewFlow";
import MentoriaFlow from "./MentoriaFlow";
import VagasScreen from "./VagasScreen";
import ProfileScreen from "./ProfileScreen";
import SettingsScreen from "./SettingsScreen";

type Category = "Todos" | "Inglês" | "Excel" | "Python";
type TabId = "cursos" | "entrevista" | "mentoria" | "vagas" | "perfil";

interface Course {
  id: string;
  category: Category;
  icon: string;
  title: string;
  subtitle: string;
  progress?: number;
}

const CATEGORIES: Category[] = ["Todos", "Inglês", "Excel", "Python"];

const STREAK_DAYS = 7;

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: "cursos", icon: "📚", label: "Cursos" },
  { id: "entrevista", icon: "🎤", label: "Entrevista" },
  { id: "mentoria", icon: "🤝", label: "Mentoria" },
  { id: "vagas", icon: "💼", label: "Vagas" },
  { id: "perfil", icon: "👤", label: "Perfil" },
];

const IN_PROGRESS_COURSES: Course[] = [
  {
    id: "ingles-mercado",
    category: "Inglês",
    icon: "🇺🇸",
    title: "Inglês para o mercado de trabalho",
    subtitle: "Módulo 3 de 8 · Nível intermediário",
    progress: 35,
  },
];

const AVAILABLE_COURSES: Course[] = [
  {
    id: "excel-avancado",
    category: "Excel",
    icon: "📊",
    title: "Excel Avançado",
    subtitle: "6 módulos · Com certificado",
  },
  {
    id: "python-iniciantes",
    category: "Python",
    icon: "🐍",
    title: "Python para Iniciantes",
    subtitle: "8 módulos · Do zero ao 1º projeto",
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function CategoryTag({
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

function CourseCard({ course }: { course: Course }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-4 text-left transition-all duration-150 hover:border-navy-muted active:scale-[0.99]"
    >
      <span className="text-3xl">{course.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">
          {course.title}
        </p>
        <p className="mb-2 text-sm text-navy-muted">{course.subtitle}</p>
        {course.progress !== undefined ? (
          <div className="h-2 w-full overflow-hidden rounded-full bg-navy-lighter">
            <div
              className="h-full rounded-full bg-orange transition-all duration-500 ease-out"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        ) : null}
      </div>
      {course.progress === undefined && (
        <span className="shrink-0 rounded-full bg-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange">
          Começar
        </span>
      )}
    </button>
  );
}

type ProfileFlow = "menu" | "chat" | "result" | "settings";

interface InterviewStats {
  count: number;
  totalScore: number;
}

function computeOverallScore({
  hasResume,
  streakDays,
  interviewCount,
  avgInterviewScore,
}: {
  hasResume: boolean;
  streakDays: number;
  interviewCount: number;
  avgInterviewScore: number;
}): number {
  let score = 30;
  score += hasResume ? 25 : 0;
  score += Math.min(15, streakDays);
  score += interviewCount > 0 ? Math.round(avgInterviewScore * 0.3) : 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export default function HomeScreen({
  userName,
  quizPercent,
  onSignOut,
}: {
  userName: string;
  quizPercent: number | null;
  onSignOut: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("cursos");
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
  const [search, setSearch] = useState("");
  const [profileFlow, setProfileFlow] = useState<ProfileFlow>("menu");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [interviewStats, setInterviewStats] = useState<InterviewStats>({
    count: 0,
    totalScore: 0,
  });

  const displayName = userName.trim() || "Convidado";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const overallScore = computeOverallScore({
    hasResume: !!resumeData,
    streakDays: STREAK_DAYS,
    interviewCount: interviewStats.count,
    avgInterviewScore:
      interviewStats.count > 0
        ? interviewStats.totalScore / interviewStats.count
        : 0,
  });

  const query = search.trim().toLowerCase();
  const matches = (course: Course) =>
    (activeCategory === "Todos" || course.category === activeCategory) &&
    course.title.toLowerCase().includes(query);

  const visibleInProgress = IN_PROGRESS_COURSES.filter(matches);
  const visibleAvailable = AVAILABLE_COURSES.filter(matches);
  const noResults =
    visibleInProgress.length === 0 && visibleAvailable.length === 0;

  if (activeTab === "entrevista") {
    return (
      <InterviewFlow
        onLeave={() => setActiveTab("cursos")}
        onSessionComplete={(score) =>
          setInterviewStats((s) => ({
            count: s.count + 1,
            totalScore: s.totalScore + score,
          }))
        }
      />
    );
  }

  if (activeTab === "perfil" && profileFlow === "settings") {
    return (
      <SettingsScreen
        onBack={() => setProfileFlow("menu")}
        onSignOut={onSignOut}
      />
    );
  }

  if (activeTab === "perfil" && profileFlow === "chat") {
    return (
      <ResumeChatScreen
        onBack={() => setProfileFlow("menu")}
        onComplete={(data) => {
          setResumeData(data);
          setProfileFlow("result");
        }}
      />
    );
  }

  if (activeTab === "perfil" && profileFlow === "result" && resumeData) {
    return (
      <ResumeResultScreen
        data={resumeData}
        onBack={() => setProfileFlow("menu")}
        onRestart={() => setProfileFlow("chat")}
      />
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-navy">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-navy-lighter/40 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {activeTab === "perfil" ? (
          <ProfileScreen
            key="perfil"
            displayName={displayName}
            avatarInitial={avatarInitial}
            education={resumeData?.education ?? null}
            overallScore={overallScore}
            streakDays={STREAK_DAYS}
            interviewsCount={interviewStats.count}
            quizPercent={quizPercent}
            hasResume={!!resumeData}
            onOpenResume={() => setProfileFlow(resumeData ? "result" : "chat")}
            onOpenSettings={() => setProfileFlow("settings")}
          />
        ) : activeTab === "mentoria" ? (
          <MentoriaFlow key="mentoria" />
        ) : activeTab === "vagas" ? (
          <VagasScreen
            key="vagas"
            userOverallScore={overallScore}
            onContinueEvoluindo={() => setActiveTab("cursos")}
          />
        ) : (
        <main className="animate-step-in flex-1 overflow-y-auto px-6 pb-28 pt-6">
          <div className="mx-auto w-full max-w-md">
            <header className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">
                  {getGreeting()}, {displayName}! 👋
                </h1>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border-2 border-orange/40 bg-orange/10 px-3 py-1 text-sm font-bold text-orange">
                  🔥 {STREAK_DAYS} dias seguidos
                </div>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange text-lg font-extrabold text-white">
                {avatarInitial}
              </div>
            </header>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Buscar cursos..."
              className="mb-4 w-full rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-3 text-foreground placeholder:text-navy-muted outline-none transition-colors duration-150 focus:border-orange"
            />

            <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((category) => (
                <CategoryTag
                  key={category}
                  label={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                />
              ))}
            </div>

            {visibleInProgress.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-3 text-lg font-extrabold text-foreground">
                  Em andamento
                </h2>
                <div className="flex flex-col gap-3">
                  {visibleInProgress.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}

            {visibleAvailable.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-extrabold text-foreground">
                  Disponíveis
                </h2>
                <div className="flex flex-col gap-3">
                  {visibleAvailable.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}

            {noResults && (
              <p className="mt-10 text-center text-navy-muted">
                Nenhum curso encontrado.
              </p>
            )}
          </div>
        </main>
        )}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t-2 border-navy-lighter bg-navy-light/95 px-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-label={tab.label}
            onClick={() => setActiveTab(tab.id)}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-xl transition-all duration-150 ${
              activeTab === tab.id
                ? "bg-orange/15 text-orange scale-110"
                : "text-navy-muted"
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </nav>
    </div>
  );
}
