import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { Seo } from '../components/ui/Seo';
import { EmptyState, Spinner } from '../components/ui/States';
import { IconMinus, IconPlus, IconTrash } from '../components/ui/Icons';
import { faNums, faQty, priceLabel } from '../lib/format';

export function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const { settings } = useSettings();
  const stepFor = (unit: string) => (unit === 'متر' ? 0.5 : 1);

  return (
    <>
      <Seo title="سبد خرید" description="بازبینی پارچه‌های انتخابی و ثبت سفارش." />
      <div className="container-page py-8">
        <h1 className="mb-6 text-xl font-extrabold text-forest-700 md:text-2xl">سبد خرید</h1>

        {loading ? (
          <Spinner />
        ) : cart.items.length === 0 ? (
          <EmptyState
            title="سبد خرید شما خالی است"
            description="پارچه‌های مورد نظرتان را از فروشگاه انتخاب کنید و به سبد خرید اضافه کنید."
            action={
              <Link to="/shop" className="btn-primary btn-sm">
                رفتن به فروشگاه
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="card divide-y divide-cream-300/70 overflow-hidden">
              {cart.items.map((line) => (
                <div key={line.id} className="flex flex-wrap items-start gap-4 p-4">
                  <Link to={`/product/${line.slug}`} className="shrink-0">
                    <img
                      src={line.image || '/media/hero.jpg'}
                      alt={line.name}
                      className="h-24 w-20 rounded-md border border-cream-300 object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${line.slug}`} className="text-sm font-bold text-forest-700 hover:text-gold-600">
                      {line.name}
                    </Link>
                    <p className="mt-1 text-[11px] text-ink/55">
                      {line.colorName ? `رنگ: ${line.colorName}` : 'بدون انتخاب رنگ'} — واحد: {line.unit}
                    </p>
                    <p className="mt-1.5 text-xs font-semibold text-gold-700">
                      {priceLabel(line.unitPrice, settings.currency)}
                    </p>
                    {line.issue && <p className="mt-1.5 text-[11px] text-red-700">{line.issue}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-lg border border-cream-300 bg-cream-50">
                      <button
                        type="button"
                        onClick={() => updateItem(line.id, Number((line.quantity + stepFor(line.unit)).toFixed(2)))}
                        className="px-2 py-1.5 text-forest-700 hover:text-gold-600"
                        aria-label="افزایش"
                      >
                        <IconPlus className="h-3.5 w-3.5" />
                      </button>
                      <span className="num w-12 border-x border-cream-300 py-1.5 text-center text-xs">
                        {faQty(line.quantity)}
                      </span>
                      <button
                        type="button"
                        disabled={line.quantity <= line.minQty}
                        onClick={() => updateItem(line.id, Number((line.quantity - stepFor(line.unit)).toFixed(2)))}
                        className="px-2 py-1.5 text-forest-700 hover:text-gold-600 disabled:opacity-30"
                        aria-label="کاهش"
                      >
                        <IconMinus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.id)}
                      className="rounded-md border border-cream-300 p-2 text-ink/50 transition hover:border-red-200 hover:text-red-700"
                      aria-label="حذف"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="num w-24 text-left text-sm font-bold text-forest-700">
                    {priceLabel(line.lineTotal, settings.currency) || '—'}
                  </div>
                </div>
              ))}
            </div>

            <aside className="card h-fit p-5">
              <h2 className="mb-4 text-sm font-bold text-forest-700">خلاصه سفارش</h2>
              <dl className="space-y-2.5 text-xs">
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
                {cart.freeShippingThreshold > 0 && cart.subtotal < cart.freeShippingThreshold && (
                  <p className="rounded-md bg-gold-100/60 px-2.5 py-2 text-[11px] leading-5 text-gold-700">
                    با خرید {priceLabel(cart.freeShippingThreshold - cart.subtotal, settings.currency)} دیگر، ارسال
                    سفارش شما رایگان می‌شود.
                  </p>
                )}
                <div className="flex items-center justify-between border-t border-cream-300 pt-3 text-sm">
                  <dt className="font-bold text-forest-700">مبلغ قابل پرداخت</dt>
                  <dd className="num font-extrabold text-forest-700">{priceLabel(cart.total, settings.currency)}</dd>
                </div>
              </dl>

              {cart.hasBlockingIssue && (
                <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-[11px] leading-5 text-red-800">
                  برخی اقلام سبد خرید قابل سفارش نیستند. لطفاً آن‌ها را حذف یا مقدارشان را اصلاح کنید.
                </p>
              )}

              <Link
                to="/checkout"
                aria-disabled={cart.hasBlockingIssue}
                onClick={(event) => cart.hasBlockingIssue && event.preventDefault()}
                className={`btn-primary mt-4 w-full ${cart.hasBlockingIssue ? 'pointer-events-none opacity-50' : ''}`}
              >
                ادامه و ثبت سفارش
              </Link>
              <Link to="/shop" className="btn-outline btn-sm mt-2 w-full">
                ادامه خرید
              </Link>
              <p className="mt-3 text-center text-[11px] text-ink/45">
                تعداد اقلام: <span className="num">{faNums(cart.count)}</span>
              </p>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
