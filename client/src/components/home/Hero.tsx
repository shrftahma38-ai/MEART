import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { IconArrowLeft } from '../ui/Icons';

export function Hero() {
  const { settings } = useSettings();

  return (
    <section className="relative overflow-hidden bg-forest-800">
      <img
        src={settings.heroImage || '/media/hero.jpg'}
        alt="پارچه‌های لوکس و رنگارنگ"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-forest-900/88 via-forest-900/55 to-forest-900/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(184,134,11,0.18),transparent_55%)]" />

      <div className="container-page relative flex min-h-[420px] items-center py-14 md:min-h-[540px] md:py-20">
        <div className="w-full max-w-xl text-right">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-gold-400/80" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-gold-200">پارچه‌سرای عرب‌زاده</span>
          </div>
          <h1 className="text-3xl font-extrabold leading-[1.35] text-cream-50 drop-shadow-sm md:text-[42px] md:leading-[1.3]">
            {settings.heroTitle}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-cream-100/85 md:text-base md:leading-8">
            {settings.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/shop" className="btn-hero px-6 py-3 text-sm">
              {settings.heroButtonText}
              <IconArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              to="/shop?featured=1"
              className="rounded-lg border border-cream-100/25 px-6 py-3 text-sm font-semibold text-cream-100/90 transition hover:border-gold-300/70 hover:text-gold-200"
            >
              پرفروش‌ترین پارچه‌ها
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
