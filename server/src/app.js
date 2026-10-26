import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { attachUser } from './auth.js';
import { HttpError } from './util.js';
import authRoutes from './routes/auth.js';
import catalogRoutes from './routes/catalog.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payment.js';

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(attachUser);

const uploadDir = process.env.UPLOAD_DIR || path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });
app.use('/api/uploads', express.static(uploadDir, { maxAge: '30d' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', catalogRoutes);

app.use('/api', (_req, res) => res.status(404).json({ error: 'مسیر درخواستی یافت نشد.' }));

app.use((err, _req, res, _next) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  if (err?.code === 'P2002') return res.status(409).json({ error: 'این مورد از قبل ثبت شده است.' });
  console.error('[api error]', err);
  res.status(500).json({ error: 'خطای غیرمنتظره در سرور رخ داد. لطفاً دوباره تلاش کنید.' });
});

export default app;
