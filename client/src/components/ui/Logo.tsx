import { Link } from 'react-router-dom';
import { cx } from '../../lib/cx';

/** Horizon lockup: architectural mark over a horizon line, with a champagne sun. */
export function LogoMark({ className, size = 30 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <path d="M5 27V11h3.4v6.3h10.2V11H22v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 27h26" stroke="#C5A358" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="22.6" cy="6.6" r="2.6" fill="#C5A358" />
    </svg>
  );
}

type LogoProps = {
  tone?: 'light' | 'dark';
  className?: string;
  asLink?: boolean;
};

export function Logo({ tone = 'light', className, asLink = true }: LogoProps) {
  const content = (
    <span className={cx('flex items-center gap-3', className)}>
      <LogoMark
        size={30}
        className={cx('shrink-0', tone === 'light' ? 'text-white' : 'text-navy')}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cx(
            'font-display text-[0.95rem] font-semibold uppercase leading-none tracking-[0.2em]',
            tone === 'light' ? 'text-white' : 'text-navy',
          )}
        >
          Horizon
        </span>
        <span
          className={cx(
            'mt-1 font-sans text-[0.5rem] font-light uppercase leading-none tracking-[0.42em]',
            tone === 'light' ? 'text-white/65' : 'text-navy/55',
          )}
        >
          Properties
        </span>
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link to="/" aria-label="Horizon Properties — home" className="group inline-flex">
      {content}
    </Link>
  );
}
