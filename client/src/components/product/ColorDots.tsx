import type { ProductColor } from '../../lib/types';

export function ColorDots({ colors, size = 'md' }: { colors: ProductColor[]; size?: 'sm' | 'md' }) {
  if (!colors?.length) return null;
  const dimension = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-1.5">
      {colors.slice(0, 5).map((color) => (
        <span
          key={color.id}
          title={color.name}
          className={`${dimension} inline-block rounded-full border border-black/10 shadow-sm ring-1 ring-cream-50`}
          style={{ backgroundColor: color.hex }}
        />
      ))}
      {colors.length > 5 && <span className="text-[10px] text-ink/45">+{colors.length - 5}</span>}
    </div>
  );
}
