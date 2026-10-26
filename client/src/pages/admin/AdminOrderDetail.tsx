import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, errMessage } from '../../lib/api';
import type { Order } from '../../lib/types';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { Seo } from '../../components/ui/Seo';
import { ErrorBox, Spinner } from '../../components/ui/States';
import { faDateTime, faNums, ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS, priceLabel } from '../../lib/format';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PAYMENTS = ['UNPAID', 'AWAITING', 'PAID', 'FAILED', 'REFUNDED'];

export function AdminOrderDetail() {
  const { id } = useParams();
  const { settings } = useSettings();
  const { push } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ status: 'PENDING', paymentStatus: 'UNPAID', shippingCost: '0', note: '' });

  useEffect(() => {
    api<{ order: Order & { note?: string } }>(`/admin/orders/${id}`)
      .then((data) => {
        setOrder(data.order);
        setForm({
          status: data.order.status,
          paymentStatus: data.order.paymentStatus,
          shippingCost: String(data.order.shippingCost),
          note: data.order.note || '',
        });
      })
      .catch((err) => setError(errMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      const data = await api<{ order: Order }>(`/admin/orders/${id}`, {
        method: 'PATCH',
        body: { status: form.status, paymentStatus: form.paymentStatus, shippingCost: Number(form.shippingCost) || 0 },
      });
      setOrder(data.order);
      push('سفارش به‌روزرسانی شد.');
    } catch (err) {
      push(errMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;
  if (!order) return null;

  return (
    <>
      <Seo title={`مدیریت سفارش ${order.number}`} />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <Link to="/admin/orders" className="text-[11px] text-gold-600">→ بازگشت به سفارش‌ها</Link>
            <h1 className="num mt-1 text-base font-extrabold text-forest-700" dir="ltr">{order.number}</h1>
            <p className="text-[11px] text-ink/50">{faDateTime(order.createdAt)}</p>
          </div>
          <button type="button" onClick={save} disabled={saving} className="btn-primary btn-sm">
            {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="card overflow-hidden">
              <h2 className="border-b border-cream-300/70 px-4 py-3 text-sm font-bold text-forest-700">اقلام سفارش</h2>
              <ul className="divide-y divide-cream-300/60">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3 text-xs">
                    <img src={item.image || '/media/hero.jpg'} alt="" className="h-14 w-12 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-forest-700">{item.name}</p>
                      <p className="text-[11px] text-ink/50">
                        {item.colorName ? `${item.colorName} — ` : ''}
                        <span className="num">{faNums(item.quantity)}</span> {item.unit} × {priceLabel(item.unitPrice, settings.currency)}
                      </p>
                    </div>
                    <span className="num font-semibold text-forest-700">{priceLabel(item.lineTotal, settings.currency)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-cream-300/70 bg-cream-200/40 px-4 py-3 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-ink/55">جمع کالاها</span>
                  <span className="num font-semibold">{priceLabel(order.subtotal, settings.currency)}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-ink/55">هزینه ارسال</span>
                  <span className="num font-semibold">{priceLabel(order.shippingCost, settings.currency)}</span>
                </div>
                <div className="flex justify-between border-t border-cream-300 pt-1.5 text-sm">
                  <span className="font-bold text-forest-700">مبلغ کل</span>
                  <span className="num font-extrabold text-forest-700">{priceLabel(order.total, settings.currency)}</span>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h2 className="mb-3 text-sm font-bold text-forest-700">اطلاعات مشتری و ارسال</h2>
              <dl className="grid gap-2 text-xs sm:grid-cols-2">
                <div><dt className="text-ink/45">نام</dt><dd className="font-semibold text-forest-700">{order.customerName}</dd></div>
                <div><dt className="text-ink/45">تماس</dt><dd className="num font-semibold text-forest-700">{order.phone}</dd></div>
                <div><dt className="text-ink/45">ایمیل</dt><dd dir="ltr" className="text-forest-700">{order.email || '—'}</dd></div>
                <div><dt className="text-ink/45">کد پستی</dt><dd className="num text-forest-700">{order.postalCode || '—'}</dd></div>
                <div className="sm:col-span-2">
                  <dt className="text-ink/45">نشانی</dt>
                  <dd className="leading-6 text-forest-700">
                    {[order.province, order.city, order.address].filter(Boolean).join('، ')}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-ink/45">روش پرداخت</dt>
                  <dd className="text-forest-700">{PAYMENT_METHOD[order.paymentMethod] || order.paymentMethod}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="card h-fit space-y-4 p-4">
            <div>
              <label className="label">وضعیت سفارش</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
                {STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {ORDER_STATUS[value]?.label || value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">وضعیت پرداخت</label>
              <select value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })} className="input">
                {PAYMENTS.map((value) => (
                  <option key={value} value={value}>
                    {PAYMENT_STATUS[value]?.label || value}
                  </option>
                ))}
              </select>
              <p className="hint">وضعیت پرداخت را فقط بر اساس تأیید واقعی پرداخت تغییر دهید.</p>
            </div>
            <div>
              <label className="label">هزینه ارسال</label>
              <input
                inputMode="numeric"
                value={form.shippingCost}
                onChange={(e) => setForm({ ...form, shippingCost: e.target.value })}
                className="input num"
              />
            </div>
            {order.note && (
              <div className="rounded-md bg-cream-200/60 px-3 py-2 text-[11px] leading-5 text-ink/60">
                <span className="block font-semibold text-forest-700">توضیحات مشتری</span>
                {order.note}
              </div>
            )}
            <button type="button" onClick={save} disabled={saving} className="btn-primary w-full">
              {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
