import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Category, Product } from '../lib/types';
import type { ColorFacet } from '../lib/shopTypes';
import { Seo } from '../components/ui/Seo';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState, ErrorBox, SkeletonCard } from '../components/ui/States';
import { IconChevronDown, IconSearch } from '../components/ui/Icons';
import { faNums } from '../lib/format';

const SORTS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
  { value: 'popular', label: 'پرفروش‌ترین' },
];

export function Shop() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<ColorFacet[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState(params.get('q') || '');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get('category') || '';
  const color = params.get('color') || '';
  const sort = params.get('sort') || 'newest';
  const page = Number(params.get('page') || 1);
  const q = params.get('q') || '';
  const featured = params.get('featured') || '';

  useEffect(() => {
    void api<{ categories: Category[] }>('/categories').then((data) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setTerm(q);
  }, [q]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    const query = new URLSearchParams();
    if (category) query.set('category', category);
    if (color) query.set('color', color);
    if (q) query.set('q', q);
    if (featured) query.set('featured', featured);
    query.set('sort', sort);
    query.set('page', String(page));
    query.set('limit', '12');

    api<{ products: Product[]; total: number; pages: number; colors: ColorFacet[] }>(`/products?${query.toString()}`)
      .then((data) => {
        if (!alive) return;
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
        setColors(data.colors);
      })
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [category, color, q, sort, page, featured]);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, value);
    });
    if (!('page' in patch)) next.delete('page');
    setParams(next);
  };

  const activeCategory = useMemo(() => categories.find((c) => c.slug === category), [categories, category]);

  const filterPanel = (
    <div className="space-y-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          update({ q: term.trim() || null });
          setFiltersOpen(false);
        }}
      >
        <label className="label">جست‌وجو در محصولات</label>
        <div className="relative">
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="نام پارچه…"
            className="input pr-9"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40">
            <IconSearch className="h-4 w-4" />
          </span>
        </div>
      </form>

      <div>
        <p className="label">دسته‌بندی</p>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => update({ category: null })}
            className={`block w-full rounded-md px-2.5 py-1.5 text-right text-xs transition ${
              !category ? 'bg-forest-700 text-cream-100' : 'text-ink/70 hover:bg-cream-200'
            }`}
          >
            همه محصولات
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => update({ category: item.slug })}
              className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-right text-xs transition ${
                category === item.slug ? 'bg-forest-700 text-cream-100' : 'text-ink/70 hover:bg-cream-200'
              }`}
            >
              <span>{item.name}</span>
              <span className="num text-[10px] opacity-70">{faNums(item.productCount || 0)}</span>
            </button>
          ))}
        </div>
      </div>

      {colors.length > 0 && (
        <div>
          <p className="label">رنگ</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((facet) => (
              <button
                key={facet.hex}
                type="button"
                title={`${facet.name} (${facet.count})`}
                onClick={() => update({ color: color === facet.hex ? null : facet.hex })}
                className={`h-7 w-7 rounded-full border shadow-sm transition ${
                  color === facet.hex ? 'border-gold-500 ring-2 ring-gold-300' : 'border-black/10 hover:scale-105'
                }`}
                style={{ backgroundColor: facet.hex }}
              />
            ))}
          </div>
        </div>
      )}

      <button type="button" onClick={() => setParams(new URLSearchParams())} className="btn-outline btn-sm w-full">
        حذف همه فیلترها
      </button>
    </div>
  );

  return (
    <>
      <Seo
        title={activeCategory ? `${activeCategory.name} | فروشگاه` : 'فروشگاه پارچه'}
        description={activeCategory?.description || 'خرید پارچه مانتویی، مجلسی، کت‌وشلواری، نخی، جین، پرده‌ای و مبلی.'}
      />

      <div className="border-b border-gold-200/60 bg-cream-200/50">
        <div className="container-page py-6">
          <nav className="mb-2 flex items-center gap-1.5 text-[11px] text-ink/50">
            <Link to="/" className="hover:text-gold-600">خانه</Link>
            <span>/</span>
            <span className="text-forest-700">{activeCategory ? activeCategory.name : 'فروشگاه'}</span>
          </nav>
          <h1 className="text-xl font-extrabold text-forest-700 md:text-2xl">
            {activeCategory ? activeCategory.name : q ? `نتایج جست‌وجو: ${q}` : 'همه پارچه‌ها'}
          </h1>
          <p className="mt-1 text-xs text-ink/55">
            {faNums(total)} محصول{activeCategory?.description ? ` — ${activeCategory.description}` : ''}
          </p>
        </div>
      </div>

      <div className="container-page grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-[132px] p-4">{filterPanel}</div>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="btn-outline btn-sm lg:hidden"
            >
              فیلترها
              <IconChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="mr-auto flex items-center gap-2">
              <span className="text-[11px] text-ink/50">مرتب‌سازی:</span>
              <select
                value={sort}
                onChange={(event) => update({ sort: event.target.value })}
                className="input !w-auto !py-1.5 text-xs"
              >
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtersOpen && <div className="card mb-4 p-4 lg:hidden">{filterPanel}</div>}

          {error && <ErrorBox message={error} />}

          {loading ? (
            <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="محصولی با این مشخصات پیدا نشد"
              description="می‌توانید فیلترها را تغییر دهید یا نام دیگری جست‌وجو کنید."
              action={
                <button type="button" onClick={() => setParams(new URLSearchParams())} className="btn-primary btn-sm">
                  نمایش همه پارچه‌ها
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => update({ page: String(page - 1) })}
                    className="btn-outline btn-sm disabled:opacity-40"
                  >
                    قبلی
                  </button>
                  {Array.from({ length: pages }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => update({ page: String(index + 1) })}
                      className={`num h-9 min-w-9 rounded-md border px-2 text-xs font-semibold transition ${
                        page === index + 1
                          ? 'border-forest-700 bg-forest-700 text-cream-100'
                          : 'border-gold-200 bg-cream-50 text-forest-700 hover:border-gold-400'
                      }`}
                    >
                      {faNums(index + 1)}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={page >= pages}
                    onClick={() => update({ page: String(page + 1) })}
                    className="btn-outline btn-sm disabled:opacity-40"
                  >
                    بعدی
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
