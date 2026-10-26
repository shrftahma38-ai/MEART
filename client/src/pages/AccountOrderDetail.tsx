import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Order } from '../lib/types';
import { OrderCard } from '../components/order/OrderCard';
import { ErrorBox, Spinner } from '../components/ui/States';
import { Seo } from '../components/ui/Seo';
import { useSettings } from '../context/SettingsContext';

export function AccountOrderDetail() {
  const { id } = useParams();
  const { settings } = useSettings();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    api<{ order: Order }>(`/auth/orders/${id}`)
      .then((data) => alive && setOrder(data.order))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <Spinner />;

  return (
    <>
      <Seo title="جزئیات سفارش" />
      <Link to="/account/orders" className="mb-3 inline-flex text-xs text-gold-600 hover:text-gold-700">
        → بازگشت به سفارش‌ها
      </Link>
      {error && <ErrorBox message={error} />}
      {order && <OrderCard order={order} currency={settings.currency} />}
    </>
  );
}
