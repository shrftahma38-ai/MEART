import { useEffect, useState } from 'react';
import { api, errMessage } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { Seo } from '../../components/ui/Seo';
import { Spinner } from '../../components/ui/States';
import { faDateTime } from '../../lib/format';

type Message = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function AdminMessages() {
  const { push } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ messages: Message[] }>('/admin/messages')
      .then((data) => setMessages(data.messages))
      .finally(() => setLoading(false));
  }, []);

  const toggleRead = async (message: Message) => {
    try {
      await api(`/admin/messages/${message.id}`, { method: 'PATCH', body: { isRead: !message.isRead } });
      setMessages((current) =>
        current.map((item) => (item.id === message.id ? { ...item, isRead: !item.isRead } : item))
      );
    } catch (err) {
      push(errMessage(err), 'error');
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <Seo title="پیام‌های مشتریان" />
      <div className="space-y-4">
        <h1 className="text-base font-extrabold text-forest-700">پیام‌های فرم تماس</h1>
        {messages.length === 0 ? (
          <div className="card p-8 text-center text-xs text-ink/50">پیامی ثبت نشده است.</div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`card p-4 ${message.isRead ? '' : 'border-gold-300 bg-gold-100/25'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="font-bold text-forest-700">{message.name}</span>
                    <span className="num mr-2 text-ink/55">{message.phone}</span>
                    {message.email && <span className="mr-2 text-ink/55" dir="ltr">{message.email}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-ink/45">{faDateTime(message.createdAt)}</span>
                    <button type="button" onClick={() => toggleRead(message)} className="btn-outline btn-sm !py-1">
                      {message.isRead ? 'علامت‌زدن به‌عنوان خوانده‌نشده' : 'خوانده شد'}
                    </button>
                  </div>
                </div>
                {message.subject && <p className="mt-2 text-xs font-semibold text-forest-700">{message.subject}</p>}
                <p className="mt-1.5 whitespace-pre-line text-xs leading-6 text-ink/70">{message.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
