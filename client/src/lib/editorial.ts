/**
 * Marketing imagery that is not part of the property catalogue (presentation layer).
 * Sizing parameters are added by `lib/images.ts` at render time.
 */
/**
 * The scroll-scrubbed hero film, served from `client/public/hero/`.
 *
 * Encoding is what makes or breaks this: the timeline is driven by `currentTime`, so the
 * browser re-decodes from the nearest keyframe on every seek. The supplied master carried a
 * single keyframe for the whole 9s clip (any seek had to decode from frame one) at ~8.7 Mbps.
 * These encodes keep a keyframe every 6 frames — 0.25s at 24fps — plus `faststart`, and drop
 * the silent source audio track. If the film is ever replaced, keep those characteristics:
 *
 *   ffmpeg -i master.mp4 -an -c:v libx264 -crf 26 -preset veryslow \
 *     -g 6 -keyint_min 6 -sc_threshold 0 -movflags +faststart hero-scrub.mp4
 */
export const HERO_VIDEO = {
  desktop: '/hero/hero-scrub.mp4',
  /** Narrower encode for phones: less to download and less to decode per seek. */
  mobile: '/hero/hero-scrub-mobile.mp4',
  /** First frame of the film — paints instantly and matches the frame the scroll starts on. */
  poster: '/hero/hero-poster.jpg',
};

export const EDITORIAL = {
  /** Hero asset supplied as the visual reference for the brand. Also the hero fallback. */
  hero: 'https://media.base44.com/images/public/6ad1efc1a118498b010e2d0c/e8f6be365_TwilightModernVillabytheReflectingPool.png',
  aboutPrimary: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
  aboutSecondary: 'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0',
  services: 'https://images.unsplash.com/photo-1670589953882-b94c9cb380f5',
  whyChoose: 'https://images.unsplash.com/photo-1757356657991-c3fd6e2e812e',
  contact: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
};
