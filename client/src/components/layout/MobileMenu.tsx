import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { CONTACT, NAV_ITEMS, SOCIALS } from '../../lib/navigation';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  activeHash: string;
  pathname: string;
};

/** Full-screen navy navigation panel with large type, for tablet and below. */
export function MobileMenu({ open, onClose, activeHash, pathname }: MobileMenuProps) {
  const { count } = useFavorites();

  return (
    <div
      id="mobile-menu"
      hidden={!open}
      className={open ? 'fixed inset-0 z-[70] lg:hidden' : 'hidden'}
    >
      <div className="absolute inset-0 bg-navy-950/98 backdrop-blur-sm animate-fade-in" />

      <div className="relative flex h-full flex-col overflow-y-auto">
        <div className="shell flex h-20 shrink-0 items-center justify-between">
          <Logo tone="light" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:border-champagne hover:text-champagne"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav aria-label="Mobile" className="shell mt-6 flex-1">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {NAV_ITEMS.map((item, index) => {
              const active = item.section
                ? pathname === '/' && activeHash === `#${item.section}`
                : item.to === '/'
                  ? pathname === '/' && activeHash === ''
                  : pathname.startsWith(item.to);

              return (
                <li key={item.label} className="animate-slide-down" style={{ animationDelay: `${index * 40}ms` }}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center justify-between py-5"
                    aria-current={active ? 'page' : undefined}
                  >
                    <span
                      className={
                        active
                          ? 'font-display text-2xl font-medium text-champagne'
                          : 'font-display text-2xl font-medium text-white'
                      }
                    >
                      {item.label}
                    </span>
                    <Icon name="arrow-up-right" size={18} className="text-white/40" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            to="/saved"
            onClick={onClose}
            className="mt-6 flex items-center justify-between border border-white/15 px-5 py-4 text-white transition-colors duration-300 hover:border-champagne hover:text-champagne"
          >
            <span className="inline-flex items-center gap-3 font-sans text-[0.6875rem] font-medium uppercase tracking-wide2">
              <Icon name="heart" size={16} />
              Saved properties
            </span>
            <span className="font-sans text-[0.6875rem] tracking-label text-white/60">{count}</span>
          </Link>

          <div className="mt-10 space-y-4 pb-12 text-white/70">
            <a
              href={CONTACT.phoneHref}
              className="flex items-center gap-3 font-display text-lg text-white transition-colors duration-300 hover:text-champagne"
            >
              <Icon name="phone" size={17} className="text-champagne" />
              {CONTACT.phone}
            </a>
            <a
              href={CONTACT.emailHref}
              className="flex items-center gap-3 text-[0.9375rem] transition-colors duration-300 hover:text-champagne"
            >
              <Icon name="mail" size={17} className="text-champagne" />
              {CONTACT.email}
            </a>
            <p className="flex items-start gap-3 text-[0.9375rem]">
              <Icon name="pin" size={17} className="mt-0.5 shrink-0 text-champagne" />
              <span>{CONTACT.address.join(', ')}</span>
            </p>
          </div>

          <ul className="flex gap-3 pb-12">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors duration-300 hover:border-champagne hover:text-champagne"
                >
                  <Icon name={social.icon} size={17} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
