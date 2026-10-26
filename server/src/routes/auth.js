import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../db.js';
import { signIn, signOut, requireAuth, publicUser } from '../auth.js';
import { asyncHandler, parseBody, badRequest, unauthorized, notFound } from '../util.js';
import { mergeGuestCart } from './cart.js';

const router = express.Router();

const emailField = z.string().trim().toLowerCase().email('ایمیل وارد شده معتبر نیست.');
const passwordField = z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد.');

const registerSchema = z.object({
  name: z.string().trim().min(3, 'نام و نام خانوادگی را کامل وارد کنید.'),
  email: emailField,
  password: passwordField,
  phone: z.string().trim().regex(/^0?9\d{9}$/, 'شماره همراه باید ۱۱ رقم و با ۰۹ شروع شود.').optional().or(z.literal('')),
});

const loginSchema = z.object({ email: emailField, password: z.string().min(1, 'رمز عبور را وارد کنید.') });

// small in-memory guard against password guessing
const attempts = new Map();
const rateLimit = (key) => {
  const now = Date.now();
  const entry = attempts.get(key) || { count: 0, at: now };
  if (now - entry.at > 15 * 60 * 1000) {
    entry.count = 0;
    entry.at = now;
  }
  if (entry.count >= 10) throw badRequest('تلاش‌های ناموفق زیاد بوده است. چند دقیقه بعد دوباره امتحان کنید.');
};

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = parseBody(registerSchema, req.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw badRequest('این ایمیل قبلاً ثبت شده است. می‌توانید وارد شوید.');
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        passwordHash: await bcrypt.hash(data.password, 10),
      },
    });
    await mergeGuestCart(req, res, user.id);
    signIn(res, user);
    res.status(201).json({ user: publicUser(user) });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = parseBody(loginSchema, req.body);
    rateLimit(data.email);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    const ok = user && (await bcrypt.compare(data.password, user.passwordHash));
    if (!ok) {
      attempts.set(data.email, { count: (attempts.get(data.email)?.count || 0) + 1, at: Date.now() });
      throw unauthorized('ایمیل یا رمز عبور نادرست است.');
    }
    attempts.delete(data.email);
    await mergeGuestCart(req, res, user.id);
    signIn(res, user);
    res.json({ user: publicUser(user) });
  })
);

router.post('/logout', (req, res) => {
  signOut(res);
  res.json({ ok: true });
});

router.get('/me', (req, res) => res.json({ user: req.user }));

const profileSchema = z.object({
  name: z.string().trim().min(3, 'نام و نام خانوادگی را کامل وارد کنید.'),
  email: emailField,
  phone: z.string().trim().regex(/^0?9\d{9}$/, 'شماره همراه باید ۱۱ رقم و با ۰۹ شروع شود.').optional().or(z.literal('')),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

router.patch(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = parseBody(profileSchema, req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw unauthorized();
    const update = { name: data.name, email: data.email, phone: data.phone || null };
    if (data.newPassword) {
      if (!data.currentPassword) throw badRequest('برای تغییر رمز، رمز عبور فعلی را وارد کنید.');
      if (data.newPassword.length < 6) throw badRequest('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
      const ok = await bcrypt.compare(data.currentPassword, user.passwordHash);
      if (!ok) throw badRequest('رمز عبور فعلی درست نیست.');
      update.passwordHash = await bcrypt.hash(data.newPassword, 10);
    }
    const updated = await prisma.user.update({ where: { id: user.id }, data: update });
    res.json({ user: publicUser(updated) });
  })
);

router.get(
  '/orders',
  requireAuth,
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    res.json({ orders });
  })
);

router.get(
  '/orders/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: true },
    });
    if (!order) throw notFound('سفارش مورد نظر یافت نشد.');
    res.json({ order });
  })
);

export default router;
