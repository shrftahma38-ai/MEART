import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Category, Product } from '../lib/types';
import { Seo } from '../components/ui/Seo';
import { Hero } from '../components/home/Hero';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { ProductRail } from '../components/home/ProductRail';
import { AboutSection } from '../components/home/AboutSection';
import { SkeletonCard } from '../components/ui/States';
import { useSettings } from '../context/SettingsContext';

export function Home() {
  const { settings } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [freshProducts, setFreshProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [catRes, bestRes, newRes] = await Promise.all([
          api<{ categories: Category[] }>('/categories'),
          api<{ products: Product[] }>('/products?featured=1&limit=10'),
          api<{ products: Product[] }>('/products?sort=newest&limit=10'),
        ]);
        if (!alive) return;
        setCategories(catRes.categories);
        setBestSellers(bestRes.products);
        setFreshProducts(newRes.products);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Seo
        title={`${settings.storeName} | فروشگاه تخصصی پارچه`}
        description={settings.heroSubtitle}
      />
      <Hero />
      <CategoriesSection categories={categories} />

      {loading ? (
        <div className="container-page grid grid-cols-2 gap-4 py-10 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <ProductRail
          title="محصولات پرفروش"
          products={bestSellers}
          link="/shop?featured=1"
          linkLabel="مشاهده همه"
        />
      )}

      <AboutSection />

      {!loading && freshProducts.length > 0 && (
        <ProductRail title="جدیدترین پارچه‌ها" products={freshProducts} link="/shop" linkLabel="مشاهده همه" />
      )}
    </>
  );
}
