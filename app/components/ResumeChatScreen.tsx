"use client";

import { useEffect, useRef, useState } from "react";

export interface ResumeData {
  name: string;
  education: string;
  objective: string;
  experience: string;
  achievements: string;
  technicalSkills: string;
  softSkills: string;
  languages: string;
  bio: string;
}

interface ChatMessage {
  id: number;
  sender: "ai" | "user";
  text: string;
}

function firstName(fullName: string): string {
  return fullName.trim().split(" ")[0] || fullName.trim();
}

const QUESTIONS: {
  key: keyof ResumeData;
  prompt: (answers: Partial<ResumeData>) => string;
}[] = [
  {
    key: "name",
    prompt: () =>
      "Oi! Eu sou a Assistente Startágio 🚀 Vamos montar seu currículo juntos! Para começar, qual é o seu nome completo?",
  },
  {
    key: "education",
    prompt: (a) =>
      `Prazer, ${firstName(a.name ?? "")}! Em qual faculdade e curso você estuda (ou estudou)?`,
  },
  {
    key: "objective",
    prompt: () =>
      "Qual é o seu objetivo profissional? (ex: vaga ou área que você busca)",
  },
  {
    key: "experience",
    prompt: () =>
      "Conte sobre suas experiências profissionais ou estágios até agora (se ainda não teve nenhuma, pode dizer isso também).",
  },
  {
    key: "achievements",
    prompt: () =>
      "Quais conquistas ou resultados você tem orgulho? (projetos, prêmios, notas, certificados, etc.)",
  },
  {
    key: "technicalSkills",
    prompt: () =>
      "Quais habilidades técnicas você tem? (Excel, Python, Canva, etc. — pode separar por vírgula)",
  },
  {
    key: "softSkills",
    prompt: () =>
      "E habilidades comportamentais? (trabalho em equipe, comunicação, liderança, etc.)",
  },
  {
    key: "languages",
    prompt: () =>
      "Quais idiomas você fala e em qual nível? (ex: Inglês intermediário, Espanhol básico)",
  },
  {
    key: "bio",
    prompt: () =>
      "Para fechar, escreva uma breve apresentação pessoal sobre você.",
  },
];

function closingMessage(a: Partial<ResumeData>): string {
  return `Perfeito, ${firstName(a.name ?? "")}! Já tenho tudo que preciso para montar seu currículo 🎉`;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-navy-light px-4 py-3">
        {[0, 0.2, 0.4].map((delay) => (
          <span
            key={delay}
            className="animate-typing-dot h-2 w-2 rounded-full bg-navy-muted"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ResumeChatScreen({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: (data: ResumeData) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<ResumeData>>({});
  const [inputValue, setInputValue] = useState("");
  const [done, setDone] = useState(false);

  const nextId = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  function pushAiMessage(text: string, onShown?: () => void) {
    setIsTyping(true);
    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, sender: "ai", text },
      ]);
      onShown?.();
    }, delay);
  }

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    pushAiMessage(QUESTIONS[0].prompt({}));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const answer = inputValue.trim();
    if (!answer || isTyping || done) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, sender: "user", text: answer },
    ]);
    setInputValue("");

    const updatedAnswers: Partial<ResumeData> = {
      ...answers,
      [QUESTIONS[questionIndex].key]: answer,
    };
    setAnswers(updatedAnswers);

    const next = questionIndex + 1;
    if (next < QUESTIONS.length) {
      setQuestionIndex(next);
      pushAiMessage(QUESTIONS[next].prompt(updatedAnswers));
    } else {
      pushAiMessage(closingMessage(updatedAnswers), () => setDone(true));
    }
  }

  function handleGenerate() {
    onComplete(answers as ResumeData);
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy">
      <header className="flex items-center gap-3 border-b-2 border-navy-lighter px-4 py-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy-muted transition hover:text-foreground"
        >
          ←
        </button>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange text-xl">
          🚀
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-extrabold text-foreground">
            Assistente Startágio
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1.5 text-success">
              <span className="h-2 w-2 rounded-full bg-success" />
              Online agora
            </span>
            <span className="rounded-full bg-orange/15 px-2 py-0.5 text-xs font-bold text-orange">
              IA
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`animate-bubble-in flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-foreground ${
                  msg.sender === "user"
                    ? "rounded-br-sm bg-orange text-white"
                    : "rounded-bl-sm bg-navy-light"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </main>

      {done ? (
        <div className="border-t-2 border-navy-lighter px-4 py-4">
          <div className="mx-auto w-full max-w-md">
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full rounded-2xl bg-orange px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-[0_5px_0_0_var(--color-orange-dark)] transition-all duration-100 active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-orange-dark)]"
            >
              Gerar meu currículo ✨
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSend}
          className="border-t-2 border-navy-lighter px-4 py-3"
        >
          <div className="mx-auto flex w-full max-w-md items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              placeholder="Digite sua resposta..."
              className="flex-1 rounded-full border-2 border-navy-lighter bg-navy-light px-5 py-3 text-foreground placeholder:text-navy-muted outline-none transition-colors duration-150 focus:border-orange disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Enviar"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange text-lg text-white transition-colors duration-150 disabled:bg-navy-light disabled:text-navy-muted"
            >
              ➤
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
