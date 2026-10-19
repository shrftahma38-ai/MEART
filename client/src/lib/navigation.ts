import type { IconName } from '../components/ui/Icon';

export type NavItem = {
  label: string;
  to: string;
  /** Homepage section id, used for the active state and same-page scrolling. */
  section?: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Properties', to: '/properties' },
  { label: 'About Us', to: '/#about', section: 'about' },
  { label: 'Services', to: '/#services', section: 'services' },
  { label: 'Team', to: '/#team', section: 'team' },
  { label: 'Contact', to: '/contact' },
];

export const CONTACT = {
  phone: '(555) 246-7890',
  phoneHref: 'tel:+15552467890',
  email: 'hello@horizonproperties.com',
  emailHref: 'mailto:hello@horizonproperties.com',
  address: ['1200 Congress Avenue, Suite 2400', 'Austin, Texas 78701'],
  hours: 'Monday — Saturday, 9:00 — 18:00',
  licensed: 'Licensed in Texas, California, Florida, Arizona & Nevada',
};

export const SOCIALS: Array<{ label: string; href: string; icon: IconName }> = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: 'facebook' },
];

export function isNavItemActive(item: NavItem, pathname: string, hash: string): boolean {
  if (item.section) return pathname === '/' && hash === `#${item.section}`;
  if (item.to === '/') return pathname === '/' && hash === '';
  return pathname.startsWith(item.to);
}
