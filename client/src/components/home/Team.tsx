import { useEffect, useState } from 'react';
import { api, type Agent } from '../../lib/api';
import { imageSrcSet, imageUrl } from '../../lib/images';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { TextLink } from '../ui/Button';

/** The advisory team, sourced from the same records the property pages use. */
export function Team() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    api
      .listAgents(controller.signal)
      .then(setAgents)
      .catch(() => setAgents([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <section id="team" className="scroll-mt-28 bg-ivory py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          label="Team"
          title="The Advisors"
          description="A compact team of specialists, each responsible for a different part of the market."
          action={<TextLink to="/contact">Work with us</TextLink>}
        />

        <div className="mt-14 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <div className="shimmer aspect-[4/5] rounded" />
                  <div className="shimmer mt-5 h-4 w-32 rounded-sm" />
                  <div className="shimmer mt-3 h-3 w-24 rounded-sm" />
                </div>
              ))
            : agents.map((agent, index) => (
                <Reveal key={agent.id} delay={index * 90}>
                  <article className="group/member">
                    <div className="overflow-hidden rounded bg-navy-50">
                      {agent.photo ? (
                        <img
                          src={imageUrl(agent.photo, 700)}
                          srcSet={imageSrcSet(agent.photo, [380, 560, 760])}
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 22vw"
                          alt={`Portrait of ${agent.name}, ${agent.role}`}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover/member:scale-[1.04]"
                        />
                      ) : null}
                    </div>

                    <h3 className="mt-5 font-display text-[1.1875rem] font-medium text-navy">
                      {agent.name}
                    </h3>
                    <p className="mt-1.5 font-sans text-[0.75rem] uppercase tracking-label text-champagne-dark">
                      {agent.role}
                    </p>

                    <span
                      aria-hidden="true"
                      className="mt-4 block h-px w-0 bg-champagne transition-all duration-500 ease-editorial group-hover/member:w-full"
                    />

                    <div className="mt-4 flex items-center gap-3">
                      {agent.linkedin ? (
                        <a
                          href={agent.linkedin}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`${agent.name} on LinkedIn`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white"
                        >
                          <Icon name="linkedin" size={15} />
                        </a>
                      ) : null}
                      {agent.email ? (
                        <a
                          href={`mailto:${agent.email}`}
                          aria-label={`Email ${agent.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white"
                        >
                          <Icon name="mail" size={15} />
                        </a>
                      ) : null}
                      {agent.phone ? (
                        <a
                          href={`tel:${agent.phone.replace(/[^0-9+]/g, '')}`}
                          aria-label={`Call ${agent.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white"
                        >
                          <Icon name="phone" size={15} />
                        </a>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}
