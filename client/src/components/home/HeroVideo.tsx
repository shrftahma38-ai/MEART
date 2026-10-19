import { useRef, useState, type RefObject } from 'react';
import { useScrollScrub } from '../../hooks/useScrollScrub';
import { cx } from '../../lib/cx';
import { EDITORIAL, HERO_VIDEO } from '../../lib/editorial';

type HeroVideoProps = {
  sectionRef: RefObject<HTMLElement | null>;
  frameRef: RefObject<HTMLElement | null>;
  onFrame: (progress: number) => void;
};

/**
 * The film layer of the hero.
 *
 * Three stacked layers: a still first frame that paints immediately, the scrubbed video
 * above it, and a hairline marking that the film is still preparing. The video has no
 * controls, never plays and never loops — `useScrollScrub` owns its `currentTime` entirely.
 */
export function HeroVideo({ sectionRef, frameRef, onFrame }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Chosen once: swapping `src` later would restart the download. The lighter encode is for
  // phones only — the film is wider than it is tall, so from tablet width up the covering crop
  // magnifies it and the full encode is the sharp one.
  const [source] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
      ? HERO_VIDEO.mobile
      : HERO_VIDEO.desktop,
  );
  const [posterBroken, setPosterBroken] = useState(false);
  const { ready, failed } = useScrollScrub({ sectionRef, frameRef, videoRef, onFrame });

  return (
    <>
      {/* The hero is never an empty rectangle: this is the film's own first frame, and the
          brand photograph takes over if the film cannot be loaded at all. */}
      <img
        src={failed || posterBroken ? EDITORIAL.hero : HERO_VIDEO.poster}
        alt=""
        aria-hidden="true"
        decoding="async"
        onError={() => setPosterBroken(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <video
        ref={videoRef}
        src={source}
        poster={HERO_VIDEO.poster}
        preload="auto"
        muted
        playsInline
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        className={cx(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-editorial',
          ready && !failed ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        aria-hidden="true"
        className={cx(
          'pointer-events-none absolute inset-x-0 bottom-0 h-[2px] transition-opacity duration-700 ease-editorial',
          ready || failed ? 'opacity-0' : 'opacity-100',
        )}
      >
        <span className="block h-full w-full animate-pulse bg-champagne/80" />
      </div>
    </>
  );
}
