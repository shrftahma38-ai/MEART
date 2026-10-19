import type { Agent } from '../../lib/api';
import { imageSrcSet, imageUrl } from '../../lib/images';
import { Icon } from '../ui/Icon';

type AgentCardProps = {
  agent: Agent;
  propertyName?: string;
  scheduleHref?: string;
  className?: string;
};

/** Advisor card used on the property detail page and the team section. */
export function AgentCard({ agent, propertyName, scheduleHref = '#schedule-viewing', className }: AgentCardProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-5">
        {agent.photo ? (
          <img
            src={imageUrl(agent.photo, 300)}
            srcSet={imageSrcSet(agent.photo, [180, 300, 420])}
            sizes="96px"
            alt={`Portrait of ${agent.name}`}
            loading="lazy"
            decoding="async"
            className="h-24 w-24 shrink-0 rounded object-cover"
          />
        ) : null}
        <div>
          <p className="label text-champagne-dark">Your advisor</p>
          <h3 className="mt-3 font-display text-xl font-medium text-navy">{agent.name}</h3>
          <p className="mt-1 text-[0.9375rem] text-slate">{agent.role}</p>
        </div>
      </div>

      {agent.bio ? <p className="mt-5 text-[0.9375rem] leading-relaxed text-slate">{agent.bio}</p> : null}

      <dl className="mt-6 space-y-3 border-t border-navy/10 pt-5 text-[0.9375rem]">
        {agent.phone ? (
          <div className="flex items-center gap-3">
            <dt className="sr-only">Phone</dt>
            <Icon name="phone" size={16} className="text-champagne-dark" />
            <dd>
              <a href={`tel:${agent.phone.replace(/[^0-9+]/g, '')}`} className="text-navy hover:text-champagne-dark">
                {agent.phone}
              </a>
            </dd>
          </div>
        ) : null}
        {agent.email ? (
          <div className="flex items-center gap-3">
            <dt className="sr-only">Email</dt>
            <Icon name="mail" size={16} className="text-champagne-dark" />
            <dd>
              <a href={`mailto:${agent.email}`} className="text-navy hover:text-champagne-dark">
                {agent.email}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={scheduleHref}
          className="inline-flex h-11 items-center gap-2 bg-navy px-5 font-sans text-[0.6875rem] font-medium uppercase tracking-wide2 text-white transition-colors duration-300 hover:bg-navy-700"
        >
          Schedule a viewing
          <Icon name="calendar" size={15} />
        </a>
        {agent.phone ? (
          <a
            href={`tel:${agent.phone.replace(/[^0-9+]/g, '')}`}
            className="inline-flex h-11 items-center gap-2 border border-navy/20 px-5 font-sans text-[0.6875rem] font-medium uppercase tracking-wide2 text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white"
          >
            Call {agent.name.split(' ')[0]}
            <Icon name="phone" size={15} />
          </a>
        ) : null}
      </div>

      {propertyName ? (
        <p className="mt-4 text-[0.8125rem] text-slate-soft">
          Enquiries about {propertyName} reach {agent.name.split(' ')[0]} directly.
        </p>
      ) : null}
    </div>
  );
}
