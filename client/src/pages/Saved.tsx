import { PageBanner } from '../components/layout/PageBanner';
import { EmptyState, PropertyGrid } from '../components/property/PropertyGrid';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { useFavorites } from '../context/FavoritesContext';

/** Saved properties, persisted per visitor on the API. */
export function Saved() {
  const { items, loading, error } = useFavorites();

  return (
    <>
      <PageBanner
        label="Your shortlist"
        title="Saved Properties"
        description="Properties you have saved are kept here — compare them, then book a viewing for the ones worth your time."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Saved Properties' }]}
      />

      <section className="bg-white py-14 lg:py-20">
        <div className="shell">
          {error ? (
            <p role="alert" className="mb-8 rounded border border-red-200 bg-red-50 px-5 py-4 text-[0.9375rem] text-red-700">
              {error}
            </p>
          ) : null}

          {loading ? (
            <PropertyGrid properties={[]} loading skeletonCount={3} />
          ) : items.length === 0 ? (
            <EmptyState
              title="Nothing saved yet"
              description="Tap the heart on any property and it will appear here, ready to compare side by side."
              action={
                <Button to="/properties" variant="primary" size="lg" icon={<Icon name="arrow-right" size={16} />}>
                  Browse properties
                </Button>
              }
            />
          ) : (
            <>
              <p className="mb-10 font-sans text-[0.6875rem] uppercase tracking-label text-slate-soft">
                {items.length} {items.length === 1 ? 'property' : 'properties'} saved
              </p>
              <PropertyGrid properties={items} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
