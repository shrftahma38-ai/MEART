import { EDITORIAL } from '../../lib/editorial';
import { imageSrcSet, imageUrl } from '../../lib/images';
import { Icon, type IconName } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const REASONS: Array<{ title: string; description: string; icon: IconName }> = [
  {
    title: 'Market Intelligence',
    description:
      'We publish our own transaction data, so pricing decisions are made on evidence rather than sentiment.',
    icon: 'trend',
  },
  {
    title: 'Off-Market Access',
    description:
      'A private register of homes that never reach a public listing, shared with clients before anyone else.',
    icon: 'key',
  },
  {
    title: 'Discreet Representation',
    description:
      'Confidential mandates handled without publicity, from the first viewing through to settlement.',
    icon: 'shield',
  },
  {
    title: 'End-to-End Service',
    description:
      'One team for search, due diligence, financing introductions and after-sale care.',
    icon: 'users',
  },
];

const STATS = [
  { value: '$4.8B', label: 'Sold to date' },
  { value: '1,200+', label: 'Families placed' },
  { value: '18', label: 'Years in practice' },
  { value: '96%', label: 'List-to-sale price' },
];

/** Dark counterpoint to the white sections — value pillars plus proof points. */
export function WhyChoose() {
  return (
    <section className="bg-navy-900 py-20 text-white lg:py-28">
      <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            tone="light"
            label="Why Choose Horizon"
            title="Advice earned over eighteen years"
            description="We work with a small number of clients at a time — enough to know every property we represent and every street it sits on."
          />

          <ul className="mt-10 space-y-8">
            {REASONS.map((reason) => (
              <li key={reason.title} className="flex gap-5">
                <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-champagne/40 text-champagne">
                  <Icon name={reason.icon} size={18} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium text-white">{reason.title}</h3>
                  <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-white/65">
                    {reason.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={140} className="lg:col-span-7">
          <div className="overflow-hidden rounded">
            <img
              src={imageUrl(EDITORIAL.whyChoose, 1300)}
              srcSet={imageSrcSet(EDITORIAL.whyChoose, [760, 1100, 1500])}
              sizes="(max-width: 1024px) 92vw, 54vw"
              alt="Twin villas with lit pools photographed at dusk"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/15 pt-9 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-[1.75rem] font-medium text-champagne lg:text-[2rem]">
                    {stat.value}
                  </span>
                  <span className="mt-2 block font-sans text-[0.6875rem] uppercase leading-relaxed tracking-label text-white/55">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
