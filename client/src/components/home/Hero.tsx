import { EDITORIAL } from '../../lib/editorial';
import { Icon } from '../ui/Icon';

/**
 * Full-bleed opening statement. The photograph settles from a slight over-scale
 * while the headline and copy fade up in sequence.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-navy-950">
      <img
        src={EDITORIAL.hero}
        alt="A modern villa with full-height glazing and an infinity pool at twilight"
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full animate-hero-settle object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-950/35 to-navy-950/85"
      />

      <div className="shell relative w-full pb-24 pt-32 sm:pb-28 lg:pb-32 lg:pt-40">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="label animate-fade-up text-champagne"
            style={{ animationDelay: '80ms' }}
          >
            Luxury Real Estate &middot; Est. 2004
          </p>

          <h1
            className="mt-7 animate-fade-up font-display text-[2.35rem] font-medium leading-[1.08] tracking-[-0.015em] text-white sm:text-[3.25rem] lg:text-[4.25rem] xl:text-[4.75rem]"
            style={{ animationDelay: '160ms' }}
          >
            Discover Exceptional
            <br />
            Homes &amp; Investments
          </h1>

          <p
            className="measure mx-auto mt-7 animate-fade-up text-[1.0625rem] leading-[1.75] text-white/80 sm:text-lg"
            style={{ animationDelay: '260ms' }}
          >
            Premium properties in prime locations. Find your dream home or the perfect investment
            with confidence.
          </p>

          <div
            className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: '340ms' }}
          >
            <a
              href="#featured"
              className="group/btn inline-flex h-[3.25rem] items-center justify-center gap-2.5 bg-champagne px-8 font-sans text-xs font-medium uppercase tracking-wide2 text-navy-900 transition-all duration-300 ease-editorial hover:bg-champagne-light"
            >
              View Properties
              <Icon
                name="arrow-right"
                size={16}
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              />
            </a>
            <a
              href="#contact"
              className="inline-flex h-[3.25rem] items-center justify-center gap-2.5 border border-white/45 px-8 font-sans text-xs font-medium uppercase tracking-wide2 text-white transition-all duration-300 ease-editorial hover:border-white hover:bg-white hover:text-navy"
            >
              Book a Consultation
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-8 hidden justify-center lg:flex"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="font-sans text-[0.625rem] uppercase tracking-label text-white/55">Scroll</span>
          <span className="h-12 w-px bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
