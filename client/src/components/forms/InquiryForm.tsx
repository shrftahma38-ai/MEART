import { useState } from 'react';
import { ApiError, api, type InquiryPayload } from '../../lib/api';
import { cx } from '../../lib/cx';
import { Icon } from '../ui/Icon';

type InquiryFormProps = {
  kind: InquiryPayload['kind'];
  propertySlug?: string;
  propertyName?: string;
  submitLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  withPhone?: boolean;
  withDate?: boolean;
  tone?: 'light' | 'dark';
  className?: string;
  successTitle?: string;
  successBody?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The single form used for contact, viewing requests and valuation enquiries. */
export function InquiryForm({
  kind,
  propertySlug,
  propertyName,
  submitLabel = 'Send enquiry',
  messageLabel = 'Message',
  messagePlaceholder = 'Tell us what you are looking for…',
  withPhone = true,
  withDate = false,
  tone = 'dark',
  className,
  successTitle = 'Thank you — your enquiry is with us',
  successBody = 'One of our advisors will reply within one business day.',
}: InquiryFormProps) {
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '', preferredDate: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const onLight = tone === 'light';
  const inputClasses = cx(
    'h-12 w-full rounded-sm border bg-transparent px-4 font-sans text-[0.9375rem] transition-colors duration-200 focus:outline-none',
    onLight
      ? 'border-navy/15 bg-white text-navy placeholder:text-navy/35 focus:border-navy'
      : 'border-white/20 bg-white/5 text-white placeholder:text-white/45 focus:border-champagne',
  );
  const labelClasses = cx('label block', onLight ? 'text-navy/60' : 'text-white/60');

  const update = (key: keyof typeof values, next: string) => {
    setValues((previous) => ({ ...previous, [key]: next }));
    setFieldErrors((previous) => {
      if (!previous[key]) return previous;
      const { [key]: _removed, ...rest } = previous;
      return rest;
    });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: Record<string, string> = {};
    if (values.name.trim().length < 2) errors.name = 'Please tell us your name';
    if (!EMAIL.test(values.email.trim())) errors.email = 'Please enter a valid email address';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError('Please check the highlighted fields.');
      return;
    }

    setStatus('submitting');
    setFormError(null);

    try {
      await api.createInquiry({
        kind,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        message: values.message.trim() || undefined,
        preferredDate: values.preferredDate || undefined,
        propertySlug,
      });
      setStatus('success');
      setValues({ name: '', email: '', phone: '', message: '', preferredDate: '' });
    } catch (cause) {
      setStatus('idle');
      if (cause instanceof ApiError) {
        setFieldErrors(cause.fields ?? {});
        setFormError(
          cause.status === 422 ? 'Please check the highlighted fields.' : 'We could not send your enquiry. Please try again.',
        );
      } else {
        setFormError('We could not send your enquiry. Please try again.');
      }
    }
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        className={cx(
          'flex flex-col items-start gap-4 rounded border p-7',
          onLight ? 'border-champagne/40 bg-champagne/10' : 'border-champagne/40 bg-champagne/10',
          className,
        )}
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne text-champagne-dark">
          <Icon name="check" size={18} />
        </span>
        <h3 className={cx('font-display text-xl font-medium', onLight ? 'text-navy' : 'text-white')}>
          {successTitle}
        </h3>
        <p className={cx('text-[0.9375rem] leading-relaxed', onLight ? 'text-slate' : 'text-white/70')}>
          {successBody}
          {propertyName ? ` We have noted your interest in ${propertyName}.` : ''}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className={cx(
            'font-sans text-[0.6875rem] font-medium uppercase tracking-wide2 transition-colors duration-300',
            onLight ? 'text-navy hover:text-champagne-dark' : 'text-white hover:text-champagne-light',
          )}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={cx('flex flex-col gap-5', className)} noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${kind}-name`} className={labelClasses}>
            Full name
          </label>
          <input
            id={`${kind}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? `${kind}-name-error` : undefined}
            className={cx(inputClasses, 'mt-3', fieldErrors.name && 'border-red-400')}
            placeholder="Your name"
          />
          {fieldErrors.name ? (
            <p id={`${kind}-name-error`} className="mt-2 text-[0.8125rem] text-red-300">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${kind}-email`} className={labelClasses}>
            Email
          </label>
          <input
            id={`${kind}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? `${kind}-email-error` : undefined}
            className={cx(inputClasses, 'mt-3', fieldErrors.email && 'border-red-400')}
            placeholder="you@example.com"
          />
          {fieldErrors.email ? (
            <p id={`${kind}-email-error`} className="mt-2 text-[0.8125rem] text-red-300">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
      </div>

      {withPhone || withDate ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {withPhone ? (
            <div>
              <label htmlFor={`${kind}-phone`} className={labelClasses}>
                Phone <span className="normal-case tracking-normal opacity-70">(optional)</span>
              </label>
              <input
                id={`${kind}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(event) => update('phone', event.target.value)}
                className={cx(inputClasses, 'mt-3')}
                placeholder="(555) 000-0000"
              />
            </div>
          ) : null}

          {withDate ? (
            <div>
              <label htmlFor={`${kind}-date`} className={labelClasses}>
                Preferred date
              </label>
              <input
                id={`${kind}-date`}
                name="preferredDate"
                type="date"
                value={values.preferredDate}
                onChange={(event) => update('preferredDate', event.target.value)}
                className={cx(inputClasses, 'mt-3', !onLight && '[color-scheme:dark]')}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      <div>
        <label htmlFor={`${kind}-message`} className={labelClasses}>
          {messageLabel}
        </label>
        <textarea
          id={`${kind}-message`}
          name="message"
          rows={4}
          value={values.message}
          onChange={(event) => update('message', event.target.value)}
          className={cx(
            'mt-3 w-full resize-y rounded-sm border px-4 py-3 font-sans text-[0.9375rem] transition-colors duration-200 focus:outline-none',
            onLight
              ? 'border-navy/15 bg-white text-navy placeholder:text-navy/35 focus:border-navy'
              : 'border-white/20 bg-white/5 text-white placeholder:text-white/45 focus:border-champagne',
          )}
          placeholder={messagePlaceholder}
        />
      </div>

      {formError ? (
        <p role="alert" className={cx('text-[0.8125rem]', onLight ? 'text-red-600' : 'text-red-300')}>
          {formError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={cx(
            'group/btn inline-flex h-12 items-center justify-center gap-2.5 px-8 font-sans text-[0.6875rem] font-medium uppercase tracking-wide2 transition-all duration-300 ease-editorial disabled:cursor-not-allowed disabled:opacity-60',
            onLight
              ? 'bg-navy text-white hover:bg-navy-700'
              : 'bg-champagne text-navy-900 hover:bg-champagne-light',
          )}
        >
          {status === 'submitting' ? 'Sending…' : submitLabel}
          <Icon
            name="arrow-right"
            size={15}
            className="transition-transform duration-300 group-hover/btn:translate-x-1"
          />
        </button>
        <p className={cx('text-[0.75rem]', onLight ? 'text-slate-soft' : 'text-white/50')}>
          We reply within one business day.
        </p>
      </div>
    </form>
  );
}
