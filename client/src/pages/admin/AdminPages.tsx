import { useEffect, useState } from 'react';
import { api, errMessage } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { Seo } from '../../components/ui/Seo';
import { Spinner } from '../../components/ui/States';
import type { StorePage } from '../../lib/types';

export function AdminPages() {
  const { push } = useToast();
  const [pages, setPages] = useState<StorePage[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });

  useEffect(() => {
    api<{ pages: StorePage[] }>('/admin/pages')
      .then((data) => {
        setPages(data.pages);
        const first = data.pages[0];
        if (first) {
          setActiveId(first.id);
          setForm({ title: first.title, body: first.body });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const select = (page: StorePage) => {
    setActiveId(page.id);
    setForm({ title: page.title, body: page.body });
  };

  const save = async () => {
    setSaving(true);
    try {
      await api(`/admin/pages/${activeId}`, { method: 'PATCH', body: form });
      setPages((current) => current.map((page) => (page.id === activeId ? { ...page, ...form } : page)));
      push('محتوای صفحه ذخیره شد.');
    } catch (err) {
      push(errMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <Seo title="مدیریت صفحات سایت" />
      <div className="space-y-4">
        <h1 className="text-base font-extrabold text-forest-700">صفحات سایت</h1>

        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <aside className="card h-fit p-2">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => select(page)}
                className={`block w-full rounded-lg px-3 py-2 text-right text-xs font-semibold transition ${
                  activeId === page.id ? 'bg-forest-700 text-cream-100' : 'text-ink/70 hover:bg-cream-200'
                }`}
              >
                {page.title}
              </button>
            ))}
          </aside>

          <div className="card space-y-4 p-5">
            <div>
              <label className="label">عنوان صفحه</label>
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="input" />
            </div>
            <div>
              <label className="label">متن صفحه</label>
              <textarea
                rows={16}
                value={form.body}
                onChange={(event) => setForm({ ...form, body: event.target.value })}
                className="input leading-7"
              />
              <p className="hint">هر خط، یک پاراگراف نمایش داده می‌شود. برای جدایی بخش‌ها یک خط خالی بگذارید.</p>
            </div>
            <button type="button" onClick={save} disabled={saving} className="btn-primary btn-sm">
              {saving ? 'در حال ذخیره…' : 'ذخیره صفحه'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
