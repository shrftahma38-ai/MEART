import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { IconLogout, IconReceipt, IconUser } from '../ui/Icons';

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
    isActive ? 'bg-forest-700 text-cream-100' : 'text-ink/70 hover:bg-cream-200'
  }`;

export function AccountLayout() {
  const { user, logout } = useAuth();
  const { refresh } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    await refresh();
    navigate('/');
  };

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-forest-700 md:text-2xl">حساب کاربری</h1>
          <p className="mt-1 text-xs text-ink/55">خوش آمدید {user?.name}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <NavLink to="/admin" className="btn-outline btn-sm">
            ورود به پنل مدیریت
          </NavLink>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <aside className="card h-fit p-2.5">
          <NavLink to="/account" end className={tabClass}>
            <IconUser className="h-4 w-4" />
            اطلاعات حساب
          </NavLink>
          <NavLink to="/account/orders" className={tabClass}>
            <IconReceipt className="h-4 w-4" />
            سفارش‌های من
          </NavLink>
          <NavLink to="/track" className={tabClass}>
            <span className="text-gold-500">⊹</span>
            پیگیری سفارش
          </NavLink>
          <button type="button" onClick={handleLogout} className={`${tabClass({ isActive: false })} w-full`}>
            <IconLogout className="h-4 w-4" />
            خروج از حساب
          </button>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
