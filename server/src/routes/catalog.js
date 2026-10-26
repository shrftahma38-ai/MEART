import express from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { asyncHandler, parseBody, notFound } from '../util.js';
import { publicSettings } from '../settings.js';
import { effectivePrice } from './cart.js';

const router = express.Router();

const withPrice = (product) => ({ ...product, effectivePrice: effectivePrice(product) });

router.get(
  '/settings',
  asyncHandler(async (_req, res) => {
    res.json({ settings: await publicSettings() });
  })
);

router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    });
    res.json({
      categories: categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        image: c.image,
        productCount: c._count.products,
      })),
    });
  })
);

router.get(
  '/products',
  asyncHandler(async (req, res) => {
    const { q, category, color, sort = 'newest', featured, newOnly, onHome } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(48, Math.max(1, Number(req.query.limit) || 12));

    const where = { isActive: true };
    if (category) where.category = { slug: String(category) };
    if (q) {
      const term = String(q).trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { slug: { contains: term, mode: 'insensitive' } },
        { shortDescription: { contains: term, mode: 'insensitive' } },
        { category: { name: { contains: term, mode: 'insensitive' } } },
      ];
    }
    if (color) where.colors = { some: { hex: String(color) } };
    if (featured === '1') where.isBestSeller = true;
    if (newOnly === '1') where.isNew = true;
    if (onHome === '1') where.showOnHome = true;

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        colors: { orderBy: { sortOrder: 'asc' } },
      },
    });

    const sorted = products.map(withPrice);
    if (sort === 'price-asc') {
      sorted.sort((a, b) => (a.effectivePrice ?? Infinity) - (b.effectivePrice ?? Infinity));
    } else if (sort === 'price-desc') {
      sorted.sort((a, b) => (b.effectivePrice ?? -Infinity) - (a.effectivePrice ?? -Infinity));
    } else if (sort === 'popular') {
      sorted.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.createdAt - a.createdAt);
    } else {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    const total = sorted.length;
    const items = sorted.slice((page - 1) * limit, page * limit);

    const colorRows = await prisma.productColor.findMany({
      where: { product: { isActive: true } },
      select: { name: true, hex: true },
    });
    const colorMap = new Map();
    for (const row of colorRows) {
      const key = row.hex;
      const entry = colorMap.get(key) || { hex: row.hex, name: row.name, count: 0 };
      entry.count += 1;
      colorMap.set(key, entry);
    }

    res.json({
      products: items,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      limit,
      colors: [...colorMap.values()].sort((a, b) => b.count - a.count),
    });
  })
);

router.get(
  '/products/:slug',
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        colors: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!product || !product.isActive) throw notFound('این محصول یافت نشد.');
    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
      take: 8,
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 }, colors: true, category: true },
    });
    res.json({ product: withPrice(product), related: related.map(withPrice) });
  })
);

router.get(
  '/pages',
  asyncHandler(async (_req, res) => {
    const pages = await prisma.page.findMany({ select: { slug: true, title: true } });
    res.json({ pages });
  })
);

router.get(
  '/pages/:slug',
  asyncHandler(async (req, res) => {
    const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
    if (!page) throw notFound('این صفحه یافت نشد.');
    res.json({ page });
  })
);

const contactSchema = z.object({
  name: z.string().trim().min(3, 'نام خود را کامل وارد کنید.'),
  phone: z.string().trim().regex(/^0?9\d{9}$/, 'شماره تماس باید ۱۱ رقم و با ۰۹ شروع شود.'),
  email: z.string().trim().email('ایمیل معتبر نیست.').optional().or(z.literal('')),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, 'متن پیام باید حداقل ۱۰ کاراکتر باشد.'),
});

router.post(
  '/contact',
  asyncHandler(async (req, res) => {
    const data = parseBody(contactSchema, req.body);
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        subject: data.subject || null,
        message: data.message,
      },
    });
    res.status(201).json({ ok: true, message: 'پیام شما ثبت شد. به‌زودی با شما تماس می‌گیریم.' });
  })
);

export default router;
