import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';

/** Closing conversion band: light, compact and spacious. */
export function CallToAction() {
  return (
    <section id="contact" className="scroll-mt-24 bg-mist py-16 lg:py-20">
      <div className="shell">
        <Reveal className="flex flex-col gap-9 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
          <div className="flex items-start gap-6 sm:gap-8">
            <span
              aria-hidden="true"
              className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-full border border-navy/15 bg-white text-champagne-dark sm:inline-flex"
            >
              <Icon name="key" size={30} strokeWidth={1.2} />
            </span>
            <div>
              <h2 className="font-display text-[1.75rem] font-medium leading-tight text-navy sm:text-4xl">
                Ready to Find Your Perfect Property?
              </h2>
              <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-slate">
                Let our experts guide you to the right home or investment.
              </p>
            </div>
          </div>

          <Link
            to="/contact"
            className="group/btn inline-flex h-[3.25rem] shrink-0 items-center justify-center gap-3 self-start bg-navy px-8 font-sans text-xs font-medium uppercase tracking-wide2 text-white transition-all duration-300 ease-editorial hover:bg-navy-700 lg:self-auto"
          >
            Get in Touch
            <Icon
              name="arrow-right"
              size={16}
              className="transition-transform duration-300 group-hover/btn:translate-x-1"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
