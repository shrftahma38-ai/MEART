import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import type { Order } from '../../lib/types';
import { useSettings } from '../../context/SettingsContext';
import { Seo } from '../../components/ui/Seo';
import { Spinner } from '../../components/ui/States';
import { faDateTime, faNums, ORDER_STATUS, PAYMENT_STATUS, priceLabel } from '../../lib/format';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export function AdminOrders() {
  const { settings } = useSettings();
  const [params, setParams] = useSearchParams();
  const status = params.get('status') || '';
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState(params.get('q') || '');

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (status) query.set('status', status);
    const q = params.get('q') || '';
    if (q) query.set('q', q);
    api<{ orders: Order[] }>(`/admin/orders?${query}`)
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, [status, params.get('q')]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  return (
    <>
      <Seo title="مدیریت سفارش‌ها" />
      <div className="space-y-4">
        <h1 className="text-base font-extrabold text-forest-700">سفارش‌ها ({faNums(orders.length)})</h1>

        <div className="card flex flex-wrap items-end gap-3 p-4">
          <form
            className="flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              setParam('q', term.trim());
            }}
          >
            <label className="label">جست‌وجو (شماره سفارش، نام یا تلفن)</label>
            <input value={term} onChange={(event) => setTerm(event.target.value)} className="input" />
          </form>
          <div>
            <label className="label">وضعیت</label>
            <select value={status} onChange={(event) => setParam('status', event.target.value)} className="input !w-48">
              <option value="">همه وضعیت‌ها</option>
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {ORDER_STATUS[value]?.label || value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="card overflow-x-auto">
            <table className="table-basic">
              <thead>
                <tr>
                  <th>شماره</th>
                  <th>مشتری</th>
                  <th>تماس</th>
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
                  const orderStatus = ORDER_STATUS[order.status] || { label: order.status, className: 'badge-muted' };
                  const payment = PAYMENT_STATUS[order.paymentStatus] || { label: order.paymentStatus, className: 'badge-muted' };
                  return (
                    <tr key={order.id}>
                      <td className="num text-xs" dir="ltr">{order.number}</td>
                      <td className="text-xs">{order.customerName}</td>
                      <td className="num text-xs">{order.phone}</td>
                      <td className="text-[11px] text-ink/55">{faDateTime(order.createdAt)}</td>
                      <td className="num text-xs">{faNums(order.items.length)}</td>
                      <td className="num text-xs font-semibold text-forest-700">{priceLabel(order.total, settings.currency)}</td>
                      <td><span className={orderStatus.className}>{orderStatus.label}</span></td>
                      <td><span className={payment.className}>{payment.label}</span></td>
                      <td>
                        <Link to={`/admin/orders/${order.id}`} className="link-gold text-xs font-semibold">
                          مدیریت
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.length === 0 && <p className="px-4 py-8 text-center text-xs text-ink/50">سفارشی یافت نشد.</p>}
          </div>
        )}
      </div>
    </>
  );
}
