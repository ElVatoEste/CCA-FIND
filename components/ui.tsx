import type { PostType, PostStatus, ClaimStatus } from "@prisma/client";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition active:translate-y-px disabled:opacity-60";

export const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-full border border-ink px-5 py-3 text-sm font-semibold text-ink transition active:translate-y-px";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-ink-soft transition active:translate-y-px";

export const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3.5 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

export function Field({
  label,
  error,
  ...props
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <input {...props} className={inputClass} />
      {error && <span className="text-xs text-lost">{error}</span>}
    </label>
  );
}

export function TypeBadge({ type }: { type: PostType }) {
  const found = type === "found";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        found ? "bg-found-soft text-found" : "bg-lost-soft text-lost"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${found ? "bg-found" : "bg-lost"}`} />
      {found ? "Encontrado" : "Perdido"}
    </span>
  );
}

const STATUS_LABEL: Record<PostStatus, string> = {
  active: "Activa",
  resolved: "Resuelta",
};

export function StatusText({ status }: { status: PostStatus }) {
  return (
    <span
      className={`text-xs font-semibold ${
        status === "resolved" ? "text-muted" : "text-accent"
      }`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

const CLAIM_LABEL: Record<ClaimStatus, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
};

export function ClaimBadge({ status }: { status: ClaimStatus }) {
  const cls =
    status === "accepted"
      ? "bg-found-soft text-found"
      : status === "rejected"
        ? "bg-surface-2 text-muted"
        : "bg-lost-soft text-lost";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {CLAIM_LABEL[status]}
    </span>
  );
}

export function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-card/50 px-6 py-16 text-center">
      <p className="text-lg font-semibold text-ink">{title}</p>
      {subtitle && <p className="max-w-sm text-sm text-ink-soft">{subtitle}</p>}
      {action}
    </div>
  );
}
