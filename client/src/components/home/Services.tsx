import { EDITORIAL } from '../../lib/editorial';
import { imageSrcSet, imageUrl } from '../../lib/images';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const SERVICES = [
  {
    title: 'Luxury Home Sales',
    description:
      'Representation for architecturally significant homes, from first valuation through to a discreet, closed sale.',
  },
  {
    title: 'Property Investment',
    description:
      'Yield modelling, portfolio structuring and acquisition strategy for private investors and family offices.',
  },
  {
    title: 'Property Marketing',
    description:
      'Editorial photography, film and placement across the channels that reach qualified buyers rather than traffic.',
  },
  {
    title: 'Real Estate Advisory',
    description:
      'Independent counsel on timing, negotiation and the long-term value of a holding.',
  },
  {
    title: 'Property Valuation',
    description:
      'Market-grounded appraisals for financing, estates and pre-listing positioning.',
  },
  {
    title: 'Relocation Services',
    description:
      'Neighbourhood guidance, school research and complete move coordination for relocating clients.',
  },
];

/** Editorial service list — numbered rows with hairlines, never icon boxes. */
export function Services() {
  return (
    <section id="services" className="scroll-mt-28 bg-white py-20 lg:py-28">
      <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              label="Services"
              title="What We Do"
              description="Six disciplines, one team. Every engagement is led by a partner who stays with you from first conversation to final signature."
            />

            <div className="mt-9 overflow-hidden rounded">
              <img
                src={imageUrl(EDITORIAL.services, 900)}
                srcSet={imageSrcSet(EDITORIAL.services, [560, 900, 1200])}
                sizes="(max-width: 1024px) 92vw, 38vw"
                alt="A modern villa and pool photographed in the late afternoon"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <a
              href="#contact"
              className="group/link mt-9 inline-flex items-center gap-3 font-sans text-xs font-medium uppercase tracking-wide2 text-navy transition-colors duration-300 hover:text-champagne-dark"
            >
              Talk to an advisor
              <Icon
                name="arrow-right"
                size={16}
                className="transition-transform duration-300 group-hover/link:translate-x-1"
              />
            </a>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <ul className="border-t border-navy/10">
            {SERVICES.map((service, index) => (
              <li key={service.title} className="border-b border-navy/10">
                <div className="group/row flex items-start gap-5 py-7 transition-all duration-500 ease-editorial hover:bg-ivory/70 hover:px-4 sm:gap-8">
                  <span className="mt-1 font-display text-[0.8125rem] font-medium tracking-[0.2em] text-champagne-dark">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-medium text-navy transition-colors duration-300 group-hover/row:text-champagne-dark sm:text-[1.375rem]">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-slate">
                      {service.description}
                    </p>
                  </div>
                  <Icon
                    name="arrow-up-right"
                    size={19}
                    className="mt-1 shrink-0 text-navy/25 transition-all duration-300 ease-editorial group-hover/row:translate-x-1 group-hover/row:text-champagne-dark"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
