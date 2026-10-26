import { Link } from 'react-router-dom';
import { Seo } from '../components/ui/Seo';

export function NotFound() {
  return (
    <>
      <Seo title="صفحه پیدا نشد" />
      <div className="container-page flex flex-col items-center py-24 text-center">
        <p className="text-5xl font-extrabold text-gold-400">۴۰۴</p>
        <h1 className="mt-3 text-lg font-extrabold text-forest-700">صفحه مورد نظر پیدا نشد</h1>
        <p className="mt-2 max-w-md text-xs leading-6 text-ink/55">
          ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه جابه‌جا شده باشد.
        </p>
        <div className="mt-5 flex gap-2">
          <Link to="/" className="btn-primary btn-sm">صفحه اصلی</Link>
          <Link to="/shop" className="btn-outline btn-sm">فروشگاه پارچه</Link>
        </div>
      </div>
    </>
  );
}
