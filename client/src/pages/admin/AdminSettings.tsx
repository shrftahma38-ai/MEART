import { useEffect, useState } from 'react';
import { api, errMessage } from '../../lib/api';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { Seo } from '../../components/ui/Seo';
import { Spinner } from '../../components/ui/States';

type Definition = {
  key: string;
  label: string;
  group: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'image';
  default: string;
};

const GROUPS: Record<string, string> = {
  general: 'اطلاعات عمومی فروشگاه',
  contact: 'اطلاعات تماس و شبکه‌های اجتماعی',
  commerce: 'فروش و ارسال',
  home: 'محتوای صفحه اصلی',
};

export function AdminSettings() {
  const { reload } = useSettings();
  const { push } = useToast();
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [values, setValues] = useState<Record<string, string | number | boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    api<{ settings: Record<string, string | number | boolean>; definitions: Definition[] }>('/admin/settings')
      .then((data) => {
        setDefinitions(data.definitions);
        setValues(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api('/admin/settings', { method: 'PATCH', body: values });
      await reload();
      push('تنظیمات فروشگاه ذخیره شد.');
    } catch (err) {
      push(errMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (key: string, file: File) => {
    setUploading(key);
    try {
      const body = new FormData();
      body.append('file', file);
      const data = await api<{ url: string }>('/admin/upload', { method: 'POST', body });
      setValues((current) => ({ ...current, [key]: data.url }));
    } catch (err) {
      push(errMessage(err), 'error');
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <Spinner />;

  const grouped = Object.keys(GROUPS).map((group) => ({
    key: group,
    label: GROUPS[group],
    items: definitions.filter((definition) => definition.group === group),
  }));

  return (
    <>
      <Seo title="تنظیمات فروشگاه" />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-base font-extrabold text-forest-700">تنظیمات فروشگاه</h1>
          <button type="button" onClick={save} disabled={saving} className="btn-primary btn-sm">
            {saving ? 'در حال ذخیره…' : 'ذخیره تنظیمات'}
          </button>
        </div>

        {grouped.map((group) => (
          <section key={group.key} className="card p-5">
            <h2 className="mb-4 border-b border-cream-300/70 pb-2 text-sm font-bold text-forest-700">{group.label}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.items.map((definition) => (
                <div key={definition.key} className={definition.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <label className="label">{definition.label}</label>
                  {definition.type === 'boolean' ? (
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-cream-300 px-3 py-2.5 text-xs">
                      <input
                        type="checkbox"
                        checked={Boolean(values[definition.key])}
                        onChange={(event) =>
                          setValues({ ...values, [definition.key]: event.target.checked })
                        }
                        className="accent-forest-700"
                      />
                      فعال باشد
                    </label>
                  ) : definition.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={String(values[definition.key] ?? '')}
                      onChange={(event) => setValues({ ...values, [definition.key]: event.target.value })}
                      className="input"
                    />
                  ) : definition.type === 'image' ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={String(values[definition.key] || '')}
                        alt=""
                        className="h-12 w-16 rounded border border-cream-300 object-cover"
                      />
                      <input
                        dir="ltr"
                        value={String(values[definition.key] ?? '')}
                        onChange={(event) => setValues({ ...values, [definition.key]: event.target.value })}
                        className="input text-[11px]"
                      />
                      <label className="btn-outline btn-sm shrink-0 cursor-pointer">
                        {uploading === definition.key ? '…' : 'بارگذاری'}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) void uploadImage(definition.key, file);
                            event.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <input
                      type={definition.type === 'number' ? 'number' : 'text'}
                      value={String(values[definition.key] ?? '')}
                      onChange={(event) =>
                        setValues({
                          ...values,
                          [definition.key]: definition.type === 'number' ? Number(event.target.value) : event.target.value,
                        })
                      }
                      className="input"
                      dir={['email', 'instagram', 'telegram', 'whatsapp'].includes(definition.key) ? 'ltr' : undefined}
                    />
                  )}
                  {definition.key === 'paymentOnlineEnabled' && (
                    <p className="hint">
                      پرداخت آنلاین فقط پس از ثبت اطلاعات درگاه بانکی در تنظیمات سرور (متغیرهای PAYMENT_GATEWAY_URL و
                      PAYMENT_GATEWAY_KEY) برای مشتری نمایش داده می‌شود.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="flex justify-end">
          <button type="button" onClick={save} disabled={saving} className="btn-primary btn-sm">
            {saving ? 'در حال ذخیره…' : 'ذخیره تنظیمات'}
          </button>
        </div>
      </div>
    </>
  );
}
