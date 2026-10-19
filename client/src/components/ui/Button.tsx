import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../lib/cx';
import { Icon } from './Icon';

type Variant = 'primary' | 'gold' | 'outline' | 'outline-light' | 'light';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-navy text-white hover:bg-navy-700 border border-navy hover:border-navy-700',
  gold: 'bg-champagne text-navy-900 hover:bg-champagne-light border border-champagne hover:border-champagne-light',
  outline: 'border border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-white',
  'outline-light': 'border border-white/45 text-white hover:border-white hover:bg-white hover:text-navy',
  light: 'bg-white text-navy hover:bg-ivory border border-white hover:border-ivory',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.625rem]',
  md: 'h-11 px-6 text-[0.6875rem]',
  lg: 'h-[3.25rem] px-8 text-xs',
};

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  ariaLabel?: string;
  target?: string;
  rel?: string;
};

/** The single button primitive used across the site. */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  type = 'button',
  disabled,
  className,
  icon,
  ariaLabel,
  target,
  rel,
}: ButtonProps) {
  const classes = cx(
    'group/btn inline-flex shrink-0 items-center justify-center gap-2.5 font-sans font-medium uppercase tracking-wide2 transition-all duration-300 ease-editorial disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {icon ?? null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  if (href) {
    const external = href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel');
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target={target ?? (external ? '_blank' : undefined)}
        rel={rel ?? (external ? 'noreferrer noopener' : undefined)}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} aria-label={ariaLabel}>
      {content}
    </button>
  );
}

/** Text link with a hairline that draws in on hover. */
export function TextLink({
  to,
  href,
  children,
  tone = 'navy',
  className,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  tone?: 'navy' | 'light';
  className?: string;
}) {
  const classes = cx(
    'group/link inline-flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-wide2 transition-colors duration-300 ease-editorial',
    tone === 'light' ? 'text-white hover:text-champagne-light' : 'text-navy hover:text-champagne-dark',
    className,
  );

  const inner = (
    <>
      <span className="relative">
        {children}
        <span
          className={cx(
            'absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 ease-editorial group-hover/link:w-full',
            tone === 'light' ? 'bg-champagne-light' : 'bg-champagne',
          )}
        />
      </span>
      <Icon
        name="arrow-right"
        size={14}
        className="transition-transform duration-300 ease-editorial group-hover/link:translate-x-1"
      />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {inner}
    </a>
  );
}
