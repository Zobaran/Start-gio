"use client";

import { useState } from "react";

type PersonaId = "ensino_medio" | "faculdade" | "ja_estagiei";
type GoalId =
  | "curriculo"
  | "entrevistas"
  | "area"
  | "cursos"
  | "ingles"
  | "network"
  | "vagas";
type EnglishLevel = "Iniciante" | "Intermediário" | "Avançado";

interface CardOption<T extends string> {
  id: T;
  icon: string;
  label: string;
}

interface MultipleChoiceExercise {
  id: string;
  type: "multipla_escolha";
  question: string;
  options: string[];
  correctIndex: number;
}

interface FillBlankExercise {
  id: string;
  type: "complete_frase";
  sentence: string;
  options: string[];
  correctIndex: number;
}

interface BlockTranslationExercise {
  id: string;
  type: "traducao_blocos";
  prompt: string;
  targetWords: string[];
  distractorWords: string[];
}

interface PairsExercise {
  id: string;
  type: "pares";
  pairs: { en: string; pt: string }[];
}

type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | BlockTranslationExercise
  | PairsExercise;

const EXERCISE_TYPE_LABEL: Record<Exercise["type"], string> = {
  multipla_escolha: "Múltipla escolha",
  complete_frase: "Complete a frase",
  traducao_blocos: "Tradução por blocos",
  pares: "Associe os pares",
};

const PERSONA_OPTIONS: CardOption<PersonaId>[] = [
  { id: "ensino_medio", icon: "🎒", label: "Ensino Médio" },
  { id: "faculdade", icon: "🎓", label: "Faculdade" },
  { id: "ja_estagiei", icon: "💼", label: "Já estagiei" },
];

const GOAL_OPTIONS: CardOption<GoalId>[] = [
  { id: "curriculo", icon: "📄", label: "Montar meu currículo" },
  { id: "entrevistas", icon: "🎤", label: "Me preparar para entrevistas" },
  { id: "area", icon: "🧭", label: "Descobrir minha área" },
  { id: "cursos", icon: "📚", label: "Fazer novos cursos" },
  { id: "ingles", icon: "🗣️", label: "Melhorar meu inglês" },
  { id: "network", icon: "🤝", label: "Aumentar meu network" },
  { id: "vagas", icon: "🔎", label: "Descobrir vagas na minha área" },
];

const MULTIPLE_CHOICE_BANK: MultipleChoiceExercise[] = [
  {
    id: "mc-0",
    type: "multipla_escolha",
    question: 'Complete: "Hi, how ___ you?"',
    options: ["is", "are", "am", "be"],
    correctIndex: 1,
  },
  {
    id: "mc-1",
    type: "multipla_escolha",
    question: 'O que significa a palavra "schedule"?',
    options: ["Salário", "Horário/agenda", "Currículo", "Reunião"],
    correctIndex: 1,
  },
  {
    id: "mc-2",
    type: "multipla_escolha",
    question: 'No mundo do trabalho, o que é um "deadline"?',
    options: [
      "Local de trabalho",
      "Aumento salarial",
      "Prazo final para entregar algo",
      "Entrevista de emprego",
    ],
    correctIndex: 2,
  },
  {
    id: "mc-3",
    type: "multipla_escolha",
    question: 'O que significa "team player"?',
    options: [
      "Chefe da equipe",
      "Pessoa que trabalha bem em equipe",
      "Pessoa que trabalha sozinha",
      "Dono da empresa",
    ],
    correctIndex: 1,
  },
  {
    id: "mc-4",
    type: "multipla_escolha",
    question: 'Em uma reunião corporativa, o que significa "to touch base"?',
    options: [
      "Assinar um contrato",
      "Demitir um funcionário",
      "Fazer um contato rápido para alinhar informações",
      "Marcar férias",
    ],
    correctIndex: 2,
  },
];

const FILL_BLANK_BANK: FillBlankExercise[] = [
  {
    id: "fb-0",
    type: "complete_frase",
    sentence: "She ___ a teacher.",
    options: ["is", "are", "am", "be"],
    correctIndex: 0,
  },
  {
    id: "fb-1",
    type: "complete_frase",
    sentence: "They ___ from Brazil.",
    options: ["is", "am", "are", "be"],
    correctIndex: 2,
  },
  {
    id: "fb-2",
    type: "complete_frase",
    sentence: "I have been working here ___ 2020.",
    options: ["for", "since", "at", "in"],
    correctIndex: 1,
  },
  {
    id: "fb-3",
    type: "complete_frase",
    sentence: "I am responsible ___ managing the team.",
    options: ["of", "for", "with", "in"],
    correctIndex: 1,
  },
  {
    id: "fb-4",
    type: "complete_frase",
    sentence: "We need to ___ this project by Friday.",
    options: ["complete", "completing", "completed", "completes"],
    correctIndex: 0,
  },
];

