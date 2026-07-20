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
  score: number;
  feedback: string;
}

const FILLER_PATTERN = /\b(não sei|nao sei|sei lá|sei la|talvez|acho que|meio que|tipo assim)\b/i;
const CONCRETE_EXAMPLE_PATTERN =
  /\d|%|\b(por exemplo|exemplo|resultado|aumentei|reduzi|melhorei|entreguei|projeto|liderei|criei|desenvolvi)\b/i;

export function analyzeAnswer(text: string): {
  category: AnswerCategory;
  score: number;
  feedback: string;
} {
  const trimmed = text.trim();

  if (trimmed === "") {
    return {
      category: "blank",
      score: 0,
      feedback:
        "Você não respondeu essa pergunta. Em uma entrevista real isso seria eliminatório. Pratique mais!",
    };
  }

  const wordCount = trimmed.split(/\s+/).length;
  const hasFillers = FILLER_PATTERN.test(trimmed);
  const hasExample = CONCRETE_EXAMPLE_PATTERN.test(trimmed);

  if (wordCount < 20) {
    let score = 40;
    let feedback = `Resposta muito curta (${wordCount} ${wordCount === 1 ? "palavra" : "palavras"}). Nas entrevistas reais os recrutadores esperam mais desenvolvimento. Tente explicar com exemplos concretos.`;
    if (hasFillers) {
      score -= 10;
      feedback +=
        " Também evite expressões como 'não sei' ou 'talvez' — elas passam insegurança.";
    }
    return { category: "short", score: Math.max(0, score), feedback };
  }

  if (wordCount <= 50) {
    let score = 70;
    let feedback =
      "Resposta razoável. Você abordou o ponto, mas poderia ter dado mais detalhes.";
    if (hasExample) {
      score += 10;
      feedback += " Bom sinal: você trouxe um exemplo concreto — continue fazendo isso.";
    } else {
      score -= 5;
      feedback +=
        " Adicionar um exemplo real (com números ou resultados) deixaria a resposta bem mais convincente.";
    }
    if (hasFillers) {
      score -= 10;
      feedback += " Cuidado com expressões como 'não sei' ou 'talvez', que enfraquecem a resposta.";
    }
    return { category: "medium", score: Math.max(0, Math.min(100, score)), feedback };
  }

  let score = 90;
  let feedback = "Boa resposta! Você foi claro e desenvolveu bem o ponto.";
  if (hasExample) {
    feedback += " Trazer exemplos concretos como esse fortalece muito sua argumentação.";
  } else {
    score -= 10;
    feedback +=
      " Só falta amarrar com um exemplo concreto (um número, um resultado) para ficar ainda mais forte.";
  }
  if (hasFillers) {
    score -= 15;
    feedback +=
      " Atenção: mesmo em uma resposta longa, expressões como 'não sei' ou 'talvez' passam insegurança.";
  }
  return { category: "long", score: Math.max(0, Math.min(100, score)), feedback };
}

export function computeScore(results: QuestionResult[]): number {
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + r.score, 0);
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
        config={config}
        results={results}
        score={score}
        onRestart={() => setStage("config")}
        onLeave={onLeave}
      />
    );
  }

  return null;
}
