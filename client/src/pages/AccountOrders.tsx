import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Order } from '../lib/types';
import { useSettings } from '../context/SettingsContext';
import { EmptyState, ErrorBox, Spinner } from '../components/ui/States';
import { Seo } from '../components/ui/Seo';
import { faDate, faNums, ORDER_STATUS, PAYMENT_STATUS, priceLabel } from '../lib/format';

export function AccountOrders() {
  const { settings } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    api<{ orders: Order[] }>('/auth/orders')
      .then((data) => alive && setOrders(data.orders))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <Seo title="سفارش‌های من" />
      <div className="card p-5">
        <h2 className="mb-4 text-sm font-bold text-forest-700">سفارش‌های من</h2>
        {error && <ErrorBox message={error} />}
        {orders.length === 0 ? (
          <EmptyState title="هنوز سفارشی ثبت نکرده‌اید" action={<Link to="/shop" className="btn-primary btn-sm">مشاهده پارچه‌ها</Link>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-basic">
              <thead>
                <tr>
                  <th>شماره سفارش</th>
                  <th>تاریخ</th>
                  <th>اقلام</th>
                  <th>مبلغ</th>
                  <th>وضعیت</th>
                  <th>پرداخت</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = ORDER_STATUS[order.status] || { label: order.status, className: 'badge-muted' };
                  const payment = PAYMENT_STATUS[order.paymentStatus] || { label: order.paymentStatus, className: 'badge-muted' };
                  return (
                    <tr key={order.id}>
                      <td className="num text-xs" dir="ltr">{order.number}</td>
                      <td className="text-xs text-ink/60">{faDate(order.createdAt)}</td>
                      <td className="num text-xs">{faNums(order.items.length)}</td>
                      <td className="num text-xs font-semibold text-forest-700">{priceLabel(order.total, settings.currency)}</td>
                      <td><span className={status.className}>{status.label}</span></td>
                      <td><span className={payment.className}>{payment.label}</span></td>
                      <td>
                        <Link to={`/account/orders/${order.id}`} className="link-gold text-xs font-semibold">
                          جزئیات
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
