import { useCallback, useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { pad } from '../../lib/format';
import { imageSrcSet, imageUrl } from '../../lib/images';
import { Icon } from '../ui/Icon';

type PropertyGalleryProps = {
  images: string[];
  name: string;
  className?: string;
};

/**
 * Hero image, thumbnail rail and a fullscreen viewer. Arrow keys, Escape and
 * the buttons all drive the same index so mouse, touch and keyboard agree.
 */
export function PropertyGallery({ images, name, className }: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const go = useCallback(
    (direction: 1 | -1) => {
      setActive((current) => (current + direction + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, go]);

  const close = () => {
    setOpen(false);
    openButtonRef.current?.focus();
  };

  if (images.length === 0) return null;

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded bg-navy-50">
        <img
          key={images[active]}
          src={imageUrl(images[active], 1600)}
          srcSet={imageSrcSet(images[active], [768, 1200, 1600, 2000])}
          sizes="(max-width: 1024px) 100vw, 62vw"
          alt={`${name} — photograph ${active + 1} of ${images.length}`}
          className="aspect-[4/3] w-full animate-fade-in object-cover sm:aspect-[16/10]"
          loading="eager"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/45 to-transparent" />

        <p className="absolute bottom-4 left-4 rounded-full border border-white/25 bg-navy-950/40 px-3 py-1.5 font-sans text-[0.6875rem] tracking-label text-white backdrop-blur-sm">
          {pad(active)} / {pad(images.length - 1)}
        </p>

        <button
          ref={openButtonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open fullscreen gallery"
          className="absolute right-4 top-4 inline-flex h-11 items-center gap-2 rounded-full border border-white/35 bg-navy-950/35 px-4 font-sans text-[0.625rem] font-medium uppercase tracking-label text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-navy"
        >
          <Icon name="area" size={15} />
          View all
        </button>

        {images.length > 1 ? (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <GalleryArrow direction="left" onClick={() => go(-1)} />
            <GalleryArrow direction="right" onClick={() => go(1)} />
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photograph ${index + 1} of ${images.length}`}
                aria-current={index === active}
                className={cx(
                  'block h-20 w-24 overflow-hidden rounded border-2 transition-all duration-300 ease-editorial sm:h-24 sm:w-32',
                  index === active
                    ? 'border-champagne opacity-100'
                    : 'border-transparent opacity-65 hover:opacity-100',
                )}
              >
                <img
                  src={imageUrl(image, 320)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} gallery`}
          className="fixed inset-0 z-[80] flex flex-col bg-navy-950/96 animate-fade-in"
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="font-sans text-[0.6875rem] uppercase tracking-label text-white/70">
              {name} — {pad(active)} / {pad(images.length - 1)}
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Close fullscreen gallery"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-navy"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-2 sm:px-8">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photograph"
              className="absolute left-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-navy sm:left-6"
            >
              <Icon name="chevron-left" size={20} />
            </button>
            <img
              key={images[active]}
              src={imageUrl(images[active], 2000)}
              alt={`${name} — photograph ${active + 1} of ${images.length}`}
              className="max-h-full max-w-full animate-fade-in rounded object-contain"
            />
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photograph"
              className="absolute right-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-navy sm:right-6"
            >
              <Icon name="chevron-right" size={20} />
            </button>
          </div>

          <ul className="no-scrollbar flex shrink-0 gap-3 overflow-x-auto px-5 py-5 sm:justify-center sm:px-8">
            {images.map((image, index) => (
              <li key={image} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show photograph ${index + 1} of ${images.length}`}
                  aria-current={index === active}
                  className={cx(
                    'block h-14 w-20 overflow-hidden rounded border-2 transition-opacity duration-300',
                    index === active ? 'border-champagne opacity-100' : 'border-transparent opacity-50 hover:opacity-90',
                  )}
                >
                  <img src={imageUrl(image, 240)} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function GalleryArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'left' ? 'Show previous photograph' : 'Show next photograph'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-navy-950/35 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-navy"
    >
      <Icon name={direction === 'left' ? 'chevron-left' : 'chevron-right'} size={18} />
    </button>
  );
}
