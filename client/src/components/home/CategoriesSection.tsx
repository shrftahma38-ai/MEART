import { Link } from 'react-router-dom';
import type { Category } from '../../lib/types';
import { SectionHeading } from '../ui/Section';
import { IconArrowLeft } from '../ui/Icons';

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="container-page py-14 md:py-16">
      <SectionHeading title="دسته‌بندی محصولات" subtitle="پارچه‌ها بر اساس نوع دوخت و کاربری دسته‌بندی شده‌اند تا انتخاب آسان‌تر باشد." />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <article
            key={category.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-gold-200/70 bg-cream-50 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-soft"
          >
            <Link to={`/shop?category=${category.slug}`} className="overflow-hidden bg-cream-200">
              <img
                src={category.image || '/media/hero.jpg'}
                alt={category.name}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="flex flex-1 flex-col items-center gap-1.5 px-3 py-4 text-center">
              <h3 className="text-sm font-bold text-forest-700">{category.name}</h3>
              <p className="line-clamp-1 text-[11px] text-ink/50">{category.description}</p>
              <Link
                to={`/shop?category=${category.slug}`}
                className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-gold-300/70 px-3 py-1.5 text-[11px] font-semibold text-forest-700 transition hover:border-gold-500 hover:bg-gold-100/50"
              >
                مشاهده محصولات
                <IconArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