const BLOCK_TRANSLATION_BANK: BlockTranslationExercise[] = [
  {
    id: "bt-0",
    type: "traducao_blocos",
    prompt: 'Traduza: "Eu trabalho em uma empresa de tecnologia."',
    targetWords: ["I", "work", "at", "a", "technology", "company"],
    distractorWords: ["live", "school"],
  },
  {
    id: "bt-1",
    type: "traducao_blocos",
    prompt: 'Traduza: "Ela é responsável pela equipe."',
    targetWords: ["She", "is", "responsible", "for", "the", "team"],
    distractorWords: ["was", "against"],
  },
  {
    id: "bt-2",
    type: "traducao_blocos",
    prompt: 'Traduza: "Nós temos uma reunião amanhã."',
    targetWords: ["We", "have", "a", "meeting", "tomorrow"],
    distractorWords: ["had", "yesterday"],
  },
  {
    id: "bt-3",
    type: "traducao_blocos",
    prompt: 'Traduza: "Eu preciso terminar este projeto."',
    targetWords: ["I", "need", "to", "finish", "this", "project"],
    distractorWords: ["needed", "that"],
  },
  {
    id: "bt-4",
    type: "traducao_blocos",
    prompt: 'Traduza: "Qual é o seu maior ponto forte?"',
    targetWords: ["What", "is", "your", "biggest", "strength"],
    distractorWords: ["was", "weakness"],
  },
];

const PAIRS_BANK: PairsExercise[] = [
  {
    id: "pr-0",
    type: "pares",
    pairs: [
      { en: "deadline", pt: "prazo final" },
      { en: "teamwork", pt: "trabalho em equipe" },
      { en: "salary", pt: "salário" },
      { en: "interview", pt: "entrevista" },
    ],
  },
  {
    id: "pr-1",
    type: "pares",
    pairs: [
      { en: "resume", pt: "currículo" },
      { en: "skills", pt: "habilidades" },
      { en: "manager", pt: "gerente" },
      { en: "meeting", pt: "reunião" },
    ],
  },
  {
    id: "pr-2",
    type: "pares",
    pairs: [
      { en: "goal", pt: "objetivo" },
      { en: "feedback", pt: "retorno/avaliação" },
      { en: "task", pt: "tarefa" },
      { en: "schedule", pt: "horário/agenda" },
    ],
  },
  {
    id: "pr-3",
    type: "pares",
    pairs: [
      { en: "strength", pt: "ponto forte" },
      { en: "weakness", pt: "ponto fraco" },
      { en: "opportunity", pt: "oportunidade" },
      { en: "experience", pt: "experiência" },
    ],
  },
  {
    id: "pr-4",
    type: "pares",
    pairs: [
      { en: "promotion", pt: "promoção" },
      { en: "colleague", pt: "colega de trabalho" },
      { en: "workload", pt: "carga de trabalho" },
      { en: "onboarding", pt: "integração" },
    ],
  },
];

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const SESSION_EXERCISE_COUNT = 15;

function pickSessionExercises(): Exercise[] {
  const typeBanks: Exercise[][] = [
    MULTIPLE_CHOICE_BANK,
    FILL_BLANK_BANK,
    BLOCK_TRANSLATION_BANK,
    PAIRS_BANK,
  ];
  const banks = typeBanks.map((bank) => shuffle(bank));

  // Guarantee every exercise type appears at least once.
  const guaranteed = banks.map((bank) => bank[0]);
  const leftovers = shuffle(banks.flatMap((bank) => bank.slice(1)));
  const rest = leftovers.slice(0, SESSION_EXERCISE_COUNT - guaranteed.length);

  return shuffle([...guaranteed, ...rest]);
}

