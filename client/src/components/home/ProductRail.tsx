import type { Product } from '../../lib/types';
import { ProductCard } from '../product/ProductCard';
import { RailHeading } from '../ui/Section';

export function ProductRail({
  title,
  products,
  link,
  linkLabel,
}: {
  title: string;
  products: Product[];
  link?: string;
  linkLabel?: string;
}) {
  if (!products.length) return null;
  return (
    <section className="container-page py-10 md:py-12">
      <RailHeading title={title} link={link} linkLabel={linkLabel} />
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
