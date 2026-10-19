import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

type SectionHeadingProps = {
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
  action?: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
};

/** Label + title + supporting copy, used by every section for a consistent hierarchy. */
export function SectionHeading({
  label,
  title,
  description,
  align = 'left',
  tone = 'dark',
  className,
  action,
  as: Title = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={cx(
        'flex flex-col gap-6',
        align === 'center' ? 'items-center text-center' : 'items-start',
        Boolean(action) && 'lg:flex-row lg:items-end lg:justify-between lg:gap-10',
        className,
      )}
    >
      <div className={cx('max-w-3xl', align === 'center' && 'flex flex-col items-center')}>
        {label ? (
          <p className={cx('label mb-4', tone === 'light' ? 'text-champagne' : 'text-champagne-dark')}>{label}</p>
        ) : null}
        <Title
          className={cx(
            'font-display text-[1.75rem] font-medium leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]',
            tone === 'light' ? 'text-white' : 'text-navy',
          )}
        >
          {title}
        </Title>
        {description ? (
          <p
            className={cx(
              'mt-5 text-[1.0625rem] leading-[1.7] sm:text-lg',
              tone === 'light' ? 'text-white/70' : 'text-slate',
              align === 'center' && 'mx-auto max-w-2xl',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
