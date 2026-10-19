import type { CSSProperties } from 'react';

type IconName =
  | 'phone'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'heart'
  | 'bed'
  | 'bath'
  | 'area'
  | 'pin'
  | 'mail'
  | 'menu'
  | 'close'
  | 'search'
  | 'check'
  | 'key'
  | 'calendar'
  | 'sliders'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'star'
  | 'shield'
  | 'trend'
  | 'users'
  | 'home';

const ICONS: Record<IconName, { d: string[]; fill?: boolean }> = {
  phone: {
    d: [
      'M6.4 3.6h2.8l1.4 3.7-2 1.4a11.7 11.7 0 0 0 5.5 5.5l1.4-2 3.7 1.4v2.8c0 .9-.7 1.6-1.6 1.6A15.9 15.9 0 0 1 4.8 5.2c0-.9.7-1.6 1.6-1.6Z',
    ],
  },
  'arrow-right': { d: ['M4 12h15', 'm12.8 5.8 6.2 6.2-6.2 6.2'] },
  'arrow-up-right': { d: ['M7 17 17 7', 'M9 7h8v8'] },
  'chevron-left': { d: ['M14.5 5.5 8 12l6.5 6.5'] },
  'chevron-right': { d: ['M9.5 5.5 16 12l-6.5 6.5'] },
  'chevron-down': { d: ['M5.5 9.5 12 16l6.5-6.5'] },
  heart: {
    d: ['M12 20.2S3.8 15.4 3.8 10.1A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 8.2 3c0 5.3-8.2 10.1-8.2 10.1Z'],
  },
  bed: {
    d: [
      'M3.5 18.5V7',
      'M3.5 12.5h17V18.5',
      'M20.5 12.5V9.6a2.1 2.1 0 0 0-2.1-2.1H9.4v5',
      'M7.1 10.6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
    ],
  },
  bath: {
    d: [
      'M4 12.4h16',
      'M6.4 12.4V8.1a3.1 3.1 0 0 1 6.1-.4',
      'M4 12.4v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3',
      'M7.4 18.4v2M16.6 18.4v2',
    ],
  },
  area: { d: ['M4 4h16v16H4z'] },
  pin: {
    d: [
      'M12 20.8s6.4-5.1 6.4-9.9a6.4 6.4 0 1 0-12.8 0c0 4.8 6.4 9.9 6.4 9.9Z',
      'M12 13.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    ],
  },
  mail: { d: ['M4 6.5h16v11H4z', 'm4.6 7.4 7.4 5.2 7.4-5.2'] },
  menu: { d: ['M4 7.5h16', 'M4 12h16', 'M4 16.5h16'] },
  close: { d: ['M6.5 6.5l11 11', 'M17.5 6.5l-11 11'] },
  search: { d: ['M10.6 16.8a6.2 6.2 0 1 0 0-12.4 6.2 6.2 0 0 0 0 12.4Z', 'm15.4 15.4 4.1 4.1'] },
  check: { d: ['m5.5 12.4 4.4 4.4L18.8 7.6'] },
  key: {
    d: [
      'M14.9 4a5.6 5.6 0 0 0-4.7 8.6L3.8 19v1.6h2.6l1-1v-1.5h1.6v-1.6h1.6l1.2-1.2A5.6 5.6 0 1 0 14.9 4Z',
      'M16.3 7.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z',
    ],
  },
  calendar: { d: ['M4 6.5h16v13H4z', 'M4 10.6h16', 'M8.8 4v4M15.2 4v4'] },
  sliders: { d: ['M4 7.5h4.5M12.5 7.5H20', 'M4 16.5h8.5M16.5 16.5H20', 'M11 4.5v6M14 13.5v6'] },
  linkedin: { d: ['M4.5 4.5h15v15h-15z', 'M8.4 10.4v6.1M8.4 7.6v.02', 'M11.7 16.5v-3.6a2 2 0 0 1 4 0v3.6'] },
  instagram: {
    d: [
      'M4.5 8.6A4.1 4.1 0 0 1 8.6 4.5h6.8a4.1 4.1 0 0 1 4.1 4.1v6.8a4.1 4.1 0 0 1-4.1 4.1H8.6a4.1 4.1 0 0 1-4.1-4.1V8.6Z',
      'M12 15.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z',
      'M16.9 7.3v.02',
    ],
  },
  facebook: {
    d: [
      'M13.6 20.5v-7.7h2.5l.4-3h-2.9V8.1c0-.9.3-1.5 1.6-1.5h1.6V4.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.1H8.1v3h2.3v7.3h3.2Z',
    ],
    fill: true,
  },
  star: { d: ['m12 4.4 2.3 4.9 5.3.8-3.8 3.7.9 5.3-4.7-2.5-4.7 2.5.9-5.3L4.4 10l5.3-.8L12 4.4Z'] },
  shield: { d: ['M12 3.6 19 6.1v5.4c0 4.4-2.9 7.4-7 8.9-4.1-1.5-7-4.5-7-8.9V6.1l7-2.5Z', 'm9.2 12 2.2 2.2 3.6-3.9'] },
  trend: { d: ['M4 16.6 10 10.5l3.5 3.5L20 7.2', 'M15.4 7.2H20v4.6'] },
  users: {
    d: [
      'M8.6 11.4a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z',
      'M3.6 19.6a5 5 0 0 1 10 0',
      'M15.6 11.6a3.1 3.1 0 1 0-1.7-5.7',
      'M17.2 19.6a5.1 5.1 0 0 0-1.5-3.6',
    ],
  },
  home: { d: ['M4 11 12 4.2 20 11v9H4v-9Z', 'M10 20v-5.2h4V20'] },
};

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: CSSProperties;
  title?: string;
};

export function Icon({ name, size = 20, className, strokeWidth = 1.5, style, title }: IconProps) {
  const icon = ICONS[name];
  if (!icon) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      fill={icon.fill ? 'currentColor' : 'none'}
      stroke={icon.fill ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {icon.d.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export type { IconName };
