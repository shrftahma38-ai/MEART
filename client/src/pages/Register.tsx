import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { errMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Seo } from '../components/ui/Seo';
import { ErrorBox } from '../components/ui/States';

export function Register() {
  const { register } = useAuth();
  const { refresh: refreshCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      });
      await refreshCart();
      navigate('/account', { replace: true });
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="ثبت‌نام" />
      <div className="container-page flex justify-center py-12">
        <div className="card w-full max-w-md p-6">
          <h1 className="text-lg font-extrabold text-forest-700">ایجاد حساب کاربری</h1>
          <p className="mt-1.5 text-xs leading-6 text-ink/55">
            با ثبت‌نام، سفارش‌های خود را پیگیری کنید و خرید سریع‌تری داشته باشید.
          </p>

          <form onSubmit={submit} className="mt-5 space-y-4">
            {error && <ErrorBox message={error} />}
            <div>
              <label className="label" htmlFor="name">نام و نام خانوادگی</label>
              <input
                id="name"
                required
                minLength={3}
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="regEmail">ایمیل</label>
              <input
                id="regEmail"
                type="email"
                required
                dir="ltr"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="regPhone">شماره همراه (اختیاری)</label>
              <input
                id="regPhone"
                inputMode="numeric"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="input num"
              />
            </div>
            <div>
              <label className="label" htmlFor="regPassword">رمز عبور</label>
              <input
                id="regPassword"
                type="password"
                required
                minLength={6}
                dir="ltr"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="input"
              />
              <p className="hint">حداقل ۶ کاراکتر.</p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'در حال ثبت‌نام…' : 'ثبت‌نام'}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-ink/55">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link to="/login" className="link-gold font-semibold">
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
