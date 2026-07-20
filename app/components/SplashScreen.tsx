"use client";

import { useEffect, useState } from "react";

type Phase = "idle" | "launching" | "exiting";

const IDLE_DURATION_MS = 2000;
const LAUNCH_DURATION_MS = 1300;
const EXIT_DURATION_MS = 450;

const SMOKE_PUFFS = [
  { delay: "0s", dx: "-6px" },
  { delay: "0.6s", dx: "4px" },
  { delay: "1.2s", dx: "-2px" },
];

function RocketIcon() {
  return (
    <svg viewBox="0 0 100 150" width="72" height="108" aria-hidden="true">
      <path
        d="M50 4 C66 4 74 34 74 62 L74 108 L64 100 L50 112 L36 100 L26 108 L26 62 C26 34 34 4 50 4 Z"
        fill="#F5F3FF"
        stroke="#423D84"
        strokeWidth="2"
      />
      <path d="M26 70 L8 98 L26 90 Z" fill="#FF6B2B" />
      <path d="M74 70 L92 98 L74 90 Z" fill="#FF6B2B" />
      <circle cx="50" cy="52" r="13" fill="#1E1B4B" stroke="#FF6B2B" strokeWidth="3" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg
      viewBox="0 0 40 60"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M20 0 C32 18 34 36 26 52 C23 58 17 58 14 52 C6 36 8 18 20 0 Z"
        fill="#FF6B2B"
      />
      <path
        d="M20 6 C28 20 29 32 24 44 C22 48 18 48 16 44 C11 32 12 20 20 6 Z"
        fill="#FFD37A"
      />
    </svg>
  );
}

export default function SplashScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const toLaunch = setTimeout(() => setPhase("launching"), IDLE_DURATION_MS);
    const toExit = setTimeout(
      () => setPhase("exiting"),
      IDLE_DURATION_MS + LAUNCH_DURATION_MS,
    );
    const toComplete = setTimeout(
      onComplete,
      IDLE_DURATION_MS + LAUNCH_DURATION_MS + EXIT_DURATION_MS,
    );
    return () => {
      clearTimeout(toLaunch);
      clearTimeout(toExit);
      clearTimeout(toComplete);
    };
  }, [onComplete]);

  const isFlying = phase === "launching" || phase === "exiting";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-navy-lighter/40 blur-3xl" />

      <div
        className={`relative z-10 flex flex-col items-center px-6 text-center ${
          phase === "exiting" ? "animate-splash-fade-out" : ""
        }`}
      >
        <h1 className="mb-2 text-5xl font-extrabold tracking-tight">
          <span className="text-foreground">Start</span>
          <span className="text-orange">ágio</span>
        </h1>
        <p className="mb-10 text-navy-muted">Do estudo ao mercado</p>

        <div
          className="flex flex-col items-center"
          style={
            isFlying
              ? {
                  transform: "translateY(-160vh)",
                  transition: `transform ${LAUNCH_DURATION_MS}ms cubic-bezier(0.55, 0.05, 0.85, 0.35)`,
                }
              : undefined
          }
        >
          <div className={phase === "idle" ? "animate-rocket-bob" : undefined}>
            <RocketIcon />
          </div>

          <div
            className={`w-6 origin-top transition-[height] duration-300 ease-out ${
              isFlying ? "h-11 animate-flame-launch" : "h-4 animate-flame-idle"
            }`}
          >
            <FlameIcon />
          </div>

          <div className="relative h-8 w-16">
            {SMOKE_PUFFS.map((puff, idx) => (
              <span
                key={idx}
                className="animate-smoke-puff absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-navy-muted/70"
                style={
                  {
                    animationDelay: puff.delay,
                    "--smoke-dx": puff.dx,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
