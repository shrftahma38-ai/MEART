import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errMessage } from '../lib/api';
import type { Order } from '../lib/types';
import { Seo } from '../components/ui/Seo';
import { OrderCard } from '../components/order/OrderCard';
import { ErrorBox } from '../components/ui/States';
import { useSettings } from '../context/SettingsContext';

export function TrackOrder() {
  const { settings } = useSettings();
  const [number, setNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);
    try {
      const data = await api<{ order: Order }>(
        `/orders/track?number=${encodeURIComponent(number.trim())}&phone=${encodeURIComponent(phone.trim())}`
      );
      setOrder(data.order);
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="پیگیری سفارش" description="وضعیت سفارش خود را با شماره سفارش و شماره تماس پیگیری کنید." />
      <div className="container-page max-w-3xl py-10">
        <h1 className="mb-2 text-xl font-extrabold text-forest-700 md:text-2xl">پیگیری سفارش</h1>
        <p className="mb-6 text-xs leading-6 text-ink/55">
          شماره سفارش و شماره تماسی که در هنگام ثبت سفارش وارد کرده‌اید را وارد کنید.
        </p>

        <form onSubmit={submit} className="card grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="label" htmlFor="number">شماره سفارش</label>
            <input
              id="number"
              required
              dir="ltr"
              placeholder="AZ-20261026-1234"
              value={number}
              onChange={(event) => setNumber(event.target.value)}
              className="input num"
            />
          </div>
          <div>
            <label className="label" htmlFor="trackPhone">شماره تماس</label>
            <input
              id="trackPhone"
              required
              inputMode="numeric"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="input num"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary self-end">
            {loading ? 'در حال بررسی…' : 'مشاهده وضعیت'}
          </button>
        </form>

        {error && (
          <div className="mt-4">
            <ErrorBox message={error} />
          </div>
        )}

        {order && (
          <div className="mt-6">
            <OrderCard order={order} currency={settings.currency} />
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-ink/45">
          اگر شماره سفارش را ندارید،{' '}
          <Link to="/login" className="link-gold">
            وارد حساب کاربری
          </Link>{' '}
          شوید و از بخش سفارش‌های من پیگیری کنید.
        </p>
      </div>
    </>
  );
}
