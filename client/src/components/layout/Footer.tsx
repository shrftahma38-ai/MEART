import { Link } from 'react-router-dom';
import { CONTACT, NAV_ITEMS, SOCIALS } from '../../lib/navigation';
import { NewsletterForm } from '../forms/NewsletterForm';
import { Icon } from '../ui/Icon';
import { LogoMark } from '../ui/Logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-champagne/20 bg-navy-900 text-white">
      <div className="shell grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <LogoMark size={30} className="text-white" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[0.95rem] font-semibold uppercase tracking-[0.2em]">
                Horizon
              </span>
              <span className="mt-1 font-sans text-[0.5rem] font-light uppercase tracking-[0.42em] text-white/60">
                Properties
              </span>
            </span>
          </div>
          <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-white/65">
            An advisory practice for architecturally significant homes, private estates and
            long-horizon property investments.
          </p>
          <ul className="mt-7 flex gap-3">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Horizon Properties on ${social.label}`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/75 transition-colors duration-300 hover:border-champagne hover:text-champagne"
                >
                  <Icon name={social.icon} size={17} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className="label text-champagne">Navigate</h2>
          <ul className="mt-5 space-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-[0.9375rem] text-white/75 transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/saved"
                className="text-[0.9375rem] text-white/75 transition-colors duration-300 hover:text-white"
              >
                Saved Properties
              </Link>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="label text-champagne">Contact</h2>
          <ul className="mt-5 space-y-4 text-[0.9375rem] text-white/75">
            <li>
              <a
                href={CONTACT.phoneHref}
                className="inline-flex items-center gap-3 transition-colors duration-300 hover:text-white"
              >
                <Icon name="phone" size={16} className="text-champagne" />
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.emailHref}
                className="inline-flex items-center gap-3 transition-colors duration-300 hover:text-white"
              >
                <Icon name="mail" size={16} className="text-champagne" />
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="pin" size={16} className="mt-1 shrink-0 text-champagne" />
              <span>
                {CONTACT.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
            <li className="text-white/55">{CONTACT.hours}</li>
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <h2 className="label text-champagne">New Collections</h2>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-white/65">
            Private listings and market notes, sent when there is something worth your attention.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-6 text-[0.8125rem] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Horizon Properties. All rights reserved.</p>
          <p>{CONTACT.licensed}</p>
        </div>
      </div>
    </footer>
  );
}
