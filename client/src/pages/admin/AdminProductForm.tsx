import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, errMessage } from '../../lib/api';
import type { Category } from '../../lib/types';
import { useToast } from '../../context/ToastContext';
import { Seo } from '../../components/ui/Seo';
import { ErrorBox, Spinner } from '../../components/ui/States';
import { IconPlus, IconTrash } from '../../components/ui/Icons';

type ColorForm = { name: string; hex: string; image: string };

type FormState = {
  name: string;
  slug: string;
  categoryId: string;
  price: string;
  salePrice: string;
  shortDescription: string;
  description: string;
  texture: string;
  stock: string;
  minQty: string;
  unit: string;
  sku: string;
  isActive: boolean;
  isAvailable: boolean;
  showOnHome: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  sortOrder: string;
  images: string[];
  colors: ColorForm[];
};

const EMPTY: FormState = {
  name: '',
  slug: '',
  categoryId: '',
  price: '',
  salePrice: '',
  shortDescription: '',
  description: '',
  texture: '',
  stock: '0',
  minQty: '1',
  unit: 'متر',
  sku: '',
  isActive: true,
  isAvailable: true,
  showOnHome: true,
  isNew: false,
  isBestSeller: false,
  sortOrder: '0',
  images: [],
  colors: [],
};

export function AdminProductForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const catData = await api<{ categories: Category[] }>('/admin/categories');
        if (!alive) return;
        setCategories(catData.categories);
        if (isNew) {
          setForm((current) => ({ ...current, categoryId: catData.categories[0]?.id || '' }));
        } else {
          const data = await api<{ product: any }>(`/admin/products/${id}`);
          if (!alive) return;
          const p = data.product;
          setForm({
            name: p.name,
            slug: p.slug,
            categoryId: p.categoryId,
            price: p.price == null ? '' : String(p.price),
            salePrice: p.salePrice == null ? '' : String(p.salePrice),
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            texture: p.texture || '',
            stock: String(p.stock),
            minQty: String(p.minQty),
            unit: p.unit,
            sku: p.sku || '',
            isActive: p.isActive,
            isAvailable: p.isAvailable,
            showOnHome: p.showOnHome,
            isNew: p.isNew,
            isBestSeller: p.isBestSeller,
            sortOrder: String(p.sortOrder),
            images: p.images.map((image: { url: string }) => image.url),
            colors: p.colors.map((color: { name: string; hex: string; image: string | null }) => ({
              name: color.name,
              hex: color.hex,
              image: color.image || '',
            })),
          });
        }
      } catch (err) {
        setError(errMessage(err));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, isNew]);

  const upload = async (file: File, onDone: (url: string) => void) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const data = await api<{ url: string }>('/admin/upload', { method: 'POST', body });
      onDone(data.url);
    } catch (err) {
      push(errMessage(err), 'error');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body = {
        ...form,
        price: form.price === '' ? null : Number(form.price),
        salePrice: form.salePrice === '' ? null : Number(form.salePrice),
        stock: Number(form.stock) || 0,
        minQty: Number(form.minQty) || 1,
        sortOrder: Number(form.sortOrder) || 0,
        images: form.images.filter(Boolean).map((url) => ({ url })),
        colors: form.colors
          .filter((color) => color.name.trim())
          .map((color) => ({ name: color.name, hex: color.hex, image: color.image })),
      };
      if (isNew) {
        await api('/admin/products', { method: 'POST', body });
        push('محصول جدید ایجاد شد.');
      } else {
        await api(`/admin/products/${id}`, { method: 'PATCH', body });
        push('تغییرات محصول ذخیره شد.');
      }
      navigate('/admin/products');
    } catch (err) {
      setError(errMessage(err));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <Seo title={isNew ? 'افزودن محصول' : 'ویرایش محصول'} />
      <form onSubmit={submit} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-base font-extrabold text-forest-700">{isNew ? 'افزودن محصول جدید' : 'ویرایش محصول'}</h1>
          <div className="flex gap-2">
            <Link to="/admin/products" className="btn-outline btn-sm">بازگشت</Link>
            <button type="submit" disabled={saving} className="btn-primary btn-sm">
              {saving ? 'در حال ذخیره…' : 'ذخیره محصول'}
            </button>
          </div>
        </div>

        {error && <ErrorBox message={error} />}

        <div className="card grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <label className="label">نام محصول *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">دسته‌بندی *</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="input"
            >
              <option value="">انتخاب کنید…</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">آدرس یکتا (slug)</label>
            <input dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input" placeholder="خالی بگذارید تا خودکار ساخته شود" />
          </div>
          <div>
            <label className="label">شناسه محصول (SKU)</label>
            <input dir="ltr" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">قیمت اصلی</label>
            <input
              inputMode="numeric"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input num"
              placeholder="خالی = قیمت ثبت نشده"
            />
            <p className="hint">خالی بگذارید تا قیمت نمایش داده نشود و خرید غیرفعال بماند.</p>
          </div>
          <div>
            <label className="label">قیمت با تخفیف</label>
            <input
              inputMode="numeric"
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
              className="input num"
              placeholder="اختیاری"
            />
            <p className="hint">باید کمتر از قیمت اصلی باشد.</p>
          </div>
          <div>
            <label className="label">واحد فروش</label>
            <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">حداقل مقدار سفارش</label>
            <input
              inputMode="decimal"
              value={form.minQty}
              onChange={(e) => setForm({ ...form, minQty: e.target.value })}
              className="input num"
            />
          </div>
          <div>
            <label className="label">موجودی انبار</label>
            <input
              inputMode="decimal"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="input num"
            />
          </div>
          <div>
            <label className="label">نوع طرح و بافت</label>
            <input value={form.texture} onChange={(e) => setForm({ ...form, texture: e.target.value })} className="input" placeholder="مثلاً: ساتن براق و نرم" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">توضیح کوتاه</label>
            <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">توضیحات کامل</label>
            <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">ترتیب نمایش</label>
            <input inputMode="numeric" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="input num" />
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-3 text-sm font-bold text-forest-700">وضعیت نمایش</h2>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ['isActive', 'فعال در فروشگاه'],
                ['isAvailable', 'موجود برای فروش'],
                ['showOnHome', 'نمایش در صفحه اصلی'],
                ['isNew', 'برچسب محصول جدید'],
                ['isBestSeller', 'محصول پرفروش'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-center gap-2 rounded-lg border border-cream-300 px-3 py-2 text-xs">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  className="accent-forest-700"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-forest-700">تصاویر محصول</h2>
            <label className="btn-outline btn-sm cursor-pointer">
              {uploading ? 'در حال بارگذاری…' : 'بارگذاری تصویر'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void upload(file, (url) => setForm((current) => ({ ...current, images: [...current.images, url] })));
                  event.target.value = '';
                }}
              />
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {form.images.map((url, index) => (
              <div key={`${url}-${index}`} className="flex items-center gap-2 rounded-lg border border-cream-300 p-2">
                <img src={url} alt="" className="h-12 w-10 rounded object-cover" />
                <input
                  dir="ltr"
                  value={url}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      images: current.images.map((item, i) => (i === index ? event.target.value : item)),
                    }))
                  }
                  className="input !py-1.5 text-[11px]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({ ...current, images: current.images.filter((_, i) => i !== index) }))
                  }
                  className="rounded-md border border-cream-300 p-1.5 text-ink/45 hover:border-red-200 hover:text-red-700"
                  aria-label="حذف تصویر"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setForm((current) => ({ ...current, images: [...current.images, ''] }))}
            className="btn-outline btn-sm mt-3"
          >
            <IconPlus className="h-3.5 w-3.5" />
            افزودن آدرس تصویر
          </button>
          <p className="hint">اولین تصویر، تصویر اصلی کارت محصول است.</p>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-forest-700">رنگ‌های موجود</h2>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, colors: [...current.colors, { name: '', hex: '#1A3A34', image: '' }] }))}
              className="btn-outline btn-sm"
            >
              <IconPlus className="h-3.5 w-3.5" />
              افزودن رنگ
            </button>
          </div>
          <div className="space-y-2">
            {form.colors.map((color, index) => (
              <div key={index} className="grid gap-2 rounded-lg border border-cream-300 p-2 sm:grid-cols-[1fr_100px_1fr_auto_auto]">
                <input
                  placeholder="نام رنگ"
                  value={color.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      colors: current.colors.map((item, i) => (i === index ? { ...item, name: event.target.value } : item)),
                    }))
                  }
                  className="input !py-1.5 text-xs"
                />
                <input
                  type="color"
                  value={color.hex}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      colors: current.colors.map((item, i) => (i === index ? { ...item, hex: event.target.value } : item)),
                    }))
                  }
                  className="h-9 w-full cursor-pointer rounded border border-cream-300 bg-cream-50 p-1"
                />
                <input
                  dir="ltr"
                  placeholder="آدرس تصویر این رنگ (اختیاری)"
                  value={color.image}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      colors: current.colors.map((item, i) => (i === index ? { ...item, image: event.target.value } : item)),
                    }))
                  }
                  className="input !py-1.5 text-[11px]"
                />
                <label className="btn-outline btn-sm cursor-pointer !px-2">
                  تصویر
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file)
                        void upload(file, (url) =>
                          setForm((current) => ({
                            ...current,
                            colors: current.colors.map((item, i) => (i === index ? { ...item, image: url } : item)),
                            images: current.images.includes(url) ? current.images : [...current.images, url],
                          }))
                        );
                      event.target.value = '';
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({ ...current, colors: current.colors.filter((_, i) => i !== index) }))
                  }
                  className="rounded-md border border-cream-300 p-1.5 text-ink/45 hover:border-red-200 hover:text-red-700"
                  aria-label="حذف رنگ"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {form.colors.length === 0 && <p className="text-xs text-ink/45">برای این محصول رنگی ثبت نشده است.</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link to="/admin/products" className="btn-outline btn-sm">انصراف</Link>
          <button type="submit" disabled={saving} className="btn-primary btn-sm">
            {saving ? 'در حال ذخیره…' : 'ذخیره محصول'}
          </button>
        </div>
      </form>
    </>
  );
}
