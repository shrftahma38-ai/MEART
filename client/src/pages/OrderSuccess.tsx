import { Link, Navigate, useLocation } from 'react-router-dom';
import type { Order } from '../lib/types';
import { Seo } from '../components/ui/Seo';
import { OrderCard } from '../components/order/OrderCard';
import { useSettings } from '../context/SettingsContext';
import { faDigits } from '../lib/format';

export function OrderSuccess() {
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order;
  const { settings } = useSettings();

  if (!order) return <Navigate to="/track" replace />;

  return (
    <>
      <Seo title="سفارش ثبت شد" />
      <div className="container-page max-w-3xl py-10">
        <div className="card mb-5 p-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-gold-300 bg-gold-100/60 text-2xl text-gold-700">
            ✓
          </div>
          <h1 className="text-lg font-extrabold text-forest-700">سفارش شما با موفقیت ثبت شد</h1>
          <p className="mt-2 text-xs leading-6 text-ink/60">
            شماره سفارش شما{' '}
            <span className="num font-bold text-forest-700" dir="ltr">{order.number}</span> است. برای پیگیری، این شماره
            و شماره تماس <span className="num">{faDigits(order.phone)}</span> را نگه دارید.
          </p>
          <p className="mt-1 text-[11px] text-ink/45">
            پس از بررسی و آماده‌سازی، سفارش شما ارسال می‌شود. وضعیت سفارش را می‌توانید از صفحه پیگیری مشاهده کنید.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/track" className="btn-primary btn-sm">پیگیری سفارش</Link>
            <Link to="/account/orders" className="btn-outline btn-sm">سفارش‌های من</Link>
            <Link to="/shop" className="btn-outline btn-sm">ادامه خرید</Link>
          </div>
        </div>

        <OrderCard order={order} currency={settings.currency} />
      </div>
    </>
  );
}
