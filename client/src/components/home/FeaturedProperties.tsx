import { useEffect, useState } from 'react';
import { api, type Property } from '../../lib/api';
import { PropertyCarousel } from '../property/PropertyCarousel';
import { PropertyCardSkeleton } from '../property/PropertyCard';
import { SectionHeading } from '../ui/SectionHeading';

/** The curated rail of featured listings. */
export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api
      .listProperties({ featured: true, limit: 8, sort: 'featured' }, controller.signal)
      .then((response) => setProperties(response.items))
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setFailed(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <section id="featured" className="scroll-mt-24 bg-ivory py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          align="center"
          label="Featured"
          title="Featured Properties"
          description="A tightly held selection of homes and estates, chosen for their architecture, setting and long-term value."
        />
      </div>

      <div className="shell mt-14 lg:mt-16">
        {loading ? (
          <div className="flex gap-5 overflow-hidden sm:gap-7">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="w-[80%] shrink-0 sm:w-[340px] lg:w-[400px] xl:w-[440px]">
                <PropertyCardSkeleton />
              </div>
            ))}
          </div>
        ) : failed ? (
          <p className="rounded border border-navy/10 bg-white px-6 py-10 text-center text-[0.9375rem] text-slate">
            Our collection is briefly unavailable. Please refresh the page or browse all properties
            from the navigation above.
          </p>
        ) : (
          <div className="-mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10 xl:-mx-14 xl:px-14">
            <PropertyCarousel properties={properties} ariaLabel="Featured properties" />
          </div>
        )}
      </div>
    </section>
  );
}
