const UNSPLASH_HOST = 'images.unsplash.com';

/**
 * Image bases are stored without sizing parameters so each surface can request the
 * size it actually renders. Non-Unsplash sources (e.g. the hero asset) are returned
 * untouched, since we can't assume their resize syntax.
 */
export function imageUrl(base: string, width: number, quality = 78): string {
  if (!base.includes(UNSPLASH_HOST)) return base;
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}auto=format&fit=crop&w=${width}&q=${quality}`;
}

export function imageSrcSet(base: string, widths: number[] = [480, 768, 1024, 1440, 1920]): string | undefined {
  if (!base.includes(UNSPLASH_HOST)) return undefined;
  return widths.map((width) => `${imageUrl(base, width)} ${width}w`).join(', ');
}

export function blurUp(base: string): string | undefined {
  if (!base.includes(UNSPLASH_HOST)) return undefined;
  return imageUrl(base, 24, 30);
}
