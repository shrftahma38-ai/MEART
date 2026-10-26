import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { IconInstagram, IconMail, IconPhone, IconPin, IconTelegram, IconWhatsapp } from '../ui/Icons';

const CATEGORY_LINKS = [
  { label: 'پارچه مانتویی', to: '/shop?category=manto' },
  { label: 'پارچه کت‌وشلواری', to: '/shop?category=kot-shalvar' },
  { label: 'پارچه مجلسی', to: '/shop?category=majlesi' },
  { label: 'پارچه نخی', to: '/shop?category=nakhi' },
  { label: 'پارچه جین', to: '/shop?category=jin' },
  { label: 'پارچه پرده‌ای', to: '/shop?category=parde' },
  { label: 'پارچه مبلی', to: '/shop?category=mobli' },
];

const PAGE_LINKS = [
  { label: 'درباره ما', to: '/p/about' },
  { label: 'تماس با ما', to: '/contact' },
  { label: 'سؤالات متداول', to: '/p/faq' },
  { label: 'راهنمای خرید', to: '/p/buying-guide' },
  { label: 'روش‌های ارسال', to: '/p/shipping' },
  { label: 'قوانین و مقررات', to: '/p/terms' },
  { label: 'حریم خصوصی', to: '/p/privacy' },
  { label: 'پیگیری سفارش', to: '/track' },
];

export function Footer() {
  const { settings } = useSettings();
  const year = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date());
  const socials = [
    { href: settings.instagram, icon: IconInstagram, label: 'اینستاگرام' },
    { href: settings.telegram, icon: IconTelegram, label: 'تلگرام' },
    { href: settings.whatsapp, icon: IconWhatsapp, label: 'واتساپ' },
  ].filter((item) => item.href);

  const hasContact = settings.phone || settings.mobile || settings.address || settings.email || settings.workingHours;

  return (
    <footer className="mt-16 border-t border-gold-400/25 bg-forest-700 text-cream-100/75">
      <div className="container-page grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display mb-3 text-xl text-gold-200">{settings.storeName}</h3>
          <p className="text-xs leading-6">
            {settings.aboutShort ||
              'فروشگاه تخصصی پارچه با انتخابی از پارچه‌های مانتویی، مجلسی، کت‌وشلواری، نخی، جین، پرده‌ای و مبلی.'}
          </p>
          {socials.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="rounded-full border border-cream-100/20 p-2 text-cream-100/80 transition hover:border-gold-300 hover:text-gold-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-gold-200">دسته‌بندی پارچه‌ها</h4>
          <ul className="space-y-2 text-xs">
            {CATEGORY_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition hover:text-gold-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-gold-200">راهنمای خرید</h4>
          <ul className="space-y-2 text-xs">
            {PAGE_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition hover:text-gold-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-gold-200">اطلاعات تماس</h4>
          {hasContact ? (
            <ul className="space-y-2.5 text-xs">
              {settings.phone && (
                <li className="flex items-start gap-2">
                  <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                  <span className="num">{settings.phone}</span>
                </li>
              )}
              {settings.mobile && (
                <li className="flex items-start gap-2">
                  <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                  <span className="num">{settings.mobile}</span>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2">
                  <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings.email && (
                <li className="flex items-start gap-2">
                  <IconMail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                  <span dir="ltr">{settings.email}</span>
                </li>
              )}
              {settings.workingHours && (
                <li className="text-cream-100/60">{settings.workingHours}</li>
              )}
            </ul>
          ) : (
            <p className="text-xs leading-6 text-cream-100/50">
              اطلاعات تماس فروشگاه به‌زودی از طریق پنل مدیریت تکمیل می‌شود. برای ارتباط می‌توانید از فرم صفحه
              «تماس با ما» استفاده کنید.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-cream-100/10 py-4">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-[11px] text-cream-100/50 sm:flex-row">
          <span>© {year} {settings.storeName} — تمام حقوق محفوظ است.</span>
          <span>قیمت‌ها و موجودی‌ها به‌صورت لحظه‌ای به‌روزرسانی می‌شوند.</span>
        </div>
      </div>
    </footer>
  );
}
