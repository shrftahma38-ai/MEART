import { InquiryForm } from '../components/forms/InquiryForm';
import { PageBanner } from '../components/layout/PageBanner';
import { Icon } from '../components/ui/Icon';
import { EDITORIAL } from '../lib/editorial';
import { imageSrcSet, imageUrl } from '../lib/images';
import { CONTACT, SOCIALS } from '../lib/navigation';

export function Contact() {
  return (
    <>
      <PageBanner
        label="Contact"
        title="Speak with an advisor"
        description="Whether you are buying, selling or simply weighing up a move, start with a conversation. We reply within one business day."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      <section className="bg-white py-14 lg:py-20">
        <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <h2 className="font-display text-[1.5rem] font-medium text-navy">Office &amp; details</h2>

            <dl className="mt-8 space-y-7">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/15 text-champagne-dark">
                  <Icon name="phone" size={17} />
                </span>
                <div>
                  <dt className="font-sans text-[0.6875rem] uppercase tracking-label text-slate-soft">
                    Telephone
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={CONTACT.phoneHref}
                      className="font-display text-[1.0625rem] font-medium text-navy transition-colors duration-300 hover:text-champagne-dark"
                    >
                      {CONTACT.phone}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/15 text-champagne-dark">
                  <Icon name="mail" size={17} />
                </span>
                <div>
                  <dt className="font-sans text-[0.6875rem] uppercase tracking-label text-slate-soft">
                    Email
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={CONTACT.emailHref}
                      className="font-display text-[1.0625rem] font-medium text-navy transition-colors duration-300 hover:text-champagne-dark"
                    >
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/15 text-champagne-dark">
                  <Icon name="pin" size={17} />
                </span>
                <div>
                  <dt className="font-sans text-[0.6875rem] uppercase tracking-label text-slate-soft">
                    Office
                  </dt>
                  <dd className="mt-2 text-[1.0625rem] leading-relaxed text-navy">
                    {CONTACT.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/15 text-champagne-dark">
                  <Icon name="calendar" size={17} />
                </span>
                <div>
                  <dt className="font-sans text-[0.6875rem] uppercase tracking-label text-slate-soft">
                    Hours
                  </dt>
                  <dd className="mt-2 text-[1.0625rem] text-navy">{CONTACT.hours}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-10 overflow-hidden rounded">
              <img
                src={imageUrl(EDITORIAL.contact, 900)}
                srcSet={imageSrcSet(EDITORIAL.contact, [560, 900, 1200])}
                sizes="(max-width: 1024px) 92vw, 38vw"
                alt="A water-facing residence lit in the evening"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <ul className="mt-8 flex gap-3">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Horizon Properties on ${social.label}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white"
                  >
                    <Icon name={social.icon} size={17} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded border border-navy/10 p-6 sm:p-9">
              <p className="label text-champagne-dark">Enquiry</p>
              <h2 className="mt-4 font-display text-[1.625rem] font-medium text-navy">
                Tell us what you are looking for
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate">
                Buying, selling, investing or relocating — a short note is enough to start. If you
                have a property in mind, mention it and we will pull the file before we reply.
              </p>

              <InquiryForm
                kind="contact"
                tone="light"
                submitLabel="Send enquiry"
                messageLabel="How can we help?"
                messagePlaceholder="A few lines about what you are looking for, your timeline and your budget."
                className="mt-8"
                successTitle="Thank you — your message is with us"
                successBody="An advisor will reply within one business day."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
