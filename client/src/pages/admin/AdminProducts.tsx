import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, errMessage } from '../../lib/api';
import type { Category, Product } from '../../lib/types';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { Seo } from '../../components/ui/Seo';
import { ErrorBox, Spinner } from '../../components/ui/States';
import { faNums, faQty, priceLabel } from '../../lib/format';
import { IconSearch, IconTrash } from '../../components/ui/Icons';

export function AdminProducts() {
  const { settings } = useSettings();
  const { push } = useToast();
  const [params, setParams] = useSearchParams();
  const filter = params.get('filter') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState(params.get('q') || '');
  const [drafts, setDrafts] = useState<Record<string, { price: string; salePrice: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (filter) query.set('filter', filter);
      const q = params.get('q') || '';
      if (q) query.set('q', q);
      const data = await api<{ products: Product[]; categories: Category[] }>(`/admin/products?${query}`);
      setProducts(data.products);
      setCategories(data.categories);
      setDrafts(
        Object.fromEntries(
          data.products.map((product) => [
            product.id,
            { price: product.price == null ? '' : String(product.price), salePrice: product.salePrice == null ? '' : String(product.salePrice) },
          ])
        )
      );
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, params.get('q')]);

  const savePrice = async (product: Product) => {
    const draft = drafts[product.id];
    if (!draft) return;
    setSavingId(product.id);
    try {
      await api(`/admin/products/${product.id}/price`, {
        method: 'PATCH',
        body: {
          price: draft.price === '' ? null : Number(draft.price),
          salePrice: draft.salePrice === '' ? null : Number(draft.salePrice),
        },
      });
      push('قیمت محصول به‌روزرسانی شد.');
      await load();
    } catch (err) {
      push(errMessage(err), 'error');
    } finally {
      setSavingId(null);
    }
  };

  const toggleFlag = async (product: Product, key: 'isActive' | 'isBestSeller' | 'isNew' | 'showOnHome' | 'isAvailable') => {
    try {
      await api(`/admin/products/${product.id}`, {
        method: 'PATCH',
        body: {
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          price: product.price,
          salePrice: product.salePrice,
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          texture: product.texture || '',
          stock: product.stock,
          minQty: product.minQty,
          unit: product.unit,
          sku: product.sku || '',
          isActive: key === 'isActive' ? !product.isActive : product.isActive,
          isAvailable: key === 'isAvailable' ? !product.isAvailable : product.isAvailable,
          showOnHome: key === 'showOnHome' ? !product.showOnHome : product.showOnHome,
          isNew: key === 'isNew' ? !product.isNew : product.isNew,
          isBestSeller: key === 'isBestSeller' ? !product.isBestSeller : product.isBestSeller,
          sortOrder: product.sortOrder,
          images: product.images.map((image) => ({ url: image.url })),
          colors: product.colors.map((color) => ({ name: color.name, hex: color.hex, image: color.image || '' })),
        },
      });
      await load();
    } catch (err) {
      push(errMessage(err), 'error');
    }
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`محصول «${product.name}» حذف شود؟ این کار قابل بازگشت نیست.`)) return;
    try {
      await api(`/admin/products/${product.id}`, { method: 'DELETE' });
      push('محصول حذف شد.', 'info');
      await load();
    } catch (err) {
      push(errMessage(err), 'error');
    }
  };

  const setFilter = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set('filter', value);
    else next.delete('filter');
    setParams(next);
  };

  return (
    <>
      <Seo title="مدیریت محصولات" />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-base font-extrabold text-forest-700">محصولات ({faNums(products.length)})</h1>
          <Link to="/admin/products/new" className="btn-primary btn-sm">
            افزودن محصول جدید
          </Link>
        </div>

        <div className="card flex flex-wrap items-end gap-3 p-4">
          <form
            className="flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              const next = new URLSearchParams(params);
              if (term.trim()) next.set('q', term.trim());
              else next.delete('q');
              setParams(next);
            }}
          >
            <label className="label">جست‌وجو</label>
            <div className="relative">
              <input value={term} onChange={(event) => setTerm(event.target.value)} className="input pr-9" placeholder="نام محصول…" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40">
                <IconSearch className="h-4 w-4" />
              </span>
            </div>
          </form>
          <div>
            <label className="label">فیلتر</label>
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="input !w-52">
              <option value="">همه محصولات</option>
              <option value="no-price">بدون قیمت</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>
        </div>

        {error && <ErrorBox message={error} />}

        {loading ? (
          <Spinner />
        ) : (
          <div className="card overflow-x-auto">
            <table className="table-basic">
              <thead>
                <tr>
                  <th>محصول</th>
                  <th>دسته‌بندی</th>
                  <th>قیمت (قابل ویرایش)</th>
                  <th>قیمت تخفیف‌خورده</th>
                  <th>موجودی</th>
                  <th>وضعیت</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const draft = drafts[product.id] || { price: '', salePrice: '' };
                  const dirty =
                    draft.price !== (product.price == null ? '' : String(product.price)) ||
                    draft.salePrice !== (product.salePrice == null ? '' : String(product.salePrice));
                  return (
                    <tr key={product.id} className={product.price == null ? 'bg-gold-100/25' : undefined}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <img
                            src={product.images[0]?.url}
                            alt=""
                            className="h-11 w-9 rounded border border-cream-300 object-cover"
                          />
                          <div className="min-w-0">
                            <Link to={`/admin/products/${product.id}`} className="block truncate text-xs font-bold text-forest-700 hover:text-gold-600">
                              {product.name}
                            </Link>
                            <span className="num block text-[10px] text-ink/45">{product.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-[11px] text-ink/60">{product.category?.name}</td>
                      <td>
                        <input
                          value={draft.price}
                          onChange={(event) =>
                            setDrafts({ ...drafts, [product.id]: { ...draft, price: event.target.value } })
                          }
                          onKeyDown={(event) => event.key === 'Enter' && savePrice(product)}
                          inputMode="numeric"
                          placeholder="ثبت نشده"
                          className={`input num !w-28 !py-1.5 text-xs ${product.price == null ? 'border-gold-400 bg-cream-50' : ''}`}
                        />
                      </td>
                      <td>
                        <input
                          value={draft.salePrice}
                          onChange={(event) =>
                            setDrafts({ ...drafts, [product.id]: { ...draft, salePrice: event.target.value } })
                          }
                          onKeyDown={(event) => event.key === 'Enter' && savePrice(product)}
                          inputMode="numeric"
                          placeholder="—"
                          className="input num !w-24 !py-1.5 text-xs"
                        />
                      </td>
                      <td className="num text-xs">{faQty(product.stock)}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => toggleFlag(product, 'isActive')}
                            className={product.isActive ? 'badge-green' : 'badge-muted'}
                          >
                            {product.isActive ? 'فعال' : 'غیرفعال'}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleFlag(product, 'isAvailable')}
                            className={product.isAvailable ? 'badge-gold' : 'badge-red'}
                          >
                            {product.isAvailable ? 'موجود' : 'ناموجود'}
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={!dirty || savingId === product.id}
                            onClick={() => savePrice(product)}
                            className="btn-primary btn-sm !px-2 !py-1 disabled:opacity-40"
                          >
                            ذخیره
                          </button>
                          <Link to={`/admin/products/${product.id}`} className="btn-outline btn-sm !px-2 !py-1">
                            ویرایش
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(product)}
                            className="rounded-md border border-cream-300 p-1.5 text-ink/45 transition hover:border-red-200 hover:text-red-700"
                            aria-label="حذف"
                          >
                            <IconTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {products.length === 0 && <p className="px-4 py-8 text-center text-xs text-ink/50">محصولی یافت نشد.</p>}
          </div>
        )}

        <p className="text-[11px] leading-6 text-ink/45">
          قیمت‌ها را در همان ردیف وارد کنید و «ذخیره» را بزنید. تا زمانی که قیمت یک محصول ثبت نشود، دکمه خرید آن در
          سایت غیرفعال است. واحد پول: {settings.currency} — مبلغ{' '}
          {priceLabel(0, settings.currency)?.replace('۰', '')} نمونه: ثبت «2850000» یعنی ۲٬۸۵۰٬۰۰۰ {settings.currency}.
        </p>
      </div>
    </>
  );
}
