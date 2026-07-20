"use client";

import { useEffect, useRef, useState } from "react";
import {
  analyzeAnswer,
  type DurationMinutes,
  type InterviewConfig,
  type Interviewer,
  type QuestionResult,
} from "./InterviewFlow";

const QUESTION_BANKS: Record<Interviewer, string[]> = {
  Gestor: [
    "Fale um pouco sobre você e sua trajetória.",
    "Por que você quer trabalhar na {company}?",
    "Descreva um desafio que você enfrentou e como resolveu.",
    "Onde você se vê profissionalmente em 5 anos?",
    "Como você lida com prazos apertados e pressão?",
    "Qual foi seu maior aprendizado em um projeto recente?",
    "Por que devemos te escolher para a vaga de {role}?",
  ],
  RH: [
    "Conte-me um pouco sobre você.",
    "Quais são seus pontos fortes e pontos de melhoria?",
    "Como você trabalha em equipe?",
    "Você já teve algum conflito na faculdade ou trabalho? Como resolveu?",
    "Qual sua disponibilidade de horário para a vaga?",
    "O que te motiva a buscar essa oportunidade na {company}?",
    "Como você se organiza para conciliar estudos e trabalho?",
  ],
  Banca: [
    "Apresente-se para a banca.",
    "Qual conhecimento técnico você tem sobre a área de {role}?",
    "Explique um conceito importante da sua área de estudo.",
    "Como você aplicaria seus conhecimentos no dia a dia da vaga?",
    "Quais ferramentas ou tecnologias você domina?",
    "Descreva um projeto acadêmico relevante para essa vaga.",
    "Por que escolheu essa área de atuação?",
  ],
};

const COUNT_BY_DURATION: Record<DurationMinutes, number> = {
  5: 3,
  10: 5,
  15: 7,
};

const INTERVIEWER_EMOJI: Record<Interviewer, string> = {
  Gestor: "🧑‍💼",
  RH: "🙋",
  Banca: "🧑‍⚖️",
};

function interpolate(text: string, config: InterviewConfig): string {
  return text
    .replace("{company}", config.company)
    .replace("{role}", config.role);
}

function formatSeconds(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function InterviewLiveScreen({
  config,
  onExit,
  onFinish,
}: {
  config: InterviewConfig;
  onExit: () => void;
  onFinish: (results: QuestionResult[]) => void;
}) {
  const [questions] = useState<string[]>(() => {
    const bank = QUESTION_BANKS[config.interviewer];
    const count = COUNT_BY_DURATION[config.duration];
    return bank.slice(0, count).map((q) => interpolate(q, config));
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [results, setResults] = useState<QuestionResult[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const total = questions.length;
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!isSpeaking) return;
    const delay = 1600 + Math.random() * 800;
    const timeout = setTimeout(() => setIsSpeaking(false), delay);
    return () => clearTimeout(timeout);
  }, [isSpeaking, currentIndex]);

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(
      () => setRecordingSeconds((s) => s + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) textareaRef.current?.focus();
  }, [isRecording]);

  function startRecording() {
    if (isSpeaking) return;
    setIsRecording(true);
    setRecordingSeconds(0);
    setAnswerText("");
  }

  function finishAnswer() {
    setIsRecording(false);
    const { category, score, feedback } = analyzeAnswer(answerText);
    const finishedResult: QuestionResult = {
      question: currentQuestion,
      answerText: answerText.trim(),
      durationSeconds: recordingSeconds,
      category,
      score,
      feedback,
    };
    const updatedResults = [...results, finishedResult];
    setResults(updatedResults);
    setRecordingSeconds(0);
    setAnswerText("");

    if (currentIndex + 1 < total) {
      setCurrentIndex((i) => i + 1);
      setIsSpeaking(true);
    } else {
      onFinish(updatedResults);
    }
  }

  function handleExit() {
    const confirmed = window.confirm(
      "Sair da simulação? Seu progresso não será salvo.",
    );
    if (confirmed) onExit();
  }

  const progressPercent = Math.round((currentIndex / total) * 100);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-navy">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-navy-lighter/40 blur-3xl" />

      <div className="relative z-10 flex items-center gap-3 px-6 pt-6">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-navy-light">
          <div
            className="h-full rounded-full bg-orange transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <button
          type="button"
          onClick={handleExit}
          className="shrink-0 text-sm text-navy-muted transition hover:text-foreground"
        >
          ✕ Sair
        </button>
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-navy-lighter bg-navy-light text-6xl">
            {INTERVIEWER_EMOJI[config.interviewer]}
          </div>
          <div className="-mt-4 h-14 w-44 rounded-t-[3rem] border-4 border-navy-lighter bg-navy-light" />
        </div>

        <div className="mt-6 flex h-8 items-end justify-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`w-1.5 rounded-full bg-orange ${
                isSpeaking ? "h-8 animate-sound-wave" : "h-1.5 opacity-40"
              }`}
              style={isSpeaking ? { animationDelay: `${i * 0.12}s` } : undefined}
            />
          ))}
        </div>

        <div
          key={currentIndex}
          className="animate-step-in mt-8 w-full max-w-sm rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-4 text-center"
        >
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-orange">
            Pergunta {currentIndex + 1} de {total}
          </p>
          <p className="text-lg font-semibold text-foreground">
            {currentQuestion}
          </p>
        </div>
      </main>

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 pb-10 pt-4">
        {isRecording ? (
          <div className="w-full max-w-sm">
            <textarea
              ref={textareaRef}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Digite sua resposta..."
              rows={3}
              className="w-full resize-none rounded-2xl border-2 border-navy-lighter bg-navy-light px-4 py-3 text-foreground placeholder:text-navy-muted outline-none transition-colors duration-150 focus:border-orange"
            />
            <p className="mt-2 text-center text-sm text-navy-muted">
              🔴 Gravando... {formatSeconds(recordingSeconds)}
            </p>
            <button
              type="button"
              onClick={finishAnswer}
              className="mt-3 w-full rounded-2xl bg-orange px-5 py-3 text-base font-extrabold uppercase tracking-wide text-white shadow-[0_5px_0_0_var(--color-orange-dark)] transition-all duration-100 active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-orange-dark)]"
            >
              Concluir resposta ✓
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={startRecording}
              disabled={isSpeaking}
              aria-label="Responder"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-orange text-3xl text-white transition-all duration-150 disabled:opacity-40"
            >
              🎤
            </button>
            <p className="text-sm text-navy-muted">
              {isSpeaking
                ? "🔊 Entrevistador está falando..."
                : "Toque para responder"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
