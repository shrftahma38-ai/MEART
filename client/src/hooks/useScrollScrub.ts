import { useEffect, useRef, useState, type RefObject } from 'react';

type ScrollScrubOptions = {
  /** The tall runway the scroll travels through. */
  sectionRef: RefObject<HTMLElement | null>;
  /** The pinned viewport inside it — its height is the travel offset. */
  frameRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  /**
   * Called inside the animation frame with the smoothed progress (0–1). Write to the DOM
   * here; never set state, or every scroll frame would re-render the tree.
   */
  onFrame?: (progress: number) => void;
  /** How tightly the timeline follows the wheel. ~16 settles in roughly 200ms. */
  rate?: number;
};

/** Half a frame of the 24fps source: seeking finer than this cannot change a picture. */
const MIN_SEEK = 1 / 48;

/**
 * Scroll-scrubbed video.
 *
 * The film is never played: no `play()`, no autoplay, no loop. Scroll position is the only
 * thing that moves `currentTime`, and it works in both directions.
 *
 * Architecture, in the order data flows:
 *   scroll event (passive) → target progress → requestAnimationFrame → smoothed progress →
 *   `currentTime`, written only when it would actually change the picture.
 *
 * Three things keep it from stuttering:
 *   1. scroll handlers never touch the video, they only record where the timeline should be;
 *   2. the smoothed progress eases toward the target, so a fast flick glides instead of jumping;
 *   3. seeks are gated — nothing is written while a previous seek is still in flight, and
 *      nothing narrower than half a frame is written at all.
 *
 * The loop only runs while the hero is on screen, so the rest of the page costs nothing.
 */
export function useScrollScrub({
  sectionRef,
  frameRef,
  videoRef,
  onFrame,
  rate = 16,
}: ScrollScrubOptions) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const frameCallback = useRef(onFrame);
  frameCallback.current = onFrame;

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    video.pause();
    video.loop = false;

    let cancelled = false;
    const markReady = () => {
      if (cancelled) return;
      setReady(true);
      setFailed(false);
    };
    const markFailed = () => {
      if (cancelled) return;
      setFailed(true);
      setReady(false);
    };
    const onMetadata = () => {
      // Park on the first frame so the timeline starts where the poster left off.
      try {
        video.currentTime = 0;
      } catch {
        /* metadata arrived before the media could be seeked — the loop will settle it */
      }
    };

    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('canplay', markReady);
    video.addEventListener('canplaythrough', markReady);
    video.addEventListener('error', markFailed);

    // The element may already have settled (or failed) before this effect attached.
    if (video.error) markFailed();
    else if (video.readyState >= 3) markReady();

    let sectionTop = 0;
    let travel = 1;
    let target = 0;
    let current = 0;
    let written = Number.NaN;
    let raf = 0;
    let last = 0;
    /**
     * Latched the first time the film can be seeked, and never cleared. Seeks drop
     * `readyState` back to HAVE_METADATA while they resolve, so testing readiness live
     * would keep resetting the timeline to the first frame and stall it there.
     */
    let armed = false;

    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const pinned = frameRef.current?.offsetHeight ?? window.innerHeight;
      travel = Math.max(1, section.offsetHeight - pinned);
    };

    const readScroll = () => {
      const raw = (window.scrollY - sectionTop) / travel;
      target = raw < 0 ? 0 : raw > 1 ? 1 : raw;
    };

    // Metadata is enough to seek.
    const hasTimeline = () => Number.isFinite(video.duration) && video.duration > 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      const elapsed = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;

      if (!armed && video.readyState >= 2 && hasTimeline()) armed = true;

      if (armed) {
        const delta = target - current;
        // Frame-rate independent easing: the same feel at 60Hz, 120Hz or a throttled tab,
        // and the timeline comes to rest exactly on the target once the gap is imperceptible.
        current =
          Math.abs(delta) < 0.0005 ? target : current + delta * (1 - Math.exp(-rate * elapsed));
      } else {
        // Before the film can be seeked at all, the first frame simply holds.
        current = 0;
      }

      frameCallback.current?.(current);

      if (!armed || !hasTimeline() || video.seeking) return;

      const time = current * video.duration;
      if (Math.abs(time - written) < MIN_SEEK) return;
      if (Math.abs(video.currentTime - time) < MIN_SEEK) {
        written = time;
        return;
      }
      written = time;
      video.currentTime = time;
    };

    const start = () => {
      if (raf) return;
      last = 0;
      measure();
      readScroll();
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries) => {
              if (entries[entries.length - 1]?.isIntersecting) start();
              else stop();
            },
            { rootMargin: '10% 0px' },
          );

    if (observer) observer.observe(section);
    else start();

    const onScroll = () => readScroll();
    const onResize = () => {
      measure();
      readScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.addEventListener('load', onResize);

    return () => {
      cancelled = true;
      stop();
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.removeEventListener('load', onResize);
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('canplay', markReady);
      video.removeEventListener('canplaythrough', markReady);
      video.removeEventListener('error', markFailed);
    };
  }, [frameRef, onFrame, rate, sectionRef, videoRef]);

  return { ready, failed };
}

/** True when the visitor asked the system to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
