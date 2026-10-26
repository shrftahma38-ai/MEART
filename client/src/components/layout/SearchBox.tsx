import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import type { Product } from '../../lib/types';
import { useSettings } from '../../context/SettingsContext';
import { faNums } from '../../lib/format';
import { IconSearch } from '../ui/Icons';

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { settings } = useSettings();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const data = await api<{ products: Product[] }>(
          `/products?q=${encodeURIComponent(trimmed)}&limit=6`,
          { signal: controller.signal }
        );
        setResults(data.products);
        setOpen(true);
      } catch {
        /* aborted or offline */
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [term]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!term.trim()) return;
    setOpen(false);
    navigate(`/shop?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <div ref={wrapper} className="relative w-full">
      <form onSubmit={submit} role="search">
        <div className="relative">
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            onFocus={() => term.trim().length >= 2 && setOpen(true)}
            placeholder="جست‌وجوی نام پارچه…"
            aria-label="جست‌وجوی محصولات"
            className={`w-full rounded-lg border border-cream-100/25 bg-cream-100/10 py-2.5 pr-10 pl-3 text-sm text-cream-50 outline-none transition placeholder:text-cream-100/55 focus:border-gold-300/70 focus:bg-cream-100/15 ${
              compact ? '' : 'md:py-2.5'
            }`}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cream-100/70">
            <IconSearch className="h-4.5 w-4.5" />
          </span>
        </div>
      </form>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gold-200 bg-cream-50 shadow-soft">
          {loading && <p className="px-4 py-3 text-xs text-ink/50">در حال جست‌وجو…</p>}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-xs text-ink/60">پارچه‌ای با این نام پیدا نشد.</p>
          )}
          <ul className="max-h-[320px] divide-y divide-cream-300/60 overflow-auto">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/product/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-cream-200/60"
                >
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="h-12 w-10 rounded object-cover"
                    loading="lazy"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-bold text-forest-700">{product.name}</span>
                    <span className="block text-[10px] text-ink/50">{product.category?.name}</span>
                  </span>
                  <span className="num shrink-0 text-[11px] font-semibold text-gold-700">
                    {product.effectivePrice != null
                      ? `${faNums(product.effectivePrice)} ${settings.currency}`
                      : 'به‌زودی'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {results.length > 0 && (
            <Link
              to={`/shop?q=${encodeURIComponent(term.trim())}`}
              onClick={() => setOpen(false)}
              className="block border-t border-cream-300/70 bg-cream-100/60 px-4 py-2.5 text-center text-[11px] font-semibold text-gold-700 hover:bg-gold-100/60"
            >
              مشاهده همه نتایج «{term.trim()}»
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
