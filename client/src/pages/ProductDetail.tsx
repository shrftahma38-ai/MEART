import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Product } from '../lib/types';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { Seo } from '../components/ui/Seo';
import { Price } from '../components/ui/Price';
import { ProductCard } from '../components/product/ProductCard';
import { ErrorBox, Spinner } from '../components/ui/States';
import { IconCart, IconMinus, IconPlus } from '../components/ui/Icons';
import { faNums, faQty, priceLabel } from '../lib/format';

export function ProductDetail() {
  const { slug } = useParams();
  const { settings } = useSettings();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [colorId, setColorId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    api<{ product: Product; related: Product[] }>(`/products/${slug}`)
      .then((data) => {
        if (!alive) return;
        setProduct(data.product);
        setRelated(data.related);
        setActiveImage(data.product.images?.[0]?.url || data.product.colors?.[0]?.image || '');
        setColorId(data.product.colors?.[0]?.id || null);
        setQuantity(data.product.minQty || 1);
        window.scrollTo({ top: 0 });
      })
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [slug]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const urls = product.images?.map((image) => image.url) || [];
    product.colors.forEach((color) => {
      if (color.image && !urls.includes(color.image)) urls.push(color.image);
    });
    return urls;
  }, [product]);

  const step = product?.unit === 'متر' ? 0.5 : 1;
  const hasPrice = product?.effectivePrice != null;
  const inStock = Boolean(product?.isAvailable && (product?.stock || 0) > 0);
  const canBuy = Boolean(product && hasPrice && inStock && product.isActive);
  const selectedColor = product?.colors.find((color) => color.id === colorId);

  const changeQuantity = (delta: number) => {
    const min = product?.minQty || 1;
    setQuantity((current) => Math.max(min, Number((current + delta).toFixed(2))));
  };

  const handleAdd = async () => {
    if (!product || !canBuy) return;
    setBusy(true);
    const ok = await addItem(product.id, colorId, quantity);
    setBusy(false);
    if (ok) setQuantity(product.minQty || 1);
  };

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="container-page py-16">
        <ErrorBox message={error} />
        <Link to="/shop" className="btn-outline mt-4">بازگشت به فروشگاه</Link>
      </div>
    );
  }
  if (!product) return null;

  const specs = [
    { label: 'دسته‌بندی', value: product.category?.name },
    { label: 'نوع طرح و بافت', value: product.texture },
    { label: 'واحد فروش', value: product.unit },
    { label: 'حداقل مقدار سفارش', value: `${faQty(product.minQty)} ${product.unit}` },
    { label: 'شناسه محصول', value: product.sku },
    {
      label: 'رنگ‌های موجود',
      value: product.colors.map((color) => color.name).join('، '),
    },
  ].filter((spec) => spec.value);

  return (
    <>
      <Seo
        title={product.name}
        description={product.shortDescription || `${product.name} — ${product.category?.name} در پارچه‌سرای عرب‌زاده`}
      />

      <div className="border-b border-gold-200/60 bg-cream-200/50">
        <div className="container-page flex flex-wrap items-center gap-1.5 py-4 text-[11px] text-ink/50">
          <Link to="/" className="hover:text-gold-600">خانه</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold-600">فروشگاه</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-gold-600">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-forest-700">{product.name}</span>
        </div>
      </div>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-xl border border-gold-200/70 bg-cream-50 shadow-card">
            <img src={activeImage} alt={product.name} className="aspect-[4/5] w-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto rail-scroll">
              {gallery.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveImage(url)}
                  className={`h-20 w-16 shrink-0 overflow-hidden rounded-md border transition ${
                    activeImage === url ? 'border-gold-500 ring-2 ring-gold-200' : 'border-gold-200 hover:border-gold-400'
                  }`}
                >
                  <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          <div className="card mt-6 p-5">
            <h2 className="mb-3 text-sm font-bold text-forest-700">مشخصات پارچه</h2>
            <dl className="grid gap-x-6 gap-y-2.5 text-xs sm:grid-cols-2">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-start justify-between gap-3 border-b border-dashed border-cream-300/80 pb-2">
                  <dt className="text-ink/50">{spec.label}</dt>
                  <dd className="font-semibold text-forest-700">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {product.description && (
            <div className="card mt-4 p-5">
              <h2 className="mb-3 text-sm font-bold text-forest-700">توضیحات</h2>
              <p className="text-xs leading-7 text-ink/70">{product.description}</p>
            </div>
          )}
        </div>

        <aside className="order-1 lg:order-2">
          <div className="card sticky top-[132px] p-5">
            <h1 className="text-xl font-extrabold text-forest-700 md:text-2xl">{product.name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-ink/50">
              {product.category && (
                <Link to={`/shop?category=${product.category.slug}`} className="hover:text-gold-600">
                  {product.category.name}
                </Link>
              )}
              {product.texture && <span className="badge-gold">{product.texture}</span>}
            </div>

            <div className="mt-4 border-y border-dashed border-cream-300 py-3.5">
              <Price
                price={product.price}
                salePrice={product.salePrice}
                currency={settings.currency}
                size="lg"
              />
              {!hasPrice && (
                <p className="mt-2 rounded-md bg-gold-100/60 px-3 py-2 text-[11px] leading-5 text-gold-700">
                  قیمت این محصول هنوز در فروشگاه ثبت نشده است. برای اطلاع از قیمت با ما تماس بگیرید.
                </p>
              )}
            </div>

            {product.shortDescription && (
              <p className="mt-3 text-xs leading-6 text-ink/65">{product.shortDescription}</p>
            )}

            {product.colors.length > 0 && (
              <div className="mt-4">
                <p className="label">
                  رنگ
                  {selectedColor && <span className="mr-1.5 font-normal text-ink/55">— {selectedColor.name}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      title={color.name}
                      onClick={() => {
                        setColorId(color.id);
                        if (color.image) setActiveImage(color.image);
                      }}
                      className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-[11px] transition ${
                        colorId === color.id
                          ? 'border-gold-500 bg-gold-100/60 font-semibold text-forest-700'
                          : 'border-cream-300 text-ink/65 hover:border-gold-300'
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="label">مقدار سفارش ({product.unit})</p>
                <div className="inline-flex items-center rounded-lg border border-cream-300 bg-cream-50">
                  <button
                    type="button"
                    onClick={() => changeQuantity(step)}
                    className="px-2.5 py-2 text-forest-700 hover:text-gold-600"
                    aria-label="افزایش"
                  >
                    <IconPlus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={product.minQty}
                    step={step}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setQuantity(Number.isFinite(value) && value > 0 ? value : product.minQty);
                    }}
                    className="num w-16 border-x border-cream-300 bg-transparent py-2 text-center text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => changeQuantity(-step)}
                    className="px-2.5 py-2 text-forest-700 hover:text-gold-600"
                    aria-label="کاهش"
                  >
                    <IconMinus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-left text-[11px]">
                <p className="text-ink/50">وضعیت</p>
                <p className={inStock ? 'font-semibold text-forest-600' : 'font-semibold text-red-700'}>
                  {inStock ? `موجود (${faQty(product.stock)} ${product.unit})` : 'ناموجود'}
                </p>
              </div>
            </div>

            <button type="button" onClick={handleAdd} disabled={!canBuy || busy} className="btn-primary mt-5 w-full">
              <IconCart className="h-4 w-4" />
              {busy ? 'در حال افزودن…' : 'افزودن به سبد خرید'}
            </button>
            {canBuy && (
              <p className="mt-2 text-center text-[11px] text-ink/50">
                جمع این مورد: {priceLabel(Math.round((product.effectivePrice || 0) * quantity), settings.currency)}
              </p>
            )}
            <div className="mt-4 rounded-md bg-cream-200/60 px-3 py-2.5 text-[11px] leading-5 text-ink/60">
              قیمت‌ها و موجودی هنگام ثبت سفارش دوباره بررسی می‌شوند. برای سفارش عمده یا انتخاب رنگ خاص با ما تماس
              بگیرید.
            </div>
            {product.sku && (
              <p className="mt-3 text-center text-[10px] text-ink/40">
                شناسه محصول: <span className="num">{product.sku}</span> — {faNums(product.images.length)} تصویر
              </p>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="container-page pb-14">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="h-6 w-1 rounded-full bg-gold-400" />
            <h2 className="text-lg font-extrabold text-forest-700">محصولات مرتبط</h2>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {related.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
