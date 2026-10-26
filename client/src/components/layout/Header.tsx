import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { SearchBox } from './SearchBox';
import { IconCart, IconClose, IconMenu, IconUser } from '../ui/Icons';
import { faNums } from '../../lib/format';

export const NAV_ITEMS = [
  { label: 'خانه', to: '/' },
  { label: 'فروشگاه', to: '/shop' },
  { label: 'پارچه‌های مانتویی', to: '/shop?category=manto' },
  { label: 'پارچه‌های کت‌وشلواری', to: '/shop?category=kot-shalvar' },
  { label: 'پارچه‌های مجلسی', to: '/shop?category=majlesi' },
  { label: 'پارچه‌های نخی', to: '/shop?category=nakhi' },
  { label: 'پارچه‌های جین', to: '/shop?category=jin' },
  { label: 'پارچه‌های پرده‌ای', to: '/shop?category=parde' },
  { label: 'پارچه‌های مبلی', to: '/shop?category=mobli' },
  { label: 'تماس با ما', to: '/contact' },
];

function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10 shrink-0 md:h-11 md:w-11" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#14302B" stroke="#C8A96B" strokeWidth="1.4" />
      <circle cx="32" cy="32" r="25" fill="none" stroke="#C8A96B" strokeWidth="0.7" opacity="0.6" />
      <path
        d="M32 13c7.5 5.4 11.5 11.8 11.5 19S39.5 45.6 32 51c-7.5-5.4-11.5-11.8-11.5-19S24.5 18.4 32 13z"
        fill="none"
        stroke="#C8A96B"
        strokeWidth="1.3"
      />
      <path d="M32 20v24M25 26c4.5 2 9.5 2 14 0M25 38c4.5-2 9.5-2 14 0" stroke="#B8860B" strokeWidth="1" opacity="0.85" />
      <circle cx="32" cy="32" r="2.6" fill="#E7D8B6" />
    </svg>
  );
}

export function Header() {
  const { settings } = useSettings();
  const { cart } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.search, location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap text-[13px] font-medium transition-colors ${
      isActive ? 'text-gold-200' : 'text-cream-100/85 hover:text-gold-200'
    }`;

  return (
    <header className="sticky top-0 z-50">
      {settings.announcement && (
        <div className="bg-forest-900 py-1.5 text-center text-[11px] tracking-wide text-cream-100/75">
          {settings.announcement}
        </div>
      )}

      <div className="border-b border-gold-400/20 bg-forest-700">
        <div className="container-page flex items-center gap-3 py-3 md:gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={settings.storeName}>
            <LogoMark />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg text-gold-200 md:text-[22px]">{settings.storeName}</span>
              <span className="hidden text-[10px] tracking-wide text-cream-100/55 sm:block">{settings.tagline}</span>
            </span>
          </Link>

          <div className="mx-auto hidden w-full max-w-sm md:block lg:max-w-md">
            <SearchBox />
          </div>

          <div className="mr-auto flex items-center gap-1 md:gap-2">
            <Link
              to={user ? '/account' : '/login'}
              className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-cream-100/85 transition hover:text-gold-200"
            >
              <IconUser className="h-5 w-5" />
              <span className="hidden text-[10px] sm:block">{user ? user.name.split(' ')[0] : 'ورود / ثبت‌نام'}</span>
            </Link>
            <Link
              to="/cart"
              className="relative flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-cream-100/85 transition hover:text-gold-200"
              aria-label="سبد خرید"
            >
              <IconCart className="h-5 w-5" />
              <span className="hidden text-[10px] sm:block">سبد خرید</span>
              {cart.count > 0 && (
                <span className="num absolute -right-0.5 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-clay px-1 text-[10px] font-bold text-cream-50">
                  {faNums(cart.count)}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-cream-100/85 transition hover:text-gold-200 lg:hidden"
              aria-label="منو"
            >
              <IconMenu />
            </button>
          </div>
        </div>

        <div className="container-page pb-3 md:hidden">
          <SearchBox compact />
        </div>

        <nav className="hidden border-t border-cream-100/10 lg:block" aria-label="منوی اصلی">
          <div className="container-page rail-scroll flex items-center justify-center gap-5 overflow-x-auto py-2.5 xl:gap-7">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-forest-900/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-[82vw] max-w-xs flex-col bg-forest-700 shadow-xl">
            <div className="flex items-center justify-between border-b border-cream-100/10 px-4 py-4">
              <span className="font-display text-lg text-gold-200">{settings.storeName}</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1.5 text-cream-100/80 hover:text-gold-200"
                aria-label="بستن منو"
              >
                <IconClose />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2.5 text-sm transition ${
                      isActive ? 'bg-cream-100/10 text-gold-200' : 'text-cream-100/85 hover:bg-cream-100/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="my-3 h-px bg-cream-100/10" />
              <Link to={user ? '/account' : '/login'} className="block rounded-md px-3 py-2.5 text-sm text-cream-100/85">
                {user ? 'حساب کاربری من' : 'ورود / ثبت‌نام'}
              </Link>
              <Link to="/track" className="block rounded-md px-3 py-2.5 text-sm text-cream-100/85">
                پیگیری سفارش
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="block rounded-md px-3 py-2.5 text-sm text-gold-200">
                  پنل مدیریت
                </Link>
              )}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
