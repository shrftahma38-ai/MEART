import { useEffect, useState } from 'react';
import { api, errMessage } from '../lib/api';
import type { User } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ErrorBox } from '../components/ui/States';
import { Seo } from '../components/ui/Seo';

export function AccountProfile() {
  const { user, setUser } = useAuth();
  const { push } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, phone: user.phone || '', currentPassword: '', newPassword: '' });
  }, [user]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = await api<{ user: User }>('/auth/me', {
        method: 'PATCH',
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          currentPassword: form.currentPassword || undefined,
          newPassword: form.newPassword || undefined,
        },
      });
      setUser(data.user);
      setForm((current) => ({ ...current, currentPassword: '', newPassword: '' }));
      push('اطلاعات حساب شما به‌روزرسانی شد.');
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Seo title="اطلاعات حساب کاربری" />
      <form onSubmit={submit} className="card space-y-4 p-5">
        <h2 className="text-sm font-bold text-forest-700">اطلاعات حساب</h2>
        {error && <ErrorBox message={error} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="accName">نام و نام خانوادگی</label>
            <input
              id="accName"
              required
              minLength={3}
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="accEmail">ایمیل</label>
            <input
              id="accEmail"
              type="email"
              required
              dir="ltr"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="accPhone">شماره همراه</label>
            <input
              id="accPhone"
              inputMode="numeric"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              className="input num"
            />
          </div>
        </div>

        <div className="border-t border-cream-300 pt-4">
          <h3 className="mb-3 text-xs font-bold text-forest-700">تغییر رمز عبور</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="currentPassword">رمز عبور فعلی</label>
              <input
                id="currentPassword"
                type="password"
                dir="ltr"
                value={form.currentPassword}
                onChange={(event) => setForm({ ...form, currentPassword: event.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="newPassword">رمز عبور جدید</label>
              <input
                id="newPassword"
                type="password"
                dir="ltr"
                value={form.newPassword}
                onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
                className="input"
              />
            </div>
          </div>
          <p className="hint">برای تغییر رمز، هر دو فیلد را پر کنید.</p>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
        </button>
      </form>
    </>
  );
}
