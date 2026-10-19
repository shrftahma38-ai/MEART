import { useState } from 'react';
import { ApiError, api } from '../../lib/api';
import { cx } from '../../lib/cx';
import { Icon } from '../ui/Icon';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Newsletter sign-up used in the footer; stores the address via the API. */
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL.test(email.trim())) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setMessage(null);

    try {
      await api.createInquiry({ kind: 'newsletter', email: email.trim() });
      setStatus('success');
      setMessage('You are on the list — look out for our next collection.');
      setEmail('');
    } catch (cause) {
      setStatus('error');
      setMessage(
        cause instanceof ApiError && cause.fields?.email
          ? cause.fields.email
          : 'Sign-up failed. Please try again.',
      );
    }
  };

  return (
    <form onSubmit={submit} className="mt-5" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center gap-3 border-b border-white/25 pb-2 focus-within:border-champagne">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === 'error') {
              setStatus('idle');
              setMessage(null);
            }
          }}
          placeholder="Your email address"
          autoComplete="email"
          aria-invalid={status === 'error'}
          aria-describedby={message ? 'newsletter-status' : undefined}
          className="h-10 w-full bg-transparent font-sans text-[0.9375rem] text-white placeholder:text-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          aria-label="Subscribe to the newsletter"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:border-champagne hover:bg-champagne hover:text-navy-900 disabled:opacity-50"
        >
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
      {message ? (
        <p
          id="newsletter-status"
          role="status"
          className={cx('mt-3 text-[0.8125rem]', status === 'error' ? 'text-red-300' : 'text-champagne-light')}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
