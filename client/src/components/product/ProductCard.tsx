import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { ColorDots } from './ColorDots';
import { Price } from '../ui/Price';
import { IconCart, IconEye } from '../ui/Icons';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const hasPrice = product.effectivePrice != null;
  const inStock = product.isAvailable && product.stock > 0;
  const buyable = hasPrice && inStock && product.isActive;
  const image = product.images?.[0]?.url || product.colors?.[0]?.image || '/media/hero.jpg';
  const discounted = product.salePrice != null && product.price != null && product.salePrice < product.price;

  const handleAdd = async () => {
    if (!buyable) return;
    // fabrics with several colours need an explicit choice on the product page
    if (product.colors.length > 1) {
      navigate(`/product/${product.slug}`);
      return;
    }
    setBusy(true);
    await addItem(product.id, product.colors[0]?.id || null, product.minQty || 1);
    setBusy(false);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gold-200/70 bg-cream-50 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-soft">
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden bg-cream-200">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute right-2.5 top-2.5 flex flex-col items-end gap-1.5">
          {discounted && <span className="badge-gold shadow-sm">تخفیف‌دار</span>}
          {product.isNew && <span className="badge-green shadow-sm">جدید</span>}
          {!inStock && <span className="badge-muted shadow-sm">ناموجود</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <Link
          to={`/product/${product.slug}`}
          className="truncate text-sm font-bold text-forest-700 transition hover:text-gold-600"
          title={product.name}
        >
          {product.name}
        </Link>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] text-ink/50">{product.category?.name}</span>
          <ColorDots colors={product.colors} size="sm" />
        </div>

        <div className="mt-0.5">
          <Price price={product.price} salePrice={product.salePrice} currency={settings.currency} />
        </div>

        <div className="mt-auto space-y-1.5 pt-2">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!buyable || busy}
            title={!hasPrice ? 'قیمت این محصول هنوز ثبت نشده است' : !inStock ? 'این محصول ناموجود است' : undefined}
            className="btn-primary btn-sm w-full"
          >
            <IconCart className="h-4 w-4" />
            {busy ? 'در حال افزودن…' : 'افزودن به سبد خرید'}
          </button>
          <Link to={`/product/${product.slug}`} className="btn-outline btn-sm w-full">
            <IconEye className="h-4 w-4" />
            مشاهده جزئیات
          </Link>
        </div>
      </div>
    </article>
  );
}
