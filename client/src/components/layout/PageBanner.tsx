import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type PageBannerProps = {
  label: string;
  title: string;
  description?: string;
  crumbs?: Array<{ label: string; to?: string }>;
  children?: ReactNode;
};

/** Navy banner used to open every inner page, with room for the fixed header. */
export function PageBanner({ label, title, description, crumbs, children }: PageBannerProps) {
  return (
    <section className="relative border-b border-champagne/20 bg-navy-900 pb-14 pt-32 text-white lg:pb-20 lg:pt-40">
      <div className="shell">
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-3 font-sans text-[0.6875rem] uppercase tracking-label text-white/50">
              {crumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-3">
                  {crumb.to ? (
                    <Link to={crumb.to} className="transition-colors duration-300 hover:text-champagne">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white/80">
                      {crumb.label}
                    </span>
                  )}
                  {index < crumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <p className="label text-champagne">{label}</p>
        <h1 className="mt-5 max-w-3xl font-display text-[2rem] font-medium leading-[1.12] tracking-[-0.01em] sm:text-[2.5rem] lg:text-[3rem]">
          {title}
        </h1>
        {description ? (
          <p className="measure mt-5 text-[1.0625rem] leading-[1.7] text-white/70">{description}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
