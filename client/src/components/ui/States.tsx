import type { ReactNode } from 'react';

export function Spinner({ label = 'در حال بارگذاری…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-ink/60">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold-300 border-t-transparent" />
      {label}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
      {message}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-300/60 bg-gold-100/50 text-gold-600">
        ✦
      </div>
      <p className="text-sm font-bold text-forest-700">{title}</p>
      {description && <p className="max-w-md text-xs leading-6 text-ink/60">{description}</p>}
      {action}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="aspect-[4/5] bg-cream-200" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-2/3 rounded bg-cream-200" />
        <div className="h-3 w-1/3 rounded bg-cream-200" />
        <div className="h-8 w-full rounded bg-cream-200" />
      </div>
    </div>
  );
}
