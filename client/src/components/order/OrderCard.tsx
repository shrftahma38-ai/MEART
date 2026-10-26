import type { Order } from '../../lib/types';
import { faDateTime, faDigits, faNums, ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS, priceLabel } from '../../lib/format';

export function OrderCard({ order, currency = 'تومان' }: { order: Order; currency?: string }) {
  const status = ORDER_STATUS[order.status] || { label: order.status, className: 'badge-muted' };
  const payment = PAYMENT_STATUS[order.paymentStatus] || { label: order.paymentStatus, className: 'badge-muted' };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-300/70 bg-cream-200/40 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-forest-700">سفارش</span>
          <span className="num text-ink/70" dir="ltr">{order.number}</span>
          <span className={status.className}>{status.label}</span>
          <span className={payment.className}>{payment.label}</span>
        </div>
        <span className="text-[11px] text-ink/50">{faDateTime(order.createdAt)}</span>
      </div>

      <ul className="divide-y divide-cream-300/60">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 px-4 py-3">
            <img src={item.image || '/media/hero.jpg'} alt="" className="h-14 w-12 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-forest-700">{item.name}</p>
              <p className="mt-0.5 text-[11px] text-ink/50">
                {item.colorName ? `${item.colorName} — ` : ''}
                <span className="num">{faNums(item.quantity)}</span> {item.unit} × {priceLabel(item.unitPrice, currency)}
              </p>
            </div>
            <span className="num shrink-0 text-xs font-semibold text-forest-700">{priceLabel(item.lineTotal, currency)}</span>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 border-t border-cream-300/70 px-4 py-4 text-[11px] sm:grid-cols-2">
        <div className="space-y-1.5 leading-6 text-ink/65">
          <p>
            <span className="text-ink/45">مشتری: </span>
            {order.customerName}
          </p>
          <p>
            <span className="text-ink/45">تماس: </span>
            <span className="num">{faDigits(order.phone)}</span>
          </p>
          <p>
            <span className="text-ink/45">نشانی: </span>
            {[order.province, order.city, order.address].filter(Boolean).join('، ')}
          </p>
          {order.note && (
            <p>
              <span className="text-ink/45">توضیحات: </span>
              {order.note}
            </p>
          )}
          <p>
            <span className="text-ink/45">روش پرداخت: </span>
            {PAYMENT_METHOD[order.paymentMethod] || order.paymentMethod}
          </p>
        </div>

        <dl className="space-y-1.5 self-start rounded-lg bg-cream-200/50 p-3">
          <div className="flex items-center justify-between">
            <dt className="text-ink/55">جمع کالاها</dt>
            <dd className="num font-semibold text-forest-700">{priceLabel(order.subtotal, currency)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-ink/55">هزینه ارسال</dt>
            <dd className="num font-semibold text-forest-700">
              {order.shippingCost === 0 ? 'رایگان' : priceLabel(order.shippingCost, currency)}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-cream-300 pt-1.5 text-xs">
            <dt className="font-bold text-forest-700">مبلغ کل</dt>
            <dd className="num font-extrabold text-forest-700">{priceLabel(order.total, currency)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
