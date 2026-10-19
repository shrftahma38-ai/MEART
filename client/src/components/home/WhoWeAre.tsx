import { EDITORIAL } from '../../lib/editorial';
import { imageSrcSet, imageUrl } from '../../lib/images';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const STATS = [
  { value: '18', label: 'Years advising' },
  { value: '1,200+', label: 'Homes placed' },
  { value: '$4.8B', label: 'Transaction volume' },
];

/** The narrative section: copy on the left, an asymmetric image pair on the right. */
export function WhoWeAre() {
  return (
    <section id="about" className="scroll-mt-28 bg-white py-20 lg:py-28">
      <div className="shell grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionHeading
            label="About Us"
            title="Who We Are"
            description="At Horizon Properties, we connect people with extraordinary homes and smart investments. Integrity, transparency, and client satisfaction are at the heart of everything we do."
          />

          <dl className="mt-10 grid grid-cols-3 gap-6 border-y border-navy/10 py-7">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-[1.75rem] font-medium text-navy lg:text-[2rem]">
                    {stat.value}
                  </span>
                  <span className="mt-2 block font-sans text-[0.6875rem] uppercase tracking-label text-slate-soft">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <a
            href="#services"
            className="group/link mt-10 inline-flex h-[3.25rem] items-center gap-3 border border-navy/25 px-7 font-sans text-xs font-medium uppercase tracking-wide2 text-navy transition-all duration-300 ease-editorial hover:border-navy hover:bg-navy hover:text-white"
          >
            Learn More
            <Icon
              name="arrow-right"
              size={16}
              className="transition-transform duration-300 group-hover/link:translate-x-1"
            />
          </a>
        </Reveal>

        <Reveal delay={140} className="relative">
          <div className="group/cluster relative">
            <div className="overflow-hidden rounded">
              <img
                src={imageUrl(EDITORIAL.aboutPrimary, 1100)}
                srcSet={imageSrcSet(EDITORIAL.aboutPrimary, [640, 900, 1100, 1400])}
                sizes="(max-width: 1024px) 92vw, 46vw"
                alt="A white modern residence with a reflecting pool"
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover/cluster:scale-[1.04] sm:aspect-[5/6]"
              />
            </div>

            <div className="absolute -bottom-6 -left-4 hidden w-[42%] overflow-hidden rounded border-[6px] border-white shadow-[0_18px_50px_-24px_rgba(10,25,47,0.5)] sm:block lg:-left-8">
              <img
                src={imageUrl(EDITORIAL.aboutSecondary, 620)}
                srcSet={imageSrcSet(EDITORIAL.aboutSecondary, [420, 620, 900])}
                sizes="20vw"
                alt="A pared-back bedroom interior with soft grey tones"
                loading="lazy"
                decoding="async"
                className="aspect-[3/4] w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover/cluster:scale-[1.05]"
              />
            </div>

            <a
              href="#featured"
              aria-label="View our featured properties"
              className="absolute bottom-4 right-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-champagne text-navy-900 transition-all duration-500 ease-editorial hover:bg-navy hover:text-white sm:-bottom-6 sm:-right-4 sm:h-20 sm:w-20"
            >
              <Icon name="arrow-up-right" size={24} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
