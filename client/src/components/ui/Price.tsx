import { discountPercent, priceLabel } from '../../lib/format';

export function Price({
  price,
  salePrice,
  currency = 'تومان',
  size = 'md',
}: {
  price: number | null;
  salePrice?: number | null;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const off = discountPercent(price, salePrice ?? null);
  const effective = off ? (salePrice as number) : price;
  const sizeClass = size === 'lg' ? 'text-xl md:text-2xl' : size === 'sm' ? 'text-xs' : 'text-sm';

  if (price == null) {
    return <p className="text-xs font-medium text-ink/45">قیمت به‌زودی اعلام می‌شود</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`num font-extrabold text-forest-700 ${sizeClass}`}>{priceLabel(effective, currency)}</span>
      {off && (
        <>
          <span className="num text-[11px] text-ink/40 line-through">{priceLabel(price, currency)}</span>
          <span className="badge-gold">{off}٪ تخفیف</span>
        </>
      )}
    </div>
  );
}
