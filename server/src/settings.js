import { prisma } from './db.js';

/**
 * Every store setting the owner can edit from the admin panel.
 * `type` drives the admin form control; `group` the panel section.
 */
export const SETTING_DEFS = [
  { key: 'storeName', label: 'نام فروشگاه', group: 'general', type: 'text', default: 'پارچه‌سرای عرب‌زاده' },
  { key: 'tagline', label: 'شعار فروشگاه', group: 'general', type: 'text', default: 'دنیایی از رنگ، نقش و زیبایی' },
  { key: 'announcement', label: 'متن نوار بالای سایت (خالی = پنهان)', group: 'general', type: 'text', default: '' },
  { key: 'aboutShort', label: 'معرفی کوتاه فروشگاه', group: 'general', type: 'textarea', default: '' },

  { key: 'phone', label: 'تلفن ثابت', group: 'contact', type: 'text', default: '' },
  { key: 'mobile', label: 'شماره همراه / واتساپ', group: 'contact', type: 'text', default: '' },
  { key: 'email', label: 'ایمیل', group: 'contact', type: 'text', default: '' },
  { key: 'address', label: 'نشانی فروشگاه', group: 'contact', type: 'textarea', default: '' },
  { key: 'postalCode', label: 'کد پستی', group: 'contact', type: 'text', default: '' },
  { key: 'workingHours', label: 'ساعات کاری', group: 'contact', type: 'text', default: '' },
  { key: 'instagram', label: 'لینک اینستاگرام', group: 'contact', type: 'text', default: '' },
  { key: 'telegram', label: 'لینک تلگرام', group: 'contact', type: 'text', default: '' },
  { key: 'whatsapp', label: 'لینک واتساپ', group: 'contact', type: 'text', default: '' },

  { key: 'currency', label: 'واحد پول', group: 'commerce', type: 'text', default: 'تومان' },
  { key: 'shippingCost', label: 'هزینه ارسال (به واحد پول)', group: 'commerce', type: 'number', default: '0' },
  { key: 'freeShippingThreshold', label: 'ارسال رایگان از مبلغ (۰ = غیرفعال)', group: 'commerce', type: 'number', default: '0' },
  { key: 'shippingNote', label: 'توضیح روش ارسال', group: 'commerce', type: 'textarea', default: '' },
  { key: 'paymentOnlineEnabled', label: 'فعال بودن روش پرداخت آنلاین', group: 'commerce', type: 'boolean', default: '0' },
  { key: 'paymentCodEnabled', label: 'فعال بودن پرداخت در محل / کارت به کارت', group: 'commerce', type: 'boolean', default: '1' },

  { key: 'heroTitle', label: 'عنوان بنر اصلی', group: 'home', type: 'text', default: 'دنیایی از رنگ، نقش و زیبایی' },
  { key: 'heroSubtitle', label: 'زیرعنوان بنر اصلی', group: 'home', type: 'textarea', default: 'انتخابی از میان پارچه‌های متنوع و باکیفیت، برای هر سلیقه و هر سبک.' },
  { key: 'heroButtonText', label: 'متن دکمه بنر', group: 'home', type: 'text', default: 'مشاهده پارچه‌ها' },
  { key: 'heroImage', label: 'آدرس تصویر بنر', group: 'home', type: 'image', default: '/media/hero.jpg' },
  { key: 'aboutTitle', label: 'عنوان بخش معرفی', group: 'home', type: 'text', default: 'درباره پارچه‌سرای عرب‌زاده' },
  { key: 'aboutText', label: 'متن معرفی فروشگاه در صفحه اصلی', group: 'home', type: 'textarea', default: 'مجموعه‌ای از پارچه‌های مانتویی، مجلسی، نخی و مبلی با انتخاب دستی و کنترل کیفیت، برای دوخت‌هایی که می‌خواهید سال‌ها بمانند.' },
  { key: 'aboutImage', label: 'آدرس تصویر بخش معرفی', group: 'home', type: 'image', default: '/media/about.jpg' },
];

const DEFAULTS = Object.fromEntries(SETTING_DEFS.map((d) => [d.key, d.default]));

/** All settings merged over defaults, values converted by type. */
export async function getSettings() {
  const rows = await prisma.setting.findMany();
  const raw = { ...DEFAULTS };
  for (const row of rows) raw[row.key] = row.value;
  const out = {};
  for (const def of SETTING_DEFS) {
    const value = raw[def.key] ?? def.default;
    out[def.key] = def.type === 'number' ? Number(value) || 0 : def.type === 'boolean' ? value === '1' : value;
  }
  return out;
}

export async function saveSettings(patch) {
  const allowed = new Set(SETTING_DEFS.map((d) => d.key));
  const entries = Object.entries(patch).filter(([key]) => allowed.has(key));
  for (const [key, value] of entries) {
    const def = SETTING_DEFS.find((d) => d.key === key);
    const stored = def.type === 'boolean' ? (value ? '1' : '0') : String(value ?? '');
    await prisma.setting.upsert({ where: { key }, update: { value: stored }, create: { key, value: stored } });
  }
}

/** Payment is only offered once a real gateway is configured through environment variables. */
export const gatewayConfigured = () => Boolean(process.env.PAYMENT_GATEWAY_URL && process.env.PAYMENT_GATEWAY_KEY);

export async function publicSettings() {
  const s = await getSettings();
  return {
    storeName: s.storeName,
    tagline: s.tagline,
    announcement: s.announcement,
    aboutShort: s.aboutShort,
    phone: s.phone,
    mobile: s.mobile,
    email: s.email,
    address: s.address,
    postalCode: s.postalCode,
    workingHours: s.workingHours,
    instagram: s.instagram,
    telegram: s.telegram,
    whatsapp: s.whatsapp,
    currency: s.currency,
    shippingCost: s.shippingCost,
    freeShippingThreshold: s.freeShippingThreshold,
    shippingNote: s.shippingNote,
    paymentOnlineEnabled: s.paymentOnlineEnabled && gatewayConfigured(),
    paymentCodEnabled: s.paymentCodEnabled,
    heroTitle: s.heroTitle,
    heroSubtitle: s.heroSubtitle,
    heroButtonText: s.heroButtonText,
    heroImage: s.heroImage,
    aboutTitle: s.aboutTitle,
    aboutText: s.aboutText,
    aboutImage: s.aboutImage,
  };
}
