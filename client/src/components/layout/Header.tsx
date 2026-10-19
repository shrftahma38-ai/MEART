import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { cx } from '../../lib/cx';
import { CONTACT, NAV_ITEMS, isNavItemActive } from '../../lib/navigation';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { MobileMenu } from './MobileMenu';

/**
 * Transparent over the homepage hero, then a navy bar with a champagne hairline
 * once the page scrolls. Inner pages start solid because they have no hero image
 * behind the bar.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash, key } = useLocation();
  const { count } = useFavorites();

  const isHome = pathname === '/';
  const solid = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash, key]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-[60] border-b transition-all duration-500 ease-editorial',
          solid
            ? 'border-champagne/25 bg-navy/95 backdrop-blur-md'
            : 'border-transparent bg-gradient-to-b from-navy-950/55 to-transparent',
        )}
      >
        <div className="shell flex h-20 items-center justify-between gap-6 lg:h-24">
          <Logo tone="light" />

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item, pathname, hash);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'group/nav relative font-sans text-[0.8125rem] font-medium tracking-wide2 transition-colors duration-300',
                    active ? 'text-champagne' : 'text-white/85 hover:text-white',
                  )}
                >
                  {item.label}
                  <span
                    className={cx(
                      'absolute -bottom-2 left-0 h-px bg-champagne transition-all duration-300 ease-editorial',
                      active ? 'w-full' : 'w-0 group-hover/nav:w-full',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/saved"
              aria-label={`Saved properties (${count})`}
              className="relative hidden h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:border-champagne hover:text-champagne sm:inline-flex"
            >
              <Icon name="heart" size={17} />
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-champagne px-1 font-sans text-[0.625rem] font-semibold text-navy-900">
                  {count}
                </span>
              ) : null}
            </Link>

            <a
              href={CONTACT.phoneHref}
              className="hidden h-11 items-center gap-2.5 border border-white/40 px-5 font-sans text-[0.6875rem] font-medium uppercase tracking-wide2 text-white transition-all duration-300 ease-editorial hover:border-white hover:bg-white hover:text-navy md:inline-flex"
            >
              <Icon name="phone" size={15} />
              {CONTACT.phone}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:border-champagne hover:text-champagne lg:hidden"
            >
              <Icon name="menu" size={19} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeHash={hash} pathname={pathname} />
    </>
  );
}
