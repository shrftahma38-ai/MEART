import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { StorePage } from '../lib/types';
import { Seo } from '../components/ui/Seo';
import { ErrorBox, Spinner } from '../components/ui/States';
import { GoldDivider } from '../components/ui/Section';

const TITLES: Record<string, string> = {
  about: 'درباره ما',
  faq: 'سؤالات متداول',
  'buying-guide': 'راهنمای خرید',
  shipping: 'روش‌های ارسال',
  terms: 'قوانین و مقررات',
  privacy: 'حریم خصوصی',
};

export function StaticPage() {
  const { slug = '' } = useParams();
  const [page, setPage] = useState<StorePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    api<{ page: StorePage }>(`/pages/${slug}`)
      .then((data) => alive && setPage(data.page))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [slug]);

  const title = page?.title || TITLES[slug] || 'صفحه';
  const paragraphs = (page?.body || '').split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <Seo title={title} description={paragraphs[0]?.slice(0, 150)} />
      <div className="border-b border-gold-200/60 bg-cream-200/50 py-8">
        <div className="container-page text-center">
          <h1 className="text-xl font-extrabold text-forest-700 md:text-2xl">{title}</h1>
          <GoldDivider />
        </div>
      </div>

      <div className="container-page max-w-3xl py-10">
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="space-y-4">
            <ErrorBox message={error} />
            <Link to="/" className="btn-outline btn-sm">بازگشت به صفحه اصلی</Link>
          </div>
        ) : (
          <div className="card space-y-4 p-6">
            {paragraphs.map((paragraph, index) => {
              const lines = paragraph.split('\n');
              if (lines.length > 1) {
                return (
                  <div key={index} className="space-y-1.5">
                    {lines.map((line, lineIndex) => (
                      <p key={lineIndex} className="text-xs leading-7 text-ink/70">
                        {line}
                      </p>
                    ))}
                  </div>
                );
              }
              return (
                <p key={index} className="text-xs leading-7 text-ink/70">
                  {paragraph}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
