import { useEffect, useState } from 'react';
import { api, errMessage } from '../../lib/api';
import type { Category } from '../../lib/types';
import { useToast } from '../../context/ToastContext';
import { Seo } from '../../components/ui/Seo';
import { Spinner } from '../../components/ui/States';
import { faNums } from '../../lib/format';
import { IconTrash } from '../../components/ui/Icons';

type CategoryRow = Category & { _count?: { products: number } };

export function AdminCategories() {
  const { push } = useToast();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ name: '', description: '', image: '', sortOrder: '0' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api<{ categories: CategoryRow[] }>('/admin/categories');
      setCategories(data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api('/admin/categories', {
        method: 'POST',
        body: { ...draft, sortOrder: Number(draft.sortOrder) || 0 },
      });
      push('دسته‌بندی ایجاد شد.');
      setDraft({ name: '', description: '', image: '', sortOrder: '0' });
      await load();
    } catch (err) {
      push(errMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const update = async (category: CategoryRow, patch: Partial<CategoryRow>) => {
    try {
      await api(`/admin/categories/${category.id}`, {
        method: 'PATCH',
        body: {
          name: patch.name ?? category.name,
          description: patch.description ?? category.description ?? '',
          image: patch.image ?? category.image ?? '',
          sortOrder: patch.sortOrder ?? category.sortOrder ?? 0,
        },
      });
      push('دسته‌بندی به‌روزرسانی شد.');
      await load();
    } catch (err) {
      push(errMessage(err), 'error');
    }
  };

  const remove = async (category: CategoryRow) => {
    if (!window.confirm(`دسته‌بندی «${category.name}» حذف شود؟`)) return;
    try {
      await api(`/admin/categories/${category.id}`, { method: 'DELETE' });
      push('دسته‌بندی حذف شد.', 'info');
      await load();
    } catch (err) {
      push(errMessage(err), 'error');
    }
  };

  return (
    <>
      <Seo title="مدیریت دسته‌بندی‌ها" />
      <div className="space-y-4">
        <h1 className="text-base font-extrabold text-forest-700">دسته‌بندی‌ها</h1>

        <form onSubmit={create} className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">نام دسته‌بندی *</label>
            <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">توضیح کوتاه</label>
            <input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">آدرس تصویر</label>
            <input dir="ltr" value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className="input" placeholder="/media/categories/…" />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="label">ترتیب</label>
              <input inputMode="numeric" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: e.target.value })} className="input num" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary btn-sm">
              افزودن
            </button>
          </div>
        </form>

        {loading ? (
          <Spinner />
        ) : (
          <div className="card divide-y divide-cream-300/70">
            {categories.map((category) => (
              <div key={category.id} className="grid items-center gap-2.5 p-3 sm:grid-cols-[64px_1fr_1fr_90px_auto]">
                <img src={category.image || '/media/hero.jpg'} alt="" className="h-14 w-16 rounded object-cover" />
                <input
                  defaultValue={category.name}
                  onBlur={(event) => event.target.value !== category.name && update(category, { name: event.target.value })}
                  className="input !py-1.5 text-xs"
                />
                <input
                  defaultValue={category.description || ''}
                  onBlur={(event) => event.target.value !== (category.description || '') && update(category, { description: event.target.value })}
                  className="input !py-1.5 text-[11px]"
                  placeholder="توضیح کوتاه"
                />
                <span className="text-[11px] text-ink/50">
                  <span className="num">{faNums(category._count?.products || 0)}</span> محصول
                </span>
                <button
                  type="button"
                  onClick={() => remove(category)}
                  className="justify-self-end rounded-md border border-cream-300 p-1.5 text-ink/45 transition hover:border-red-200 hover:text-red-700"
                  aria-label="حذف"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] text-ink/45">
          برای ذخیره تغییر نام یا توضیح، از فیلد خارج شوید. دسته‌بندی دارای محصول قابل حذف نیست.
        </p>
      </div>
    </>
  );
}
