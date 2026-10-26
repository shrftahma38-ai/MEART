import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { errMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Seo } from '../components/ui/Seo';
import { ErrorBox } from '../components/ui/States';

export function Login() {
  const { login } = useAuth();
  const { refresh: refreshCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email.trim(), form.password);
      await refreshCart();
      navigate(from || (user.role === 'ADMIN' ? '/admin' : '/account'), { replace: true });
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="ورود به حساب کاربری" />
      <div className="container-page flex justify-center py-12">
        <div className="card w-full max-w-md p-6">
          <h1 className="text-lg font-extrabold text-forest-700">ورود به حساب کاربری</h1>
          <p className="mt-1.5 text-xs leading-6 text-ink/55">
            برای مشاهده سفارش‌ها و پیگیری خرید، وارد حساب خود شوید.
          </p>

          <form onSubmit={submit} className="mt-5 space-y-4">
            {error && <ErrorBox message={error} />}
            <div>
              <label className="label" htmlFor="email">ایمیل</label>
              <input
                id="email"
                type="email"
                required
                dir="ltr"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">رمز عبور</label>
              <input
                id="password"
                type="password"
                required
                dir="ltr"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="input"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'در حال ورود…' : 'ورود'}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-ink/55">
            حساب کاربری ندارید؟{' '}
            <Link to="/register" className="link-gold font-semibold">
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
