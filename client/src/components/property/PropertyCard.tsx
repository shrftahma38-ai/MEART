import { Link } from 'react-router-dom';
import type { Property } from '../../lib/api';
import { cx } from '../../lib/cx';
import { isDragClick } from '../../lib/dragGuard';
import { formatNumber } from '../../lib/format';
import { imageSrcSet, imageUrl } from '../../lib/images';
import { Icon } from '../ui/Icon';
import { FavoriteButton } from './FavoriteButton';

type PropertyCardProps = {
  property: Property;
  className?: string;
  imageSizes?: string;
  /** `wide` is used by the explorer grid, `default` by the carousel. */
  ratio?: 'portrait' | 'landscape';
  showFavorite?: boolean;
};

/**
 * The editorial property card: image as container, typography floating beneath.
 * The whole card is clickable through a stretched link, so the save button stays
 * a real, independent control.
 */
export function PropertyCard({
  property,
  className,
  imageSizes = '(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 420px',
  ratio = 'portrait',
  showFavorite = true,
}: PropertyCardProps) {
  const cover = property.images[0];

  return (
    <article className={cx('group/card relative flex flex-col', className)}>
      <div
        className={cx(
          'relative overflow-hidden rounded bg-navy-50',
          ratio === 'portrait' ? 'aspect-[4/5]' : 'aspect-[4/3]',
        )}
      >
        <img
          src={imageUrl(cover, 900)}
          srcSet={imageSrcSet(cover)}
          sizes={imageSizes}
          alt={`${property.name} — ${property.location}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover/card:scale-[1.05]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-navy-950/10 opacity-80"
        />
        <span className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-navy-950/35 px-3 py-1.5 font-sans text-[0.625rem] font-medium uppercase tracking-label text-white backdrop-blur-sm">
          {property.status}
        </span>
        {showFavorite ? <FavoriteButton property={property} className="absolute right-4 top-4" /> : null}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="label flex items-center gap-2 text-champagne-dark">
          <Icon name="pin" size={13} />
          {property.location}
        </p>
        <h3 className="mt-3 font-display text-[1.375rem] font-medium leading-snug text-navy transition-colors duration-300 group-hover/card:text-champagne-dark">
          <Link
            to={`/properties/${property.slug}`}
            onClick={(event) => {
              // Ignore the click that ends a drag on the carousel rail.
              if (isDragClick()) {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {property.name}
          </Link>
        </h3>
        <p className="mt-2 font-display text-lg font-medium text-navy/85">{property.priceLabel}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-navy/10 pt-4 text-[0.8125rem] text-slate">
          <span className="inline-flex items-center gap-2">
            <Icon name="bed" size={15} className="text-champagne-dark" />
            {property.bedrooms} Beds
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon name="bath" size={15} className="text-champagne-dark" />
            {property.bathrooms} Baths
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon name="area" size={14} className="text-champagne-dark" />
            {formatNumber(property.sqft)} sq ft
          </span>
        </div>
      </div>
    </article>
  );
}

/** Loading placeholder matching the card's proportions (prevents layout shift). */
export function PropertyCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cx('flex flex-col', className)} aria-hidden="true">
      <div className="shimmer aspect-[4/5] rounded" />
      <div className="pt-5">
        <div className="shimmer h-3 w-28 rounded-sm" />
        <div className="shimmer mt-3 h-5 w-3/4 rounded-sm" />
        <div className="shimmer mt-3 h-4 w-24 rounded-sm" />
        <div className="mt-5 h-px w-full bg-navy/10" />
        <div className="shimmer mt-4 h-3 w-40 rounded-sm" />
      </div>
    </div>
  );
}
