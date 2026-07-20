"use client";

interface FriendRankEntry {
  name: string;
  overall: number;
  streakDays: number;
  isUser: boolean;
}

const FRIENDS_BASE: Omit<FriendRankEntry, "isUser">[] = [
  { name: "Marina Lopes", overall: 82, streakDays: 12 },
  { name: "Bruno Tavares", overall: 68, streakDays: 5 },
  { name: "Camila Duarte", overall: 74, streakDays: 9 },
  { name: "Diego Franco", overall: 59, streakDays: 3 },
];

function overallBandClass(score: number): string {
  if (score <= 25) return "text-error";
  if (score <= 50) return "text-orange";
  if (score <= 75) return "text-success-light";
  return "text-success";
}

function buildRanking(
  userName: string,
  userOverall: number,
  userStreak: number,
): FriendRankEntry[] {
  const all: FriendRankEntry[] = [
    ...FRIENDS_BASE.map((f) => ({ ...f, isUser: false })),
    { name: userName, overall: userOverall, streakDays: userStreak, isUser: true },
  ];
  return all.sort((a, b) => b.overall - a.overall);
}

function OverallRing({ score }: { score: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const colorClass = overallBandClass(score);

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--color-navy-lighter)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colorClass} transition-all duration-700 ease-out`}
        />
      </svg>
      <span className={`absolute text-3xl font-extrabold ${colorClass}`}>
        {score}
      </span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border-2 border-navy-lighter bg-navy-light px-3 py-4 text-center">
      <p className="mb-1 text-xs uppercase tracking-wide text-navy-muted">
        {label}
      </p>
      <p className="text-xl font-extrabold text-foreground">{value}</p>
    </div>
  );
}

export default function ProfileScreen({
  displayName,
  avatarInitial,
  education,
  overallScore,
  streakDays,
  interviewsCount,
  quizPercent,
  hasResume,
  onOpenResume,
  onOpenSettings,
}: {
  displayName: string;
  avatarInitial: string;
  education: string | null;
  overallScore: number;
  streakDays: number;
  interviewsCount: number;
  quizPercent: number | null;
  hasResume: boolean;
  onOpenResume: () => void;
  onOpenSettings: () => void;
}) {
  const friends = buildRanking(displayName, overallScore, streakDays);

  return (
    <main className="animate-step-in flex-1 overflow-y-auto px-6 pb-28 pt-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">Perfil</h1>
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Configurações"
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-navy-muted transition hover:text-foreground"
          >
            ⚙️
          </button>
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-orange text-2xl font-extrabold text-white">
            {avatarInitial}
          </div>
          <h2 className="text-xl font-extrabold text-foreground">
            {displayName}
          </h2>
          <p className="text-sm text-navy-muted">
            {education ?? "Adicione sua faculdade e curso no currículo"}
          </p>
        </div>

        <div className="mb-8 flex flex-col items-center">
          <OverallRing score={overallScore} />
          <div className="mt-6 grid w-full grid-cols-3 gap-3">
            <StatCard label="Dias seguidos" value={`${streakDays}`} />
            <StatCard label="Entrevistas feitas" value={`${interviewsCount}`} />
            <StatCard
              label="% de acertos"
              value={quizPercent !== null ? `${quizPercent}%` : "—"}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenResume}
          className="mb-6 flex w-full items-center gap-4 rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-4 text-left transition-all duration-150 hover:border-navy-muted active:scale-[0.99]"
        >
          <span className="text-3xl">📄</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">Meu Currículo</p>
            <p className="text-sm text-navy-muted">
              {hasResume ? "Última edição: hoje" : "Ainda não criado"}
            </p>
          </div>
          <span className="shrink-0 rounded-xl bg-orange px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
            {hasResume ? "Editar →" : "Criar →"}
          </span>
        </button>

        <div className="rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">👥</span>
            <h3 className="font-extrabold text-foreground">
              Ranking semanal
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {friends.map((entry, i) => (
              <div
                key={entry.name}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                  entry.isUser ? "border-2 border-orange bg-orange/10" : ""
                }`}
              >
                <span className="w-6 shrink-0 text-sm font-bold text-navy-muted">
                  {i + 1}º
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                  {entry.name}
                  {entry.isUser ? " (Você)" : ""}
                </span>
                <span className="shrink-0 text-xs text-navy-muted">
                  🔥{entry.streakDays}
                </span>
                <span
                  className={`w-9 shrink-0 text-right text-sm font-extrabold ${overallBandClass(entry.overall)}`}
                >
                  {entry.overall}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