function levelFromPercent(percent: number): EnglishLevel {
  if (percent <= 50) return "Iniciante";
  if (percent <= 79) return "Intermediário";
  return "Avançado";
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const QUIZ_START_STEP = 3;

function ProgressBar({
  stepIndex,
  totalSteps,
}: {
  stepIndex: number;
  totalSteps: number;
}) {
  const percent = Math.round((stepIndex / totalSteps) * 100);
  return (
    <div className="h-3 w-full rounded-full bg-navy-light overflow-hidden">
      <div
        className="h-full rounded-full bg-orange transition-all duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function OptionCard({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-150 ${
        selected
          ? "border-orange bg-orange/10 scale-[1.02]"
          : "border-navy-lighter bg-navy-light hover:border-navy-muted"
      }`}
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-lg font-semibold text-foreground">{label}</span>
      <span
        className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm ${
          selected
            ? "border-orange bg-orange text-white"
            : "border-navy-lighter text-transparent"
        }`}
      >
        ✓
      </span>
    </button>
  );
}

function ContinueButton({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-2xl bg-orange px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-[0_5px_0_0_var(--color-orange-dark)] transition-all duration-100 active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-orange-dark)] disabled:cursor-not-allowed disabled:bg-navy-light disabled:text-navy-muted disabled:shadow-none"
    >
      {children}
    </button>
  );
}

