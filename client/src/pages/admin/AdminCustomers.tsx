import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useSettings } from '../../context/SettingsContext';
import { Seo } from '../../components/ui/Seo';
import { Spinner } from '../../components/ui/States';
import { faDate, faNums, priceLabel } from '../../lib/format';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
};

export function AdminCustomers() {
  const { settings } = useSettings();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ customers: Customer[] }>('/admin/customers')
      .then((data) => setCustomers(data.customers))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <Seo title="مشتریان" />
      <div className="space-y-4">
        <h1 className="text-base font-extrabold text-forest-700">مشتریان ({faNums(customers.length)})</h1>
        <div className="card overflow-x-auto">
          <table className="table-basic">
            <thead>
              <tr>
                <th>نام</th>
                <th>ایمیل</th>
                <th>شماره تماس</th>
                <th>تعداد سفارش</th>
                <th>مجموع خرید</th>
                <th>تاریخ عضویت</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="text-xs font-semibold text-forest-700">{customer.name}</td>
                  <td className="text-xs" dir="ltr">{customer.email}</td>
                  <td className="num text-xs">{customer.phone || '—'}</td>
                  <td className="num text-xs">{faNums(customer.orderCount)}</td>
                  <td className="num text-xs">{priceLabel(customer.totalSpent, settings.currency)}</td>
                  <td className="text-[11px] text-ink/55">{faDate(customer.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && <p className="px-4 py-8 text-center text-xs text-ink/50">هنوز مشتری ثبت‌نام نکرده است.</p>}
        </div>
      </div>
    </>
  );
}
