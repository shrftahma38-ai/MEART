import { useFavorites } from '../../context/FavoritesContext';
import type { Property } from '../../lib/api';
import { cx } from '../../lib/cx';
import { Icon } from '../ui/Icon';

type FavoriteButtonProps = {
  property: Property;
  className?: string;
  withLabel?: boolean;
};

/** Toggles a saved property. Saved state is announced for assistive technology. */
export function FavoriteButton({ property, className, withLabel = false }: FavoriteButtonProps) {
  const { isSaved, toggle, pendingId } = useFavorites();
  const saved = isSaved(property.id);
  const pending = pendingId === property.id;

  const label = saved
    ? `Remove ${property.name} from saved properties`
    : `Save ${property.name} to saved properties`;

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={() => toggle(property)}
        aria-pressed={saved}
        aria-label={label}
        className={cx(
          'inline-flex h-11 items-center gap-2.5 border px-5 font-sans text-[0.6875rem] font-medium uppercase tracking-wide2 transition-all duration-300 ease-editorial',
          saved
            ? 'border-champagne bg-champagne/10 text-champagne-dark'
            : 'border-navy/20 text-navy hover:border-navy hover:bg-navy hover:text-white',
          className,
        )}
      >
        <Icon name="heart" size={16} className={cx(saved && 'fill-champagne text-champagne-dark')} />
        <span>{pending ? 'Updating…' : saved ? 'Saved' : 'Save'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(property)}
      aria-pressed={saved}
      aria-label={label}
      title={saved ? 'Remove from saved' : 'Save property'}
      className={cx(
        'relative z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 ease-editorial',
        saved
          ? 'border-champagne bg-champagne text-navy-900'
          : 'border-white/45 bg-navy-950/25 text-white hover:border-white hover:bg-white hover:text-navy',
        className,
      )}
    >
      <Icon name="heart" size={17} className={cx(saved && 'fill-navy-900')} />
    </button>
  );
}