function MultipleChoiceExerciseView({
  exercise,
  onComplete,
}: {
  exercise: MultipleChoiceExercise;
  onComplete: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleSelect(index: number) {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === exercise.correctIndex;
    setTimeout(() => onComplete(correct), correct ? 900 : 1800);
  }

  return (
    <section>
      <h1 className="mb-8 text-2xl font-extrabold leading-snug text-foreground">
        {exercise.question}
      </h1>
      <div className="flex flex-col gap-4">
        {exercise.options.map((option, idx) => {
          const isAnswered = selected !== null;
          const isCorrectOption = idx === exercise.correctIndex;
          const isPicked = idx === selected;

          let classes =
            "border-navy-lighter bg-navy-light hover:border-navy-muted";
          if (isAnswered && isCorrectOption) {
            classes = "border-success bg-success/10";
          } else if (isAnswered && isPicked && !isCorrectOption) {
            classes = "border-error bg-error/10 animate-shake";
          } else if (isAnswered) {
            classes = "border-navy-lighter bg-navy-light opacity-50";
          }

          return (
            <button
              key={option}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(idx)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left text-lg font-semibold text-foreground transition-all duration-150 ${classes}`}
            >
              <span>{option}</span>
              {isAnswered && isCorrectOption && (
                <span className="text-sm font-bold uppercase tracking-wide text-success">
                  ✓ Resposta correta
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FillBlankExerciseView({
  exercise,
  onComplete,
}: {
  exercise: FillBlankExercise;
  onComplete: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleSelect(index: number) {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === exercise.correctIndex;
    setTimeout(() => onComplete(correct), correct ? 900 : 1800);
  }

  const isAnswered = selected !== null;
  const wasWrong = isAnswered && selected !== exercise.correctIndex;

  return (
    <section>
      <h1 className="mb-8 text-2xl font-extrabold leading-snug text-foreground">
        {exercise.sentence}
      </h1>
      <div className="flex flex-wrap justify-center gap-3">
        {exercise.options.map((option, idx) => {
          const isCorrectOption = idx === exercise.correctIndex;
          const isPicked = idx === selected;

          let classes =
            "border-navy-lighter bg-navy-light hover:border-navy-muted";
          if (isAnswered && isCorrectOption) {
            classes = "border-success bg-success/10";
          } else if (isAnswered && isPicked && !isCorrectOption) {
            classes = "border-error bg-error/10 animate-shake";
          } else if (isAnswered) {
            classes = "border-navy-lighter bg-navy-light opacity-50";
          }

          return (
            <button
              key={option}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(idx)}
              className={`rounded-full border-2 px-5 py-2 text-base font-semibold text-foreground transition-all duration-150 ${classes}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {wasWrong && (
        <p className="mt-4 text-center text-sm text-navy-muted">
          Resposta correta:{" "}
          <span className="font-semibold text-success">
            {exercise.options[exercise.correctIndex]}
          </span>
        </p>
      )}
    </section>
  );
}

function BlockTranslationExerciseView({
  exercise,
  onComplete,
}: {
  exercise: BlockTranslationExercise;
  onComplete: (correct: boolean) => void;
}) {
  const [pool, setPool] = useState(() =>
    shuffle(
      [...exercise.targetWords, ...exercise.distractorWords].map(
        (text, idx) => ({ id: `${idx}-${text}`, text }),
      ),
    ),
  );
  const [answer, setAnswer] = useState<typeof pool>([]);
  const [result, setResult] = useState<boolean | null>(null);

  function addBlock(block: { id: string; text: string }) {
    if (result !== null) return;
    setAnswer((a) => [...a, block]);
    setPool((p) => p.filter((b) => b.id !== block.id));
  }

  function removeBlock(block: { id: string; text: string }) {
    if (result !== null) return;
    setPool((p) => [...p, block]);
    setAnswer((a) => a.filter((b) => b.id !== block.id));
  }

  function handleCheck() {
    const isCorrect =
      answer.map((b) => b.text.toLowerCase()).join(" ") ===
      exercise.targetWords.join(" ").toLowerCase();
    setResult(isCorrect);
    setTimeout(() => onComplete(isCorrect), isCorrect ? 1000 : 1800);
  }

  const stripClasses =
    result === true
      ? "border-success bg-success/10"
      : result === false
        ? "border-error bg-error/10 animate-shake"
        : "border-navy-lighter bg-navy-light";

  return (
    <section>
      <h1 className="mb-6 text-2xl font-extrabold leading-snug text-foreground">
        {exercise.prompt}
      </h1>
      <div
        className={`mb-4 flex min-h-16 flex-wrap items-center gap-2 rounded-2xl border-2 p-3 transition-all duration-150 ${stripClasses}`}
      >
        {answer.map((block) => (
          <button
            key={block.id}
            type="button"
            onClick={() => removeBlock(block)}
            className="rounded-full bg-orange px-4 py-1.5 text-base font-semibold text-white"
          >
            {block.text}
          </button>
        ))}
      </div>
      {result === false && (
        <p className="mb-4 text-sm text-navy-muted">
          Resposta correta:{" "}
          <span className="font-semibold text-foreground">
            {exercise.targetWords.join(" ")}
          </span>
        </p>
      )}
      <div className="mb-6 flex flex-wrap gap-2">
        {pool.map((block) => (
          <button
            key={block.id}
            type="button"
            disabled={result !== null}
            onClick={() => addBlock(block)}
            className="rounded-full border-2 border-navy-lighter bg-navy-light px-4 py-1.5 text-base font-semibold text-foreground transition-all duration-150 hover:border-navy-muted disabled:opacity-50"
          >
            {block.text}
          </button>
        ))}
      </div>
      <ContinueButton
        disabled={answer.length !== exercise.targetWords.length || result !== null}
        onClick={handleCheck}
      >
        Conferir
      </ContinueButton>
    </section>
  );
}

function PairsExerciseView({
  exercise,
  onComplete,
}: {
  exercise: PairsExercise;
  onComplete: (correct: boolean) => void;
}) {
  const [rightItems] = useState(() => shuffle(exercise.pairs));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [pulse, setPulse] = useState<{ left: string; right: string } | null>(
    null,
  );
  const [hadMistake, setHadMistake] = useState(false);

  function handleLeftClick(en: string) {
    if (matched.has(en)) return;
    setSelectedLeft((current) => (current === en ? null : en));
  }

  function handleRightClick(rightEn: string) {
    if (matched.has(rightEn) || selectedLeft === null) return;

    if (selectedLeft === rightEn) {
      const nextMatched = new Set(matched);
      nextMatched.add(rightEn);
      setMatched(nextMatched);
      setSelectedLeft(null);
      if (nextMatched.size === exercise.pairs.length) {
        setTimeout(() => onComplete(!hadMistake), 700);
      }
    } else {
      setHadMistake(true);
      setPulse({ left: selectedLeft, right: rightEn });
      setSelectedLeft(null);
      setTimeout(() => setPulse(null), 1400);
    }
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-extrabold leading-snug text-foreground">
        Associe as palavras em inglês aos seus significados
      </h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {exercise.pairs.map((pair) => {
            const isMatched = matched.has(pair.en);
            const isSelected = selectedLeft === pair.en;
            const isPulsingWrong = pulse?.left === pair.en;
            let classes =
              "border-navy-lighter bg-navy-light hover:border-navy-muted";
            if (isMatched) classes = "border-success bg-success/10 opacity-60";
            else if (isPulsingWrong)
              classes = "border-error bg-error/10 animate-shake";
            else if (isSelected) classes = "border-orange bg-orange/10";

            return (
              <button
                key={pair.en}
                type="button"
                disabled={isMatched}
                onClick={() => handleLeftClick(pair.en)}
                className={`rounded-2xl border-2 px-4 py-3 text-base font-semibold text-foreground transition-all duration-150 ${classes}`}
              >
                {pair.en}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-3">
          {rightItems.map((pair) => {
            const isMatched = matched.has(pair.en);
            const isPulsingWrong = pulse?.right === pair.en;
            const isPulsingCorrectAnswer =
              pulse?.left === pair.en && pulse.right !== pair.en;
            let classes =
              "border-navy-lighter bg-navy-light hover:border-navy-muted";
            if (isMatched) classes = "border-success bg-success/10 opacity-60";
            else if (isPulsingWrong)
              classes = "border-error bg-error/10 animate-shake";
            else if (isPulsingCorrectAnswer)
              classes = "border-success bg-success/10";

            return (
              <button
                key={pair.en}
                type="button"
                disabled={isMatched}
                onClick={() => handleRightClick(pair.en)}
                className={`rounded-2xl border-2 px-4 py-3 text-base font-semibold text-foreground transition-all duration-150 ${classes}`}
              >
                {pair.pt}
                {isPulsingCorrectAnswer && (
                  <span className="ml-2 text-success">✓ correto</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export interface QuizResult {
  correct: number;
  total: number;
  percent: number;
}

export default function OnboardingFlow({
  onFinish,
}: {
  onFinish: (result: QuizResult | null) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [persona, setPersona] = useState<PersonaId | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<Set<GoalId>>(new Set());
  const [customGoal, setCustomGoal] = useState("");
  const [sessionExercises] = useState<Exercise[]>(() =>
    pickSessionExercises(),
  );
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const resultStep = QUIZ_START_STEP + sessionExercises.length;
  const isQuizStep = stepIndex >= QUIZ_START_STEP && stepIndex < resultStep;
  const exerciseIndex = stepIndex - QUIZ_START_STEP;
  const currentExercise = isQuizStep
    ? sessionExercises[exerciseIndex]
    : null;

  function handleExerciseComplete(correct: boolean) {
    setScore((s) => s + (correct ? 1 : 0));
    if (exerciseIndex === sessionExercises.length - 1) {
      setEndTime(Date.now());
    }
    setStepIndex((i) => i + 1);
  }

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function startQuiz() {
    setStartTime(Date.now());
    setEndTime(null);
    setStepIndex(QUIZ_START_STEP);
  }

  function toggleGoal(id: GoalId) {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function skipTest() {
    onFinish(null);
  }

  function goToOnboardingStart() {
    setStepIndex(0);
    setPersona(null);
    setSelectedGoals(new Set());
    setCustomGoal("");
    setScore(0);
    setStartTime(null);
    setEndTime(null);
  }

  const showBack = stepIndex === 1 || stepIndex === 2;
  const canSkipTest = stepIndex >= 2 && stepIndex < resultStep;

  const total = sessionExercises.length;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const elapsedMs = startTime && endTime ? endTime - startTime : 0;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-navy">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-navy-lighter/40 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-md items-center gap-3 px-6 pt-6">
        {showBack ? (
          <button
            type="button"
            onClick={goBack}
            aria-label="Voltar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl text-navy-muted transition hover:text-foreground"
          >
            ←
          </button>
        ) : (
          <div className="w-11 shrink-0" />
        )}
        <ProgressBar stepIndex={stepIndex} totalSteps={resultStep} />
        {canSkipTest && (
          <button
            type="button"
            onClick={skipTest}
            className="shrink-0 text-xs font-semibold text-navy-muted transition hover:text-foreground hover:underline"
          >
            Pular teste
          </button>
        )}
        <button
          type="button"
          onClick={goToOnboardingStart}
          aria-label="Voltar ao início do onboarding"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg transition hover:opacity-80"
        >
          🏠
        </button>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
        <div key={stepIndex} className="animate-step-in">
          {stepIndex === 0 && (
            <section>
              <h1 className="mb-2 text-3xl font-extrabold text-foreground">
                Quem é você? 👋
              </h1>
              <p className="mb-8 text-navy-muted">
                Assim a gente personaliza sua jornada no Startágio.
              </p>
              <div className="flex flex-col gap-4">
                {PERSONA_OPTIONS.map((option) => (
                  <OptionCard
                    key={option.id}
                    icon={option.icon}
                    label={option.label}
                    selected={persona === option.id}
                    onClick={() => setPersona(option.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {stepIndex === 1 && (
            <section>
              <h1 className="mb-2 text-3xl font-extrabold text-foreground">
                Qual seu objetivo?
              </h1>
              <p className="mb-8 text-navy-muted">
                Vamos focar no que mais importa pra você agora. Você pode
                escolher mais de uma opção.
              </p>
              <div className="flex flex-col gap-4">
                {GOAL_OPTIONS.map((option) => (
                  <OptionCard
                    key={option.id}
                    icon={option.icon}
                    label={option.label}
                    selected={selectedGoals.has(option.id)}
                    onClick={() => toggleGoal(option.id)}
                  />
                ))}
              </div>
              <div className="mt-4">
                <label
                  htmlFor="custom-goal"
                  className="mb-2 block text-sm font-semibold text-navy-muted"
                >
                  Outro objetivo — escreva aqui
                </label>
                <input
                  id="custom-goal"
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="Conta pra gente..."
                  className="w-full rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-3 text-foreground placeholder:text-navy-muted outline-none transition-colors duration-150 focus:border-orange"
                />
              </div>
            </section>
          )}

          {stepIndex === 2 && (
            <section className="text-center">
              <div className="animate-pop-in mb-6 text-7xl">🇺🇸</div>
              <h1 className="mb-4 text-2xl font-extrabold leading-snug text-foreground">
                Agora vamos fazer um teste rápido de inglês para entender
                melhor o seu nível 🇺🇸
              </h1>
              <p className="text-navy-muted">
                São exercícios variados: pares, frases, tradução e múltipla
                escolha — começando fácil e ficando mais desafiadores.
              </p>
            </section>
          )}

          {isQuizStep && currentExercise && (
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wide text-orange">
                {EXERCISE_TYPE_LABEL[currentExercise.type]} ·{" "}
                {exerciseIndex + 1}/{total}
              </p>
              {currentExercise.type === "multipla_escolha" && (
                <MultipleChoiceExerciseView
                  key={currentExercise.id}
                  exercise={currentExercise}
                  onComplete={handleExerciseComplete}
                />
              )}
              {currentExercise.type === "complete_frase" && (
                <FillBlankExerciseView
                  key={currentExercise.id}
                  exercise={currentExercise}
                  onComplete={handleExerciseComplete}
                />
              )}
              {currentExercise.type === "traducao_blocos" && (
                <BlockTranslationExerciseView
                  key={currentExercise.id}
                  exercise={currentExercise}
                  onComplete={handleExerciseComplete}
                />
              )}
              {currentExercise.type === "pares" && (
                <PairsExerciseView
                  key={currentExercise.id}
                  exercise={currentExercise}
                  onComplete={handleExerciseComplete}
                />
              )}
            </div>
          )}

          {stepIndex === resultStep && (
            <section className="text-center">
              <div className="animate-pop-in mb-6 text-7xl">🎉</div>
              <h1 className="mb-8 text-3xl font-extrabold text-foreground">
                Tudo pronto!
              </h1>

              <div className="mb-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border-2 border-navy-lighter bg-navy-light px-3 py-4">
                  <p className="text-xs uppercase tracking-wide text-navy-muted">
                    Tempo
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-foreground">
                    {formatDuration(elapsedMs)}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-navy-lighter bg-navy-light px-3 py-4">
                  <p className="text-xs uppercase tracking-wide text-navy-muted">
                    Acertos
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-foreground">
                    {score} de {total}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-navy-lighter bg-navy-light px-3 py-4">
                  <p className="text-xs uppercase tracking-wide text-navy-muted">
                    Aproveitamento
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-foreground">
                    {percent}%
                  </p>
                </div>
              </div>

              <p className="mb-3 text-navy-muted">Seu nível identificado é</p>
              <div className="mb-10 inline-block rounded-2xl border-2 border-orange bg-orange/10 px-8 py-4">
                <span className="text-2xl font-extrabold text-orange">
                  {levelFromPercent(percent)}
                </span>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-md px-6 pb-10">
        {stepIndex === 0 && (
          <ContinueButton disabled={!persona} onClick={() => setStepIndex(1)}>
            Continuar
          </ContinueButton>
        )}
        {stepIndex === 1 && (
          <ContinueButton
            disabled={selectedGoals.size === 0 && customGoal.trim() === ""}
            onClick={() => setStepIndex(2)}
          >
            Continuar
          </ContinueButton>
        )}
        {stepIndex === 2 && (
          <ContinueButton onClick={startQuiz}>Vamos lá!</ContinueButton>
        )}
        {stepIndex === resultStep && (
          <ContinueButton
            onClick={() => onFinish({ correct: score, total, percent })}
          >
            Começar
          </ContinueButton>
        )}
      </footer>
    </div>
  );
}
