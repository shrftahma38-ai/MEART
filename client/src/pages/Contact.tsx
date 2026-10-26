import { useState } from 'react';
import { api, errMessage } from '../lib/api';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { Seo } from '../components/ui/Seo';
import { ErrorBox } from '../components/ui/States';
import { GoldDivider } from '../components/ui/Section';
import { IconClock, IconInstagram, IconMail, IconPhone, IconPin, IconTelegram, IconWhatsapp } from '../components/ui/Icons';

export function Contact() {
  const { settings } = useSettings();
  const { push } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSending(true);
    try {
      await api('/contact', { method: 'POST', body: form });
      setSent(true);
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
      push('پیام شما ثبت شد. به‌زودی با شما تماس می‌گیریم.');
    } catch (err) {
      setError(errMessage(err));
    } finally {
      setSending(false);
    }
  };

  const items = [
    { icon: IconPhone, label: 'تلفن ثابت', value: settings.phone, ltr: true },
    { icon: IconPhone, label: 'شماره همراه', value: settings.mobile, ltr: true },
    { icon: IconMail, label: 'ایمیل', value: settings.email, ltr: true },
    { icon: IconPin, label: 'نشانی', value: settings.address },
    { icon: IconClock, label: 'ساعات کاری', value: settings.workingHours },
  ].filter((item) => item.value);

  const socials = [
    { href: settings.instagram, icon: IconInstagram, label: 'اینستاگرام' },
    { href: settings.telegram, icon: IconTelegram, label: 'تلگرام' },
    { href: settings.whatsapp, icon: IconWhatsapp, label: 'واتساپ' },
  ].filter((item) => item.href);

  return (
    <>
      <Seo title="تماس با ما" description="راه‌های ارتباط با پارچه‌سرای عرب‌زاده و فرم ارسال پیام." />
      <div className="border-b border-gold-200/60 bg-cream-200/50 py-8">
        <div className="container-page text-center">
          <h1 className="text-xl font-extrabold text-forest-700 md:text-2xl">تماس با ما</h1>
          <p className="mt-1.5 text-xs text-ink/55">
            برای مشاوره انتخاب پارچه، استعلام قیمت یا سفارش عمده با ما در ارتباط باشید.
          </p>
          <GoldDivider />
        </div>
      </div>

      <div className="container-page grid gap-5 py-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="card space-y-4 p-6">
          <h2 className="text-sm font-bold text-forest-700">ارسال پیام</h2>
          {error && <ErrorBox message={error} />}
          {sent && (
            <div className="rounded-lg border border-forest-100 bg-forest-50 px-4 py-3 text-xs text-forest-700">
              پیام شما ثبت شد. در اولین فرصت با شما تماس می‌گیریم.
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="cName">نام و نام خانوادگی *</label>
              <input
                id="cName"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="cPhone">شماره تماس *</label>
              <input
                id="cPhone"
                required
                inputMode="numeric"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="input num"
              />
            </div>
            <div>
              <label className="label" htmlFor="cEmail">ایمیل (اختیاری)</label>
              <input
                id="cEmail"
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="cSubject">موضوع</label>
              <input
                id="cSubject"
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="cMessage">متن پیام *</label>
            <textarea
              id="cMessage"
              required
              rows={5}
              minLength={10}
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              className="input"
            />
          </div>
          <button type="submit" disabled={sending} className="btn-primary">
            {sending ? 'در حال ارسال…' : 'ارسال پیام'}
          </button>
        </form>

        <aside className="card h-fit p-5">
          <h2 className="mb-4 text-sm font-bold text-forest-700">اطلاعات فروشگاه</h2>
          {items.length === 0 ? (
            <p className="text-xs leading-6 text-ink/55">
              اطلاعات تماس فروشگاه هنوز از پنل مدیریت تکمیل نشده است. می‌توانید از فرم همین صفحه پیام بگذارید.
            </p>
          ) : (
            <ul className="space-y-3 text-xs">
              {items.map(({ icon: Icon, label, value, ltr }) => (
                <li key={label} className="flex items-start gap-2.5">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                  <span>
                    <span className="block text-[11px] text-ink/45">{label}</span>
                    <span className={`block font-semibold text-forest-700 ${ltr ? 'num' : ''}`} dir={ltr ? 'ltr' : undefined}>
                      {value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {socials.length > 0 && (
            <div className="mt-5 border-t border-cream-300 pt-4">
              <p className="mb-2 text-[11px] text-ink/45">شبکه‌های اجتماعی</p>
              <div className="flex gap-2">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="rounded-full border border-gold-200 p-2 text-forest-700 transition hover:border-gold-400 hover:bg-gold-100/50"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <p className="mt-5 rounded-md bg-cream-200/60 px-3 py-2.5 text-[11px] leading-5 text-ink/55">
            برای استعلام قیمت پارچه‌های بدون قیمت، نام پارچه و مقدار مورد نیاز را در پیام خود ذکر کنید.
          </p>
        </aside>
      </div>
    </>
  );
}
