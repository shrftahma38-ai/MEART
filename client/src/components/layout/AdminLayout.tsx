import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IconBox,
  IconChart,
  IconChat,
  IconCog,
  IconDoc,
  IconLogout,
  IconReceipt,
  IconTag,
  IconUsers,
} from '../ui/Icons';

const LINKS = [
  { to: '/admin', label: 'داشبورد', icon: IconChart, end: true },
  { to: '/admin/products', label: 'محصولات', icon: IconBox },
  { to: '/admin/categories', label: 'دسته‌بندی‌ها', icon: IconTag },
  { to: '/admin/orders', label: 'سفارش‌ها', icon: IconReceipt },
  { to: '/admin/customers', label: 'مشتریان', icon: IconUsers },
  { to: '/admin/messages', label: 'پیام‌ها', icon: IconChat },
  { to: '/admin/pages', label: 'صفحات سایت', icon: IconDoc },
  { to: '/admin/settings', label: 'تنظیمات فروشگاه', icon: IconCog },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="border-b border-gold-400/25 bg-forest-700">
        <div className="container-page flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-lg text-gold-200">پنل مدیریت</span>
            <span className="hidden text-[11px] text-cream-100/60 sm:block">پارچه‌سرای عرب‌زاده</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-cream-100/80">
            <span className="hidden sm:block">{user?.name}</span>
            <NavLink to="/" className="rounded-md border border-cream-100/25 px-2.5 py-1.5 transition hover:border-gold-300 hover:text-gold-200">
              مشاهده سایت
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-md border border-cream-100/25 px-2.5 py-1.5 transition hover:border-gold-300 hover:text-gold-200"
            >
              <IconLogout className="h-3.5 w-3.5" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-5 py-6 lg:grid-cols-[230px_1fr]">
        <aside className="card h-fit p-2.5">
          <nav className="space-y-1">
            {LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                    isActive ? 'bg-forest-700 text-cream-100' : 'text-ink/70 hover:bg-cream-200'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
