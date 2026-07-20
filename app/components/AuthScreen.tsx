"use client";

import { useState } from "react";

type Mode = "login" | "signup";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
        c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
        c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039
        l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
        c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
        c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

function TextField({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-left">
      <span className="text-sm font-semibold text-navy-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-4 text-foreground placeholder:text-navy-muted/70 outline-none transition-colors duration-150 focus:border-orange"
      />
    </label>
  );
}

function SubmitButton({
  disabled,
  children,
}: {
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-2xl bg-orange px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-[0_5px_0_0_var(--color-orange-dark)] transition-all duration-100 active:translate-y-[3px] active:shadow-[0_2px_0_0_var(--color-orange-dark)] disabled:cursor-not-allowed disabled:bg-navy-light disabled:text-navy-muted disabled:shadow-none"
    >
      {children}
    </button>
  );
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const first = local.split(/[.\-_0-9]/).find((part) => part !== "") ?? local;
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : "Você";
}

export default function AuthScreen({
  onAuthenticated,
}: {
  onAuthenticated: (name: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setName("");
    setEmail("");
    setPassword("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const displayName =
      mode === "signup" ? name.trim().split(" ")[0] : nameFromEmail(email);
    onAuthenticated(displayName);
  }

  const canSubmit =
    mode === "login"
      ? email.trim() !== "" && password !== ""
      : name.trim() !== "" && email.trim() !== "" && password !== "";

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-navy px-6 py-10">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-navy-lighter/40 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col justify-center">
        <h1 className="mb-10 text-center text-3xl font-extrabold tracking-tight">
          <span className="text-foreground">Start</span>
          <span className="text-orange">ágio</span>
        </h1>

        <div key={mode} className="animate-step-in">
          <h2 className="mb-1 text-2xl font-extrabold text-foreground">
            {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h2>
          <p className="mb-8 text-navy-muted">
            {mode === "login"
              ? "Entre para continuar sua jornada."
              : "Comece sua jornada do estudo ao mercado."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <TextField
                label="Nome"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Seu nome completo"
                autoComplete="name"
              />
            )}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="voce@email.com"
              autoComplete="email"
            />
            <TextField
              label="Senha"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />

            <div className="mt-2">
              <SubmitButton disabled={!canSubmit}>
                {mode === "login" ? "Entrar" : "Criar minha conta"}
              </SubmitButton>
            </div>
          </form>

          {mode === "login" && (
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="mt-5 w-full text-center text-sm font-semibold text-orange transition hover:opacity-80"
            >
              Criar conta
            </button>
          )}

          {mode === "login" && (
            <>
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-navy-lighter" />
                <span className="text-sm text-navy-muted">ou</span>
                <div className="h-px flex-1 bg-navy-lighter" />
              </div>

              <button
                type="button"
                onClick={() => onAuthenticated("Convidado")}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-navy-lighter bg-foreground px-6 py-4 text-base font-semibold text-navy transition-colors duration-150 hover:border-navy-muted"
              >
                <GoogleIcon />
                Continuar com Google
              </button>
            </>
          )}

          {mode === "signup" && (
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="mt-5 w-full text-center text-sm font-semibold text-orange transition hover:opacity-80"
            >
              Já tenho conta — Entrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
