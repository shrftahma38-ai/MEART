import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { IconArrowLeft, IconHeadset, IconLayers, IconShield, IconTruck } from '../ui/Icons';
import { GoldDivider } from '../ui/Section';

const ADVANTAGES = [
  { icon: IconTruck, title: 'ارسال به سراسر کشور', text: 'ثبت سفارش و ارسال با پست و باربری، همراه با پیگیری وضعیت.' },
  { icon: IconShield, title: 'کیفیت کنترل‌شده', text: 'هر پارچه پیش از عرضه از نظر بافت، رنگ و ایستایی بررسی می‌شود.' },
  { icon: IconLayers, title: 'تنوع رنگ و بافت', text: 'رنگ‌بندی متنوع برای دوخت سفارشی و سفارش عمده.' },
  { icon: IconHeadset, title: 'مشاوره انتخاب پارچه', text: 'در انتخاب بافت و رنگ مناسب کاربری خود راهنمایی می‌گیرید.' },
];

export function AboutSection() {
  const { settings } = useSettings();

  return (
    <section className="border-y border-gold-200/60 bg-cream-200/40 py-14 md:py-16">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -right-3 -top-3 h-full w-full rounded-xl border border-gold-300/60" aria-hidden />
          <img
            src={settings.aboutImage || '/media/about.jpg'}
            alt={settings.aboutTitle}
            loading="lazy"
            className="relative aspect-[4/3] w-full rounded-xl object-cover shadow-card"
          />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-forest-700 md:text-2xl">{settings.aboutTitle}</h2>
          <GoldDivider className="!justify-start py-3" />
          <p className="text-sm leading-7 text-ink/70">
            {settings.aboutText ||
              'مجموعه‌ای از پارچه‌های مانتویی، مجلسی، نخی و مبلی با انتخاب دستی و کنترل کیفیت، برای دوخت‌هایی که می‌خواهید سال‌ها بمانند.'}
          </p>
          <Link to="/p/about" className="btn-outline mt-5 inline-flex">
            بیشتر بدانید
            <IconArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="container-page mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {ADVANTAGES.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-xl border border-gold-200/60 bg-cream-50/80 p-4 text-center transition hover:border-gold-300"
          >
            <span className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full border border-gold-300/60 bg-gold-100/50 text-gold-600">
              <Icon className="h-5 w-5" />
            </span>
            <p className="text-xs font-bold text-forest-700">{title}</p>
            <p className="mt-1.5 text-[11px] leading-5 text-ink/55">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
