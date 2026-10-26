import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import type { Order } from '../../lib/types';
import { Seo } from '../../components/ui/Seo';
import { useSettings } from '../../context/SettingsContext';
import { faDateTime, faNums, ORDER_STATUS, priceLabel } from '../../lib/format';
import { Spinner } from '../../components/ui/States';

type Stats = {
  products: number;
  withoutPrice: number;
  orders: number;
  pending: number;
  customers: number;
  messages: number;
  revenue: number;
};

export function AdminDashboard() {
  const { settings } = useSettings();
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ stats: Stats; recentOrders: Order[] }>('/admin/stats')
      .then((data) => {
        setStats(data.stats);
        setOrders(data.recentOrders);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { label: 'محصولات', value: stats?.products ?? 0, link: '/admin/products' },
    { label: 'سفارش‌ها', value: stats?.orders ?? 0, link: '/admin/orders' },
    { label: 'در انتظار بررسی', value: stats?.pending ?? 0, link: '/admin/orders?status=PENDING' },
    { label: 'مشتریان', value: stats?.customers ?? 0, link: '/admin/customers' },
    { label: 'فروش پرداخت‌شده', value: priceLabel(stats?.revenue ?? 0, settings.currency) || '', link: '/admin/orders' },
  ];

  return (
    <>
      <Seo title="داشبورد مدیریت" />
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.label} to={card.link} className="card p-4 transition hover:border-gold-300">
              <p className="text-[11px] text-ink/50">{card.label}</p>
              <p className="num mt-1 text-xl font-extrabold text-forest-700">{card.value}</p>
            </Link>
          ))}
        </div>

        {(stats?.withoutPrice ?? 0) > 0 && (
          <Link
            to="/admin/products?filter=no-price"
            className="flex items-center justify-between gap-3 rounded-xl border border-gold-300 bg-gold-100/60 px-4 py-3 text-xs text-gold-700"
          >
            <span>
              <span className="num font-bold">{faNums(stats?.withoutPrice || 0)}</span> محصول هنوز قیمت ندارد و برای
              مشتری قابل خرید نیست.
            </span>
            <span className="shrink-0 font-semibold">ثبت قیمت‌ها ←</span>
          </Link>
        )}

        {(stats?.messages ?? 0) > 0 && (
          <Link
            to="/admin/messages"
            className="flex items-center justify-between gap-3 rounded-xl border border-forest-100 bg-forest-50 px-4 py-3 text-xs text-forest-700"
          >
            <span>
              <span className="num font-bold">{faNums(stats?.messages || 0)}</span> پیام خوانده‌نشده از فرم تماس دارید.
            </span>
            <span className="shrink-0 font-semibold">مشاهده پیام‌ها ←</span>
          </Link>
        )}

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-cream-300/70 px-4 py-3">
            <h2 className="text-sm font-bold text-forest-700">آخرین سفارش‌ها</h2>
            <Link to="/admin/orders" className="text-[11px] font-semibold text-gold-600">همه سفارش‌ها</Link>
          </div>
          {orders.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-ink/50">هنوز سفارشی ثبت نشده است.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-basic">
                <thead>
                  <tr>
                    <th>شماره</th>
                    <th>مشتری</th>
                    <th>تاریخ</th>
                    <th>مبلغ</th>
                    <th>وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const status = ORDER_STATUS[order.status] || { label: order.status, className: 'badge-muted' };
                    return (
                      <tr key={order.id}>
                        <td>
                          <Link to={`/admin/orders/${order.id}`} className="num text-xs font-semibold text-gold-700" dir="ltr">
                            {order.number}
                          </Link>
                        </td>
                        <td className="text-xs">{order.customerName}</td>
                        <td className="text-[11px] text-ink/55">{faDateTime(order.createdAt)}</td>
                        <td className="num text-xs">{priceLabel(order.total, settings.currency)}</td>
                        <td>
                          <span className={status.className}>{status.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
