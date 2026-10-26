import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, errMessage } from '../lib/api';
import type { Order } from '../lib/types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { Seo } from '../components/ui/Seo';
import { EmptyState, ErrorBox, Spinner } from '../components/ui/States';
import { faNums, priceLabel } from '../lib/format';

const PROVINCES = [
  'تهران', 'اصفهان', 'خراسان رضوی', 'فارس', 'آذربایجان شرقی', 'آذربایجان غربی', 'البرز', 'مازندران', 'گیلان',
  'خوزستان', 'کرمان', 'یزد', 'قم', 'همدان', 'کرمانشاه', 'گلستان', 'سیستان و بلوچستان', 'هرمزگان', 'بوشهر',
  'اردبیل', 'زنجان', 'قزوین', 'مرکزی', 'لرستان', 'کردستان', 'چهارمحال و بختیاری', 'کهگیلویه و بویراحمد',
  'سمنان', 'خراسان شمالی', 'خراسان جنوبی', 'ایلام',
];

export function Checkout() {
  const { cart, loading, refresh } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const { push } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    note: '',
    paymentMethod: settings.paymentOnlineEnabled ? 'online' : 'cod',
  });

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        customerName: current.customerName || user.name,
        phone: current.phone || user.phone || '',
        email: current.email || user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!settings.paymentOnlineEnabled && form.paymentMethod === 'online') {
      setForm((current) => ({ ...current, paymentMethod: 'cod' }));
    }
  }, [settings.paymentOnlineEnabled, form.paymentMethod]);

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (cart.items.length === 0) {
      setError('سبد خرید شما خالی است.');
      return;
    }
    setSubmitting(true);
    try {
      const data = await api<{ order: Order }>('/orders', { method: 'POST', body: form });
      await refresh();
      push('سفارش شما با موفقیت ثبت شد.');
      navigate('/order-success', { state: { order: data.order } });
    } catch (err) {
      setError(errMessage(err));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  if (cart.items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="برای ثبت سفارش ابتدا محصولی به سبد خرید اضافه کنید"
          action={<Link to="/shop" className="btn-primary btn-sm">رفتن به فروشگاه</Link>}
        />
      </div>
    );
  }

  return (
    <>
      <Seo title="تسویه‌حساب و ثبت سفارش" description="ثبت اطلاعات ارسال و نهایی کردن سفارش پارچه." />
      <div className="container-page py-8">
        <h1 className="mb-6 text-xl font-extrabold text-forest-700 md:text-2xl">تسویه‌حساب</h1>

        {error && (
          <div className="mb-4">
            <ErrorBox message={error} />
          </div>
        )}

        <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="mb-4 text-sm font-bold text-forest-700">اطلاعات مشتری</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="customerName">نام و نام خانوادگی *</label>
                  <input id="customerName" required value={form.customerName} onChange={set('customerName')} className="input" />
                </div>
                <div>
                  <label className="label" htmlFor="phone">شماره تماس *</label>
                  <input
                    id="phone"
                    required
                    inputMode="numeric"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={form.phone}
                    onChange={set('phone')}
                    className="input num"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="email">ایمیل (اختیاری)</label>
                  <input id="email" type="email" dir="ltr" value={form.email} onChange={set('email')} className="input" />
                </div>
                <div>
                  <label className="label" htmlFor="postalCode">کد پستی (اختیاری)</label>
                  <input id="postalCode" inputMode="numeric" value={form.postalCode} onChange={set('postalCode')} className="input num" />
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="mb-4 text-sm font-bold text-forest-700">نشانی ارسال</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="province">استان *</label>
                  <select id="province" required value={form.province} onChange={set('province')} className="input">
                    <option value="">انتخاب کنید…</option>
                    {PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="city">شهر *</label>
                  <input id="city" required value={form.city} onChange={set('city')} className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="address">نشانی کامل پستی *</label>
                  <textarea id="address" required rows={3} value={form.address} onChange={set('address')} className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="note">توضیحات سفارش (اختیاری)</label>
                  <textarea
                    id="note"
                    rows={2}
                    placeholder="مثلاً: رنگ مورد نظر، ساعت مناسب تماس، توضیح بسته‌بندی…"
                    value={form.note}
                    onChange={set('note')}
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="mb-4 text-sm font-bold text-forest-700">روش پرداخت</h2>
              <div className="space-y-2.5">
                {settings.paymentOnlineEnabled ? (
                  <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-xs transition ${form.paymentMethod === 'online' ? 'border-gold-400 bg-gold-100/40' : 'border-cream-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={form.paymentMethod === 'online'}
                      onChange={set('paymentMethod')}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="block font-bold text-forest-700">پرداخت آنلاین</span>
                      <span className="block text-ink/60">انتقال به درگاه بانکی و پرداخت امن.</span>
                    </span>
                  </label>
                ) : (
                  <div className="rounded-lg border border-dashed border-cream-300 px-3 py-2.5 text-[11px] leading-5 text-ink/50">
                    پرداخت آنلاین هنوز در فروشگاه فعال نشده است. پس از اتصال درگاه بانکی، این روش در همین صفحه فعال
                    می‌شود.
                  </div>
                )}

                {settings.paymentCodEnabled && (
                  <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-xs transition ${form.paymentMethod === 'cod' ? 'border-gold-400 bg-gold-100/40' : 'border-cream-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === 'cod'}
                      onChange={set('paymentMethod')}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="block font-bold text-forest-700">پرداخت در محل / کارت به کارت</span>
                      <span className="block text-ink/60">پس از تأیید سفارش با شما هماهنگ می‌شود.</span>
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <aside className="card h-fit p-5 lg:sticky lg:top-[132px]">
            <h2 className="mb-3 text-sm font-bold text-forest-700">خلاصه سفارش</h2>
            <ul className="mb-4 max-h-64 space-y-2.5 overflow-auto pl-1">
              {cart.items.map((line) => (
                <li key={line.id} className="flex items-center gap-2.5 text-[11px]">
                  <img src={line.image || '/media/hero.jpg'} alt="" className="h-12 w-10 rounded object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-forest-700">{line.name}</span>
                    <span className="block text-ink/50">
                      {line.colorName ? `${line.colorName} — ` : ''}
                      <span className="num">{faNums(line.quantity)}</span> {line.unit}
                    </span>
                  </span>
                  <span className="num shrink-0 font-semibold text-forest-700">
                    {priceLabel(line.lineTotal, settings.currency)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 border-t border-cream-300 pt-3 text-xs">
              <div className="flex items-center justify-between">
                <dt className="text-ink/60">جمع کالاها</dt>
                <dd className="num font-semibold text-forest-700">{priceLabel(cart.subtotal, settings.currency)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink/60">هزینه ارسال</dt>
                <dd className="num font-semibold text-forest-700">
                  {cart.shippingCost === 0 ? 'رایگان' : priceLabel(cart.shippingCost, settings.currency)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-cream-300 pt-2.5 text-sm">
                <dt className="font-bold text-forest-700">مبلغ نهایی</dt>
                <dd className="num font-extrabold text-forest-700">{priceLabel(cart.total, settings.currency)}</dd>
              </div>
            </dl>

            <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full">
              {submitting ? 'در حال ثبت سفارش…' : 'ثبت نهایی سفارش'}
            </button>
            <p className="mt-2.5 text-center text-[10px] leading-5 text-ink/45">
              با ثبت سفارش، قوانین خرید فروشگاه را می‌پذیرید. قیمت و موجودی در همین لحظه دوباره بررسی می‌شود.
            </p>
          </aside>
        </form>
      </div>
    </>
  );
}
