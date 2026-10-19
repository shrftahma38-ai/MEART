import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageBanner } from '../components/layout/PageBanner';
import { Button } from '../components/ui/Button';
import {
  FilterPanel,
  resolvePriceBucket,
  type FilterState,
} from '../components/property/FilterPanel';
import { EmptyState, PropertyGrid } from '../components/property/PropertyGrid';
import { api, type Facets, type Property } from '../lib/api';

const PAGE_SIZE = 9;

/** The property explorer: search, filters, sort and results, all reflected in the URL. */
export function Properties() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo<FilterState>(
    () => ({
      search: params.get('search') ?? '',
      location: params.get('location') ?? '',
      type: params.get('type') ?? '',
      price: params.get('price') ?? '',
      beds: params.get('beds') ?? '',
      baths: params.get('baths') ?? '',
      sort: params.get('sort') ?? 'featured',
    }),
    [params],
  );

  const [searchInput, setSearchInput] = useState(filters.search);
  const [items, setItems] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<Facets | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [failed, setFailed] = useState(false);

  // The URL is the single source of truth; typing is debounced into it.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput === (params.get('search') ?? '')) return;
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (searchInput.trim()) next.set('search', searchInput.trim());
          else next.delete('search');
          return next;
        },
        { replace: true },
      );
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput, params, setParams]);

  const queryKey = params.toString();

  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [queryKey]);

  useEffect(() => {
    const controller = new AbortController();
    const firstPage = limit === PAGE_SIZE;
    if (firstPage) setLoading(true);
    else setLoadingMore(true);
    setFailed(false);

    api
      .listProperties(
        { ...filters, ...resolvePriceBucket(filters.price), limit, offset: 0 },
        controller.signal,
      )
      .then((response) => {
        setItems(response.items);
        setTotal(response.total);
        setFacets(response.facets);
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setFailed(true);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });

    return () => controller.abort();
  }, [queryKey, limit, filters]);

  const updateParams = (patch: Partial<FilterState>) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        Object.entries(patch).forEach(([key, value]) => {
          if (value && value !== 'featured') next.set(key, value);
          else next.delete(key);
        });
        return next;
      },
      { replace: true },
    );
  };

  const reset = () => {
    setSearchInput('');
    setParams(new URLSearchParams(), { replace: true });
  };

  const hasFilters =
    filters.search !== '' ||
    filters.location !== '' ||
    filters.type !== '' ||
    filters.price !== '' ||
    filters.beds !== '' ||
    filters.baths !== '';

  return (
    <>
      <PageBanner
        label="Portfolio"
        title="Browse Every Property"
        description="Search the full collection by location, type, price and size — then open a listing for the gallery, specification and your advisor's details."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Properties' }]}
      />

      <section className="bg-white py-14 lg:py-20">
        <div className="shell">
          <FilterPanel
            value={{ ...filters, search: searchInput }}
            onChange={(patch) => {
              if (patch.search !== undefined) setSearchInput(patch.search);
              const { search: _search, ...rest } = patch;
              if (Object.keys(rest).length > 0) updateParams(rest);
            }}
            onReset={reset}
            facets={facets}
            total={total}
            loading={loading}
          />

          <div className="mt-12">
            {failed ? (
              <EmptyState
                title="We could not load the collection"
                description="The property service did not respond. Please try again in a moment."
                action={<Button onClick={reset} variant="outline">Reset filters</Button>}
              />
            ) : loading ? (
              <PropertyGrid properties={[]} loading skeletonCount={6} />
            ) : items.length === 0 ? (
              <EmptyState
                title="No properties match those filters"
                description="Try widening the price range, choosing a different location, or clearing the filters to see the full collection."
                action={<Button onClick={reset} variant="outline">Clear all filters</Button>}
              />
            ) : (
              <>
                <PropertyGrid properties={items} />

                {items.length < total ? (
                  <div className="mt-14 flex flex-col items-center gap-4 border-t border-navy/10 pt-10">
                    <p className="font-sans text-[0.6875rem] uppercase tracking-label text-slate-soft">
                      Showing {items.length} of {total}
                    </p>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setLimit((current) => current + PAGE_SIZE)}
                      disabled={loadingMore}
                    >
                      {loadingMore ? 'Loading…' : 'Load more properties'}
                    </Button>
                  </div>
                ) : (
                  <p className="mt-14 border-t border-navy/10 pt-8 text-center font-sans text-[0.6875rem] uppercase tracking-label text-slate-soft">
                    {total} {total === 1 ? 'property' : 'properties'}
                    {hasFilters ? ' match your filters' : ' in the collection'}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
