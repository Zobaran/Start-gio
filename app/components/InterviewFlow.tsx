"use client";

import { useState } from "react";
import InterviewConfigScreen from "./InterviewConfigScreen";
import InterviewEncouragementScreen from "./InterviewEncouragementScreen";
import InterviewLiveScreen from "./InterviewLiveScreen";
import InterviewFeedbackScreen from "./InterviewFeedbackScreen";

export type Interviewer = "Gestor" | "RH" | "Banca";
export type Difficulty = "Iniciante" | "Médio" | "Avançado";
export type DurationMinutes = 5 | 10 | 15;

export interface InterviewConfig {
  company: string;
  role: string;
  interviewer: Interviewer;
  difficulty: Difficulty;
  duration: DurationMinutes;
}

export type AnswerCategory = "blank" | "short" | "medium" | "long";

export interface QuestionResult {
  question: string;
  answerText: string;
  durationSeconds: number;
  category: AnswerCategory;
  feedback: string;
}

export const CATEGORY_SCORE: Record<AnswerCategory, number> = {
  blank: 0,
  short: 40,
  medium: 70,
  long: 100,
};

export function analyzeAnswer(text: string): {
  category: AnswerCategory;
  feedback: string;
} {
  const trimmed = text.trim();

  if (trimmed === "") {
    return {
      category: "blank",
      feedback:
        "Você não respondeu essa pergunta. Em uma entrevista real isso seria eliminatório. Pratique mais!",
    };
  }

  const wordCount = trimmed.split(/\s+/).length;

  if (wordCount < 20) {
    return {
      category: "short",
      feedback:
        "Resposta muito curta. Nas entrevistas reais os recrutadores esperam mais desenvolvimento. Tente explicar com exemplos concretos.",
    };
  }

  if (wordCount <= 50) {
    return {
      category: "medium",
      feedback:
        "Resposta razoável. Você abordou o ponto mas poderia ter dado mais detalhes e exemplos da sua experiência.",
    };
  }

  return {
    category: "long",
    feedback:
      "Boa resposta! Você foi claro e desenvolveu bem o ponto. Continue assim nas próximas perguntas.",
  };
}

export function computeScore(results: QuestionResult[]): number {
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + CATEGORY_SCORE[r.category], 0);
  return Math.round(total / results.length);
}

type Stage = "config" | "encouragement" | "live" | "feedback";

export default function InterviewFlow({
  onLeave,
  onSessionComplete,
}: {
  onLeave: () => void;
  onSessionComplete?: (score: number) => void;
}) {
  const [stage, setStage] = useState<Stage>("config");
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [score, setScore] = useState(0);

  if (stage === "config") {
    return (
      <InterviewConfigScreen
        initialConfig={config}
        onLeave={onLeave}
        onStart={(nextConfig) => {
          setConfig(nextConfig);
          setStage("encouragement");
        }}
      />
    );
  }

  if (stage === "encouragement" && config) {
    return (
      <InterviewEncouragementScreen
        config={config}
        onBack={() => setStage("config")}
        onReady={() => setStage("live")}
      />
    );
  }

  if (stage === "live" && config) {
    return (
      <InterviewLiveScreen
        config={config}
        onExit={onLeave}
        onFinish={(questionResults) => {
          const finalScore = computeScore(questionResults);
          setResults(questionResults);
          setScore(finalScore);
          setStage("feedback");
          onSessionComplete?.(finalScore);
        }}
      />
    );
  }

  if (stage === "feedback" && config) {
    return (
      <InterviewFeedbackScreen
        results={results}
        score={score}
        onRestart={() => setStage("config")}
        onLeave={onLeave}
      />
    );
  }

  return null;
}
