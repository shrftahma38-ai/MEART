const faNumber = new Intl.NumberFormat('fa-IR');

/** 2850000 → «۲٬۸۵۰٬۰۰۰» */
export const faNums = (value: number) => faNumber.format(Math.round(value));

/** digits converted to Persian without thousand separators (phone numbers) */
export const faDigits = (value: string | number) =>
  String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export const faQty = (value: number) => {
  const fixed = Number.isInteger(value) ? value : Number(value.toFixed(2));
  return faNumber.format(fixed);
};

export const priceLabel = (value: number | null | undefined, currency = 'تومان') =>
  value == null ? null : `${faNums(value)} ${currency}`;

export const faDate = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  try {
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(date);
  } catch {
    return '';
  }
};

export const faDateTime = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  try {
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  } catch {
    return '';
  }
};

export const ORDER_STATUS: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'در انتظار بررسی', className: 'badge-gold' },
  CONFIRMED: { label: 'تأیید شده', className: 'badge-green' },
  PROCESSING: { label: 'در حال آماده‌سازی', className: 'badge-gold' },
  SHIPPED: { label: 'ارسال شده', className: 'badge-green' },
  DELIVERED: { label: 'تحویل شده', className: 'badge-green' },
  CANCELLED: { label: 'لغو شده', className: 'badge-red' },
};

export const PAYMENT_STATUS: Record<string, { label: string; className: string }> = {
  UNPAID: { label: 'پرداخت نشده', className: 'badge-muted' },
  AWAITING: { label: 'در انتظار پرداخت', className: 'badge-gold' },
  PAID: { label: 'پرداخت شده', className: 'badge-green' },
  FAILED: { label: 'پرداخت ناموفق', className: 'badge-red' },
  REFUNDED: { label: 'بازگشت وجه', className: 'badge-muted' },
};

export const PAYMENT_METHOD: Record<string, string> = {
  online: 'پرداخت آنلاین',
  cod: 'پرداخت در محل / کارت به کارت',
};

export const discountPercent = (price: number | null, salePrice: number | null) => {
  if (price == null || salePrice == null || salePrice <= 0 || salePrice >= price) return null;
  return Math.round((1 - salePrice / price) * 100);
};
