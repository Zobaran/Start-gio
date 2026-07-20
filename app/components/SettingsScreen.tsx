"use client";

const SETTINGS_ITEMS = [
  "Notificações",
  "Privacidade",
  "Plano e assinatura",
  "Políticas de uso",
  "Ajuda e suporte",
  "Avaliar o app",
];

function SettingsRow({
  label,
  danger,
  onClick,
}: {
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border-2 border-navy-lighter bg-navy-light px-5 py-4 text-left transition-all duration-150 hover:border-navy-muted ${
        danger ? "text-error" : "text-foreground"
      }`}
    >
      <span className="font-semibold">{label}</span>
      {!danger && <span className="text-navy-muted">→</span>}
    </button>
  );
}

export default function SettingsScreen({
  onBack,
  onSignOut,
}: {
  onBack: () => void;
  onSignOut: () => void;
}) {
  function handleSignOut() {
    const confirmed = window.confirm(
      "Tem certeza que deseja sair da sua conta?",
    );
    if (confirmed) onSignOut();
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-navy">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-navy-lighter/40 blur-3xl" />

      <header className="relative z-10 flex items-center gap-3 px-4 py-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy-muted transition hover:text-foreground"
        >
          ←
        </button>
        <h1 className="text-lg font-extrabold text-foreground">
          Configurações
        </h1>
      </header>

      <main className="animate-step-in relative z-10 flex-1 overflow-y-auto px-6 pb-10">
        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          {SETTINGS_ITEMS.map((label) => (
            <SettingsRow key={label} label={label} />
          ))}

          <div className="mt-4">
            <SettingsRow
              label="Sair da conta"
              danger
              onClick={handleSignOut}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
