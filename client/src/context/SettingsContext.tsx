import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import type { StoreSettings } from '../lib/types';

const FALLBACK: StoreSettings = {
  storeName: 'پارچه‌سرای عرب‌زاده',
  tagline: 'دنیایی از رنگ، نقش و زیبایی',
  announcement: '',
  aboutShort: '',
  phone: '',
  mobile: '',
  email: '',
  address: '',
  postalCode: '',
  workingHours: '',
  instagram: '',
  telegram: '',
  whatsapp: '',
  currency: 'تومان',
  shippingCost: 0,
  freeShippingThreshold: 0,
  shippingNote: '',
  paymentOnlineEnabled: false,
  paymentCodEnabled: true,
  heroTitle: 'دنیایی از رنگ، نقش و زیبایی',
  heroSubtitle: 'انتخابی از میان پارچه‌های متنوع و باکیفیت، برای هر سلیقه و هر سبک.',
  heroButtonText: 'مشاهده پارچه‌ها',
  heroImage: '/media/hero.jpg',
  aboutTitle: 'درباره پارچه‌سرای عرب‌زاده',
  aboutText: '',
  aboutImage: '/media/about.jpg',
};

const SettingsContext = createContext<{ settings: StoreSettings; reload: () => Promise<void> }>({
  settings: FALLBACK,
  reload: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(FALLBACK);

  const reload = useCallback(async () => {
    try {
      const data = await api<{ settings: StoreSettings }>('/settings');
      setSettings({ ...FALLBACK, ...data.settings });
    } catch {
      /* the storefront still renders with fallback copy */
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo(() => ({ settings, reload }), [settings, reload]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
