import { useEffect } from 'react';

const setMeta = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

/** Lightweight per-page SEO: title, description, canonical and social tags. */
export function Seo({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    const fullTitle = title.includes('عرب‌زاده') ? title : `${title} | پارچه‌سرای عرب‌زاده`;
    document.title = fullTitle;
    if (description) {
      setMeta('description', description);
      setMeta('og:description', description, 'property');
    }
    setMeta('og:title', fullTitle, 'property');

    const href = window.location.origin + window.location.pathname;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = href;
  }, [title, description]);

  return null;
}
