import { useState } from 'react';
import type { Facets } from '../../lib/api';
import { cx } from '../../lib/cx';
import { Icon } from '../ui/Icon';

export type FilterState = {
  search: string;
  location: string;
  type: string;
  price: string;
  beds: string;
  baths: string;
  sort: string;
};

export const EMPTY_FILTERS: FilterState = {
  search: '',
  location: '',
  type: '',
  price: '',
  beds: '',
  baths: '',
  sort: 'featured',
};

export const PRICE_BUCKETS = [
  { value: '', label: 'Any price' },
  { value: 'under-2500000', label: 'Under $2.5M', min: 0, max: 2499999 },
  { value: '2500000-4000000', label: '$2.5M — $4M', min: 2500000, max: 4000000 },
  { value: '4000000-6000000', label: '$4M — $6M', min: 4000000, max: 6000000 },
  { value: 'over-6000000', label: '$6M +', min: 6000001, max: undefined },
];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'price-asc', label: 'Price — low to high' },
  { value: 'price-desc', label: 'Price — high to low' },
  { value: 'size-desc', label: 'Largest first' },
  { value: 'newest', label: 'Newest built' },
];

export function resolvePriceBucket(value: string): { minPrice?: number; maxPrice?: number } {
  const bucket = PRICE_BUCKETS.find((option) => option.value === value);
  if (!bucket || bucket.value === '') return {};
  return { minPrice: bucket.min, maxPrice: bucket.max };
}

type FilterPanelProps = {
  value: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  facets: Facets | null;
  total: number;
  loading?: boolean;
};

/** Search, location, type, price, beds, baths and sort — all wired to the API. */
export function FilterPanel({ value, onChange, onReset, facets, total, loading }: FilterPanelProps) {
  const [open, setOpen] = useState(false);

  const activeCount = ['location', 'type', 'price', 'beds', 'baths'].filter(
    (key) => value[key as keyof FilterState] !== '',
  ).length;

  return (
    <section aria-label="Property filters" className="rounded border border-navy/10 bg-white p-5 sm:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label htmlFor="filter-search" className="label block text-navy/60">
            Search
          </label>
          <div className="relative mt-3">
            <Icon
              name="search"
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40"
            />
            <input
              id="filter-search"
              type="search"
              value={value.search}
              onChange={(event) => onChange({ search: event.target.value })}
              placeholder="Search by name, city or keyword"
              className="h-12 w-full rounded-sm border border-navy/15 bg-white pl-11 pr-4 font-sans text-[0.9375rem] text-navy placeholder:text-navy/35 focus:border-navy focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="sm:min-w-0 sm:flex-1 lg:flex-none">
            <label htmlFor="filter-sort" className="label block text-navy/60">
              Sort by
            </label>
            <Select
              id="filter-sort"
              className="mt-3 w-full sm:min-w-[13rem]"
              value={value.sort}
              onChange={(next) => onChange({ sort: next })}
              options={SORT_OPTIONS}
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls="filter-advanced"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-navy/20 px-5 font-sans text-[0.6875rem] font-medium uppercase tracking-wide2 text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white sm:w-auto lg:hidden"
          >
            <Icon name="sliders" size={16} />
            Filters{activeCount > 0 ? ` (${activeCount})` : ''}
          </button>
        </div>
      </div>

      <div
        id="filter-advanced"
        className={cx('mt-6 border-t border-navy/10 pt-6 lg:block', open ? 'block' : 'hidden')}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Location" htmlFor="filter-location">
            <Select
              id="filter-location"
              value={value.location}
              onChange={(next) => onChange({ location: next })}
              options={[
                { value: '', label: 'All locations' },
                ...(facets?.locations ?? []).map((item) => ({ value: item, label: item })),
              ]}
            />
          </Field>

          <Field label="Property type" htmlFor="filter-type">
            <Select
              id="filter-type"
              value={value.type}
              onChange={(next) => onChange({ type: next })}
              options={[
                { value: '', label: 'All types' },
                ...(facets?.types ?? []).map((item) => ({ value: item, label: item })),
              ]}
            />
          </Field>

          <Field label="Price range" htmlFor="filter-price">
            <Select
              id="filter-price"
              value={value.price}
              onChange={(next) => onChange({ price: next })}
              options={PRICE_BUCKETS}
            />
          </Field>

          <Field label="Bedrooms" htmlFor="filter-beds">
            <Select
              id="filter-beds"
              value={value.beds}
              onChange={(next) => onChange({ beds: next })}
              options={[
                { value: '', label: 'Any' },
                { value: '3', label: '3 +' },
                { value: '4', label: '4 +' },
                { value: '5', label: '5 +' },
                { value: '6', label: '6 +' },
              ]}
            />
          </Field>

          <Field label="Bathrooms" htmlFor="filter-baths">
            <Select
              id="filter-baths"
              value={value.baths}
              onChange={(next) => onChange({ baths: next })}
              options={[
                { value: '', label: 'Any' },
                { value: '3', label: '3 +' },
                { value: '4', label: '4 +' },
                { value: '5', label: '5 +' },
                { value: '6', label: '6 +' },
              ]}
            />
          </Field>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 font-sans text-[0.6875rem] font-medium uppercase tracking-wide2 text-slate transition-colors duration-300 hover:text-champagne-dark"
          >
            <Icon name="close" size={14} />
            Clear all filters
          </button>
          <p aria-live="polite" className="font-sans text-[0.6875rem] uppercase tracking-label text-slate-soft">
            {loading ? 'Updating results…' : `${total} ${total === 1 ? 'property' : 'properties'} found`}
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label block text-navy/60">
        {label}
      </label>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  options,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}) {
  return (
    <div className={cx('relative', className)}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none rounded-sm border border-navy/15 bg-white pl-4 pr-10 font-sans text-[0.9375rem] text-navy focus:border-navy focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevron-down"
        size={16}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy/40"
      />
    </div>
  );
}
