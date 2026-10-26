type IconProps = { className?: string };

const base = 'h-5 w-5';

export const IconSearch = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
    <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconCart = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path
      d="M3 4h2.2l2.1 10.3a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 8H6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9.5" cy="19.5" r="1.4" fill="currentColor" />
    <circle cx="17" cy="19.5" r="1.4" fill="currentColor" />
  </svg>
);

export const IconUser = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="12" cy="8.5" r="3.6" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconArrowLeft = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M19 12H5m0 0 5.5-5.5M5 12l5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconEye = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M2.8 12S6 6.5 12 6.5 21.2 12 21.2 12 18 17.5 12 17.5 2.8 12 2.8 12Z" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const IconMenu = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconClose = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconChevronDown = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconTrash = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M4 7h16M9 7V5h6v2m-8 0 1 12h8l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPlus = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconMinus = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconTruck = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M2.5 7.5h10v8h-10zM12.5 10.5H17l3 3v2h-7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="6" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16.5" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const IconShield = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M12 3.5 19 6v6c0 4.2-3 7-7 8.5C8 19 5 16.2 5 12V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="m9 12 2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconLayers = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="m12 3 8 4.5-8 4.5L4 7.5 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="m4 12.5 8 4.5 8-4.5M4 16.8l8 4.4 8-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconHeadset = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <rect x="2.8" y="13" width="3.6" height="5.6" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
    <rect x="17.6" y="13" width="3.6" height="5.6" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const IconPhone = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3c0 1.4-1.1 2.5-2.5 2.5A15.5 15.5 0 0 1 4 6c0-1.4 1.1-2.5 2.5-2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const IconMail = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconPin = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const IconInstagram = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17" cy="7" r="1.1" fill="currentColor" />
  </svg>
);

export const IconTelegram = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M21 4 3.5 11l5 1.8L11 20l3-4.5 5 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="m8.5 12.8 8-5.5-5.6 8.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const IconWhatsapp = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M20 11.8A8 8 0 0 1 8.4 19L4 20l1-4.2A8 8 0 1 1 20 11.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l.9-1.6-2-.9-.9.9a4.4 4.4 0 0 1-1.9-1.9l.9-.9-.9-2z" fill="currentColor" />
  </svg>
);

export const IconClock = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconBox = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M12 3 20 7v10l-8 4-8-4V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const IconTag = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M20 12.5 12.5 20a2 2 0 0 1-2.8 0L4 14.3V4h10.3L20 9.7a2 2 0 0 1 0 2.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
  </svg>
);

export const IconReceipt = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconUsers = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="9" cy="8.5" r="3.3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.8 19c.9-3 3.3-4.6 6.2-4.6s5.3 1.6 6.2 4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 5.5a3.3 3.3 0 0 1 0 6.4M17.5 14.8c2 .4 3.4 1.8 4 4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconCog = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 3.5v2M12 18.5v2M4.9 7.9l1.7 1M17.4 15.1l1.7 1M4.9 16.1l1.7-1M17.4 8.9l1.7-1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const IconDoc = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M7 3h7l4 4v14H7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 3v4h4M10 12h5M10 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconChat = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M4 5h16v11H9l-5 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconChart = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M4 20V4M4 20h16M8 16V11M12.5 16V7M17 16v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconLogout = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M14 4H6v16h8M18 12H9m9 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconOrnament = ({ className = 'h-4 w-16' }: IconProps) => (
  <svg viewBox="0 0 72 16" fill="none" className={className} aria-hidden>
    <path d="M0 8h26" stroke="currentColor" strokeWidth="1" />
    <path d="M30 8c0-3.2 2.6-5.2 5.4-4.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M36 8 31 3.6M36 8l-5 4.4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
    <path d="M36 2.6 39.4 8 36 13.4 32.6 8z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    <path d="M72 8H46" stroke="currentColor" strokeWidth="1" />
    <path d="M42 8c0-3.2-2.6-5.2-5.4-4.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
  </svg>
);
