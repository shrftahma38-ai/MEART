import type { ReactNode } from 'react';
import type { Property } from '../../lib/api';
import { cx } from '../../lib/cx';
import { Icon } from '../ui/Icon';
import { PropertyCard, PropertyCardSkeleton } from './PropertyCard';

type PropertyGridProps = {
  properties: Property[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
  imageSizes?: string;
};

/** Responsive 3 / 2 / 1 column grid used by the explorer and saved pages. */
export function PropertyGrid({
  properties,
  loading = false,
  skeletonCount = 6,
  className,
  imageSizes = '(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw',
}: PropertyGridProps) {
  if (loading) {
    return (
      <div className={cx('grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3', className)}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={cx('grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} imageSizes={imageSizes} ratio="portrait" />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center rounded border border-dashed border-navy/20 bg-ivory-light px-6 py-20 text-center',
        className,
      )}
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-champagne/50 text-champagne-dark">
        <Icon name="search" size={22} />
      </span>
      <h3 className="mt-6 font-display text-xl font-medium text-navy">{title}</h3>
      <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-slate">{description}</p>
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
