import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { IconOrnament } from './Icons';

export function SectionHeading({
  title,
  subtitle,
  link,
  linkLabel,
  align = 'center',
}: {
  title: string;
  subtitle?: string;
  link?: string;
  linkLabel?: string;
  align?: 'center' | 'start';
}) {
  return (
    <div className={`mb-8 flex flex-col gap-3 ${align === 'center' ? 'items-center text-center' : 'items-start'}`}>
      <div className="flex w-full items-center justify-center gap-3">
        {align === 'center' && <IconOrnament className="h-4 w-14 text-gold-400 md:w-20" />}
        <h2 className="whitespace-nowrap text-xl font-extrabold tracking-tight text-forest-700 md:text-2xl">{title}</h2>
        {align === 'center' && <IconOrnament className="h-4 w-14 -scale-x-100 text-gold-400 md:w-20" />}
        {link && (
          <Link
            to={link}
            className="absolute left-0 ml-auto hidden text-xs font-semibold text-gold-600 hover:text-gold-700 sm:inline-flex"
          >
            {linkLabel || 'مشاهده همه'}
          </Link>
        )}
      </div>
      {subtitle && <p className="max-w-2xl text-xs leading-6 text-ink/60 md:text-sm">{subtitle}</p>}
    </div>
  );
}

/** heading row with a link pinned to the left edge (RTL) */
export function RailHeading({ title, link, linkLabel }: { title: string; link?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <span className="h-7 w-1 rounded-full bg-gold-400" />
        <h2 className="text-lg font-extrabold text-forest-700 md:text-xl">{title}</h2>
        <IconOrnament className="hidden h-4 w-16 text-gold-400/80 sm:block" />
      </div>
      {link && (
        <Link
          to={link}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-gold-600 transition hover:text-gold-700"
        >
          {linkLabel || 'مشاهده همه'}
          <span aria-hidden>←</span>
        </Link>
      )}
    </div>
  );
}

export function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-2 text-gold-400 ${className}`}>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-300/70" />
      <IconOrnament className="h-3.5 w-10" />
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-300/70" />
    </div>
  );
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card p-5 md:p-6 ${className}`}>{children}</div>;
}
