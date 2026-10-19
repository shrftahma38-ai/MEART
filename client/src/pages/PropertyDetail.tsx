import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { InquiryForm } from '../components/forms/InquiryForm';
import { PageBanner } from '../components/layout/PageBanner';
import { AgentCard } from '../components/property/AgentCard';
import { FavoriteButton } from '../components/property/FavoriteButton';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { PropertyGrid } from '../components/property/PropertyGrid';
import { Button, TextLink } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api, type Property, type PropertyDetail as PropertyDetailType } from '../lib/api';
import { formatArea } from '../lib/format';

type LoadState = 'loading' | 'ready' | 'missing' | 'error';

export function PropertyDetail() {
  const { slug = '' } = useParams();
  const [property, setProperty] = useState<PropertyDetailType | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    const controller = new AbortController();
    setState('loading');

    api
      .getProperty(slug, controller.signal)
      .then((result) => {
        setProperty(result);
        setState('ready');
        return api.getSimilar(slug, controller.signal).then(setSimilar).catch(() => setSimilar([]));
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setState(cause instanceof Error && 'status' in cause && cause.status === 404 ? 'missing' : 'error');
      });

    return () => controller.abort();
  }, [slug]);

  if (state === 'loading') return <DetailSkeleton />;

  if (state !== 'ready' || !property) {
    return (
      <>
        <PageBanner
          label={state === 'missing' ? 'Not found' : 'Unavailable'}
          title={state === 'missing' ? 'This property is no longer listed' : 'We could not load this property'}
          description={
            state === 'missing'
              ? 'The listing you followed may have been withdrawn or sold. Browse the current collection instead.'
              : 'The property service did not respond. Please try again in a moment.'
          }
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Properties', to: '/properties' }, { label: 'Listing' }]}
        />
        <section className="shell bg-white py-16">
          <Button to="/properties" variant="primary" size="lg" icon={<Icon name="arrow-right" size={16} />}>
            Browse all properties
          </Button>
        </section>
      </>
    );
  }

  const specs = [
    { label: 'Property type', value: property.type },
    { label: 'Status', value: property.status },
    { label: 'Bedrooms', value: `${property.bedrooms}` },
    { label: 'Bathrooms', value: `${property.bathrooms}` },
    { label: 'Interior', value: formatArea(property.sqft) },
    { label: 'Lot', value: property.lotSize ?? '—' },
    { label: 'Year built', value: property.yearBuilt ? `${property.yearBuilt}` : '—' },
    { label: 'Garage', value: property.garage ? `${property.garage} cars` : '—' },
  ];

  const metaChips = [
    { icon: 'home' as const, label: property.type },
    { icon: 'bed' as const, label: `${property.bedrooms} bedrooms` },
    { icon: 'bath' as const, label: `${property.bathrooms} bathrooms` },
    { icon: 'area' as const, label: formatArea(property.sqft) },
  ];

  return (
    <article className="bg-white">
      <section className="border-b border-champagne/20 bg-navy-900 pb-12 pt-32 text-white lg:pb-16 lg:pt-40">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-3 font-sans text-[0.6875rem] uppercase tracking-label text-white/50">
              <li className="flex items-center gap-3">
                <Link to="/" className="transition-colors duration-300 hover:text-champagne">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
              </li>
              <li className="flex items-center gap-3">
                <Link to="/properties" className="transition-colors duration-300 hover:text-champagne">
                  Properties
                </Link>
                <span aria-hidden="true">/</span>
              </li>
              <li aria-current="page" className="text-white/80">
                {property.name}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label flex items-center gap-2 text-champagne">
                <Icon name="pin" size={13} />
                {property.location}
              </p>
              <h1 className="mt-5 max-w-3xl font-display text-[1.875rem] font-medium leading-[1.12] tracking-[-0.01em] sm:text-[2.375rem] lg:text-[2.875rem]">
                {property.name}
              </h1>

              <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-[0.875rem] text-white/75">
                {metaChips.map((chip) => (
                  <li key={chip.label} className="inline-flex items-center gap-2.5">
                    <Icon name={chip.icon} size={16} className="text-champagne" />
                    {chip.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start gap-5 lg:items-end">
              <p className="font-display text-[1.75rem] font-medium text-champagne sm:text-[2rem]">
                {property.priceLabel}
              </p>
              <FavoriteButton property={property} withLabel className="border-white/25 text-white hover:bg-white hover:text-navy" />
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-10 lg:py-14">
        <PropertyGallery images={property.images} name={property.name} />
      </section>

      <section className="shell grid grid-cols-1 gap-14 pb-20 lg:grid-cols-12 lg:gap-16 lg:pb-28">
        <div className="lg:col-span-7">
          <h2 className="label text-navy/55">About this property</h2>
          <p className="mt-5 text-[1.0625rem] leading-[1.85] text-slate">{property.description}</p>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-y border-navy/10 py-9 sm:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="font-sans text-[0.6875rem] uppercase tracking-label text-slate-soft">
                  {spec.label}
                </dt>
                <dd className="mt-2.5 font-display text-[1.0625rem] font-medium text-navy">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2">
            <div>
              <h2 className="label text-navy/55">Key features</h2>
              <ul className="mt-5 space-y-3.5">
                {property.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[0.9375rem] text-slate">
                    <Icon name="check" size={17} className="mt-0.5 shrink-0 text-champagne-dark" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="label text-navy/55">Amenities</h2>
              <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3.5">
                {property.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-start gap-3 text-[0.9375rem] text-slate">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="space-y-8 lg:sticky lg:top-32">
            {property.agent ? (
              <div className="rounded border border-navy/10 p-6 sm:p-7">
                <AgentCard
                  agent={property.agent}
                  propertyName={property.name}
                  scheduleHref="#schedule-viewing"
                />
              </div>
            ) : null}

            <div id="schedule-viewing" className="scroll-mt-28 rounded bg-navy-900 p-6 text-white sm:p-7">
              <p className="label text-champagne">Private viewing</p>
              <h2 className="mt-4 font-display text-[1.5rem] font-medium leading-tight">
                Schedule a viewing
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/70">
                Viewings are arranged privately, seven days a week. Tell us when suits you and we will
                confirm by email.
              </p>
              <InquiryForm
                kind="viewing"
                propertySlug={property.slug}
                propertyName={property.name}
                submitLabel="Request a viewing"
                messageLabel="Notes for your advisor"
                messagePlaceholder="Anything we should arrange for your visit?"
                withDate
                successTitle="Viewing request received"
                successBody="Your advisor will confirm a time by email within one business day."
                className="mt-7"
              />
            </div>
          </div>
        </aside>
      </section>

      {similar.length > 0 ? (
        <section className="bg-ivory py-20 lg:py-24">
          <div className="shell">
            <SectionHeading
              label="Similar"
              title="You may also like"
              action={<TextLink to="/properties">Browse all properties</TextLink>}
            />
            <PropertyGrid className="mt-12" properties={similar} skeletonCount={3} />
          </div>
        </section>
      ) : null}

      {/* Thumb-first conversion bar on small screens. */}
      <div className="sticky bottom-0 z-40 border-t border-navy/10 bg-white/95 backdrop-blur lg:hidden">
        <div className="shell flex items-center justify-between gap-4 py-3">
          <div>
            <p className="font-display text-[1.0625rem] font-medium text-navy">{property.priceLabel}</p>
            <p className="font-sans text-[0.625rem] uppercase tracking-label text-slate-soft">
              {property.bedrooms} bed · {property.bathrooms} bath
            </p>
          </div>
          <div className="flex items-center gap-3">
            {property.agent?.phone ? (
              <a
                href={`tel:${property.agent.phone.replace(/[^0-9+]/g, '')}`}
                aria-label={`Call ${property.agent.name}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/20 text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white"
              >
                <Icon name="phone" size={17} />
              </a>
            ) : null}
            <a
              href="#schedule-viewing"
              className="inline-flex h-11 items-center gap-2.5 bg-navy px-5 font-sans text-[0.6875rem] font-medium uppercase tracking-wide2 text-white transition-colors duration-300 hover:bg-navy-700"
            >
              Schedule
              <Icon name="calendar" size={15} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function DetailSkeleton() {
  return (
    <div className="bg-white pt-32 lg:pt-40" aria-busy="true" aria-label="Loading property">
      <div className="shell">
        <div className="shimmer h-3 w-40 rounded-sm" />
        <div className="shimmer mt-6 h-10 w-3/4 max-w-xl rounded-sm" />
        <div className="shimmer mt-7 h-4 w-2/3 max-w-md rounded-sm" />
        <div className="shimmer mt-12 aspect-[16/10] w-full rounded" />
        <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="shimmer h-4 w-full rounded-sm" />
            <div className="shimmer h-4 w-11/12 rounded-sm" />
            <div className="shimmer h-4 w-10/12 rounded-sm" />
          </div>
          <div className="lg:col-span-5">
            <div className="shimmer h-64 w-full rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
