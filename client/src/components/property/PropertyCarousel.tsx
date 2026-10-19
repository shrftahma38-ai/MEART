import { useCallback, useEffect, useRef, useState } from 'react';
import type { Property } from '../../lib/api';
import { cx } from '../../lib/cx';
import { markDragEnd } from '../../lib/dragGuard';
import { Icon } from '../ui/Icon';
import { PropertyCard } from './PropertyCard';

const CARD_WIDTH = 'w-[80%] shrink-0 snap-start sm:w-[340px] lg:w-[400px] xl:w-[440px]';

type PropertyCarouselProps = {
  properties: Property[];
  ariaLabel: string;
  className?: string;
};

/**
 * Horizontal, snapping property rail. Native scroll does the touch swiping;
 * pointer dragging is layered on for the mouse. Arrows wrap around at either
 * end, and the rail is keyboard scrollable.
 */
export function PropertyCarousel({ properties, ariaLabel, className }: PropertyCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, pointerId: -1, startX: 0, startScroll: 0, moved: 0 });
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrollable, setScrollable] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setScrollable(maxScroll > 8);
    setProgress(maxScroll > 0 ? Math.min(1, Math.max(0, track.scrollLeft / maxScroll)) : 0);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measure();

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(frame);
    };
  }, [measure, properties.length]);

  const step = () => {
    const track = trackRef.current;
    if (!track) return 360;
    const card = track.querySelector<HTMLElement>('[data-card]');
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    return card ? card.offsetWidth + gap : track.clientWidth * 0.8;
  };

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (direction === 1 && track.scrollLeft >= maxScroll - 8) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (direction === -1 && track.scrollLeft <= 8) {
      track.scrollTo({ left: maxScroll, behavior: 'smooth' });
      return;
    }
    track.scrollBy({ left: direction * step(), behavior: 'smooth' });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByCards(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByCards(-1);
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      moved: 0,
    };
    setDragging(true);
    // Capturing the pointer keeps the gesture on the rail (and stops the browser
    // turning the release into a click on whichever card sits under the cursor).
    try {
      track.setPointerCapture(event.pointerId);
    } catch {
      /* capture is best-effort */
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    const delta = event.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(delta));
    track.scrollLeft = drag.current.startScroll - delta;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    const track = trackRef.current;
    if (track && drag.current.pointerId >= 0) {
      try {
        track.releasePointerCapture(drag.current.pointerId);
      } catch {
        /* already released */
      }
    }
    if (drag.current.moved > 6) markDragEnd();
    drag.current.active = false;
    setDragging(false);
    measure();
  };

  /**
   * A drag must never open the property under the cursor, so the click that follows
   * one is cancelled on the native event — before React's handlers or the browser's
   * link behaviour can act on it. `moved` is reset on the next pointerdown, so an
   * ordinary click straight after a drag still works.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cancelClickAfterDrag = (event: MouseEvent) => {
      if (drag.current.moved <= 6) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    track.addEventListener('click', cancelClickAfterDrag, true);
    return () => track.removeEventListener('click', cancelClickAfterDrag, true);
  }, []);

  return (
    <div className={className}>
      <div
        ref={trackRef}
        role="group"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        className={cx(
          'no-scrollbar flex gap-5 overflow-x-auto pb-2 sm:gap-7',
          dragging ? 'cursor-grabbing snap-none select-none' : 'cursor-grab snap-x snap-mandatory',
        )}
        style={{ scrollPaddingLeft: '0.25rem' }}
      >
        {properties.map((property) => (
          <div key={property.id} data-card className={CARD_WIDTH}>
            <PropertyCard property={property} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-6 border-t border-navy/10 pt-6">
        <div className="hidden h-px flex-1 bg-navy/10 sm:block" aria-hidden="true">
          <div
            className="h-px bg-champagne transition-[width] duration-200 ease-out"
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
        <p className="font-sans text-[0.6875rem] uppercase tracking-label text-slate-soft">
          Drag or swipe to explore
        </p>
        <div className="ml-auto flex items-center gap-3">
          <CarouselArrow direction="left" disabled={!scrollable} onClick={() => scrollByCards(-1)} />
          <CarouselArrow direction="right" disabled={!scrollable} onClick={() => scrollByCards(1)} />
        </div>
      </div>
    </div>
  );
}

function CarouselArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
}) {
  const label = direction === 'left' ? 'Show previous properties' : 'Show next properties';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cx(
        'inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/20 text-navy transition-all duration-300 ease-editorial',
        'hover:border-navy hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-navy/20 disabled:hover:bg-transparent disabled:hover:text-navy',
      )}
    >
      <Icon name={direction === 'left' ? 'chevron-left' : 'chevron-right'} size={18} />
    </button>
  );
}
