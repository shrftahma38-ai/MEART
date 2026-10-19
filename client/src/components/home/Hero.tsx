import { useCallback, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useScrollScrub';
import { EDITORIAL } from '../../lib/editorial';
import { HeroCopy } from './HeroCopy';
import { HeroVideo } from './HeroVideo';

/** Where the copy starts leaving and where it has gone, as a share of the film. */
const COPY_FADE_START = 0.05;
const COPY_FADE_END = 0.27;
/** How far the copy drifts up as it fades. */
const COPY_DRIFT = 30;

export function Hero() {
  const reduced = usePrefersReducedMotion();
  return reduced ? <StaticHero /> : <ScrubHero />;
}

/**
 * The scroll-driven hero.
 *
 * The section is a runway three viewports tall; the frame inside it is pinned to the top of
 * the screen for that whole distance, so scrolling scrubs the film instead of scrolling past
 * it. Progress through the runway maps linearly onto the film's timeline — 0 → first frame,
 * 1 → last frame — and the mapping holds in both directions, so scrolling back up runs the
 * film backwards. Nothing here plays the video; see `useScrollScrub`.
 */
function ScrubHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  // Runs once per animation frame and writes straight to the DOM — scroll progress must
  // never pass through React state, or the whole tree would re-render on every frame.
  const onFrame = useCallback((progress: number) => {
    const node = copyRef.current;
    if (!node) return;

    const fade = Math.min(
      1,
      Math.max(0, (progress - COPY_FADE_START) / (COPY_FADE_END - COPY_FADE_START)),
    );
    node.style.opacity = String(1 - fade);
    node.style.transform = `translate3d(0, ${(-COPY_DRIFT * fade).toFixed(2)}px, 0)`;
    // Once it is mostly gone the copy must not swallow clicks meant for the film.
    node.style.pointerEvents = fade > 0.4 ? 'none' : '';
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate h-[300vh] bg-navy-950">
      <div ref={frameRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <HeroVideo sectionRef={sectionRef} frameRef={frameRef} onFrame={onFrame} />

        {/* Just enough shading to keep the transparent header and the scroll cue legible. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/5 to-navy-950/55"
        />

        <HeroCopy copyRef={copyRef} />
      </div>
    </section>
  );
}

/** Reduced motion: the brand photograph, one viewport tall, with no film and no runway. */
function StaticHero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-navy-950">
      <img
        src={EDITORIAL.hero}
        alt="A modern villa with full-height glazing and an infinity pool at twilight"
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-950/35 to-navy-950/85"
      />
      <HeroCopy />
    </section>
  );
}
