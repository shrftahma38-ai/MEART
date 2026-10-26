import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAdmin } from '../auth.js';
import { asyncHandler, parseBody, badRequest, notFound, slugify } from '../util.js';
import { SETTING_DEFS, getSettings, saveSettings } from '../settings.js';

const router = express.Router();
router.use(requireAdmin);

/* ------------------------------------------------------------------ dashboard */
router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const [products, withoutPrice, orders, pending, customers, messages, recent] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { price: null } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 6, include: { items: true } }),
    ]);
    const paid = await prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true },
    });
    res.json({
      stats: { products, withoutPrice, orders, pending, customers, messages, revenue: paid._sum.total || 0 },
      recentOrders: recent,
    });
  })
);

/* ------------------------------------------------------------------ uploads */
const uploadDir = process.env.UPLOAD_DIR || path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`);
    },
  }),
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(badRequest('فقط فایل تصویری قابل بارگذاری است.'));
    cb(null, true);
  },
});

router.post(
  '/upload',
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw badRequest('فایلی انتخاب نشده است.');
    res.status(201).json({ url: `/api/uploads/${req.file.filename}` });
  })
);

/* ------------------------------------------------------------------ products */
const nullablePrice = z
  .union([z.coerce.number().int('قیمت باید عدد صحیح باشد.'), z.null(), z.literal('')])
  .transform((value) => (value === '' || value === null ? null : value))
  .refine((value) => value === null || value >= 0, { message: 'قیمت نمی‌تواند منفی باشد.' });

const productSchema = z.object({
  name: z.string().trim().min(2, 'نام محصول را وارد کنید.'),
  slug: z.string().trim().optional().or(z.literal('')),
  categoryId: z.string().min(1, 'دسته‌بندی محصول را انتخاب کنید.'),
  price: nullablePrice,
  salePrice: nullablePrice,
  shortDescription: z.string().trim().optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
  texture: z.string().trim().optional().or(z.literal('')),
  stock: z.coerce.number().min(0, 'موجودی نمی‌تواند منفی باشد.').default(0),
  minQty: z.coerce.number().positive('حداقل مقدار سفارش باید بیشتر از صفر باشد.').default(1),
  unit: z.string().trim().min(1, 'واحد فروش را وارد کنید.').default('متر'),
  sku: z.string().trim().optional().or(z.literal('')),
  isAvailable: z.boolean().default(true),
  isActive: z.boolean().default(true),
  showOnHome: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  images: z.array(z.object({ url: z.string().trim().min(1) })).default([]),
  colors: z
    .array(
      z.object({
        name: z.string().trim().min(1, 'نام رنگ را وارد کنید.'),
        hex: z.string().trim().regex(/^#?[0-9a-fA-F]{6}$/, 'کد رنگ معتبر نیست.'),
        image: z.string().trim().optional().or(z.literal('')),
      })
    )
    .default([]),
});

async function uniqueSlug(base, ignoreId) {
  const clean = slugify(base) || `product-${Date.now()}`;
  let candidate = clean;
  let i = 1;
  while (
    await prisma.product.findFirst({ where: { slug: candidate, ...(ignoreId ? { id: { not: ignoreId } } : {}) } })
  ) {
    candidate = `${clean}-${i++}`;
  }
  return candidate;
}

router.get(
  '/products',
  asyncHandler(async (req, res) => {
    const q = String(req.query.q || '').trim();
    const filter = String(req.query.filter || '');
    const where = {};
    if (q) where.name = { contains: q, mode: 'insensitive' };
    if (filter === 'no-price') where.price = null;
    if (filter === 'inactive') where.isActive = false;
    const products = await prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { category: true, images: true, colors: true },
    });
    res.json({ products, categories: await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }) });
  })
);

router.get(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: { orderBy: { sortOrder: 'asc' } }, colors: { orderBy: { sortOrder: 'asc' } }, category: true },
    });
    if (!product) throw notFound('محصول یافت نشد.');
    res.json({ product });
  })
);

router.post(
  '/products',
  asyncHandler(async (req, res) => {
    const data = parseBody(productSchema, req.body);
    if (data.price != null && data.salePrice != null && data.salePrice >= data.price)
      throw badRequest('قیمت با تخفیف باید کمتر از قیمت اصلی باشد.');
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: await uniqueSlug(data.slug || data.name),
        categoryId: data.categoryId,
        price: data.price,
        salePrice: data.salePrice,
        shortDescription: data.shortDescription || null,
        description: data.description || null,
        texture: data.texture || null,
        stock: data.stock,
        minQty: data.minQty,
        unit: data.unit,
        sku: data.sku || null,
        isAvailable: data.isAvailable,
        isActive: data.isActive,
        showOnHome: data.showOnHome,
        isNew: data.isNew,
        isBestSeller: data.isBestSeller,
        sortOrder: data.sortOrder,
        images: { create: data.images.map((img, i) => ({ url: img.url, sortOrder: i })) },
        colors: {
          create: data.colors.map((color, i) => ({
            name: color.name,
            hex: color.hex.startsWith('#') ? color.hex : `#${color.hex}`,
            image: color.image || null,
            sortOrder: i,
          })),
        },
      },
      include: { images: true, colors: true },
    });
    res.status(201).json({ product });
  })
);

router.patch(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) throw notFound('محصول یافت نشد.');
    const data = parseBody(productSchema, req.body);
    if (data.price != null && data.salePrice != null && data.salePrice >= data.price)
      throw badRequest('قیمت با تخفیف باید کمتر از قیمت اصلی باشد.');
    const product = await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: existing.id } });
      await tx.productColor.deleteMany({ where: { productId: existing.id } });
      return tx.product.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          slug: data.slug && data.slug !== existing.slug ? await uniqueSlug(data.slug, existing.id) : existing.slug,
          categoryId: data.categoryId,
          price: data.price,
          salePrice: data.salePrice,
          shortDescription: data.shortDescription || null,
          description: data.description || null,
          texture: data.texture || null,
          stock: data.stock,
          minQty: data.minQty,
          unit: data.unit,
          sku: data.sku || null,
          isAvailable: data.isAvailable,
          isActive: data.isActive,
          showOnHome: data.showOnHome,
          isNew: data.isNew,
          isBestSeller: data.isBestSeller,
          sortOrder: data.sortOrder,
          images: { create: data.images.map((img, i) => ({ url: img.url, sortOrder: i })) },
          colors: {
            create: data.colors.map((color, i) => ({
              name: color.name,
              hex: color.hex.startsWith('#') ? color.hex : `#${color.hex}`,
              image: color.image || null,
              sortOrder: i,
            })),
          },
        },
        include: { images: true, colors: true },
      });
    });
    res.json({ product });
  })
);

router.patch(
  '/products/:id/price',
  asyncHandler(async (req, res) => {
    const schema = z.object({ price: nullablePrice, salePrice: nullablePrice.optional() });
    const data = parseBody(schema, req.body);
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) throw notFound('محصول یافت نشد.');
    const salePrice = data.salePrice === undefined ? existing.salePrice : data.salePrice;
    if (data.price != null && salePrice != null && salePrice >= data.price)
      throw badRequest('قیمت با تخفیف باید کمتر از قیمت اصلی باشد.');
    const product = await prisma.product.update({
      where: { id: existing.id },
      data: { price: data.price, salePrice },
    });
    res.json({ product });
  })
);

router.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) throw notFound('محصول یافت نشد.');
    await prisma.product.delete({ where: { id: product.id } });
    res.json({ ok: true });
  })
);

/* ------------------------------------------------------------------ categories */
const categorySchema = z.object({
  name: z.string().trim().min(2, 'نام دسته‌بندی را وارد کنید.'),
  slug: z.string().trim().optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
  image: z.string().trim().optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().default(0),
});

router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    res.json({ categories });
  })
);

router.post(
  '/categories',
  asyncHandler(async (req, res) => {
    const data = parseBody(categorySchema, req.body);
    const base = slugify(data.slug || data.name);
    let slug = base;
    let i = 1;
    while (await prisma.category.findUnique({ where: { slug } })) slug = `${base}-${i++}`;
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        image: data.image || null,
        sortOrder: data.sortOrder,
      },
    });
    res.status(201).json({ category });
  })
);

router.patch(
  '/categories/:id',
  asyncHandler(async (req, res) => {
    const data = parseBody(categorySchema, req.body);
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        name: data.name,
        description: data.description || null,
        image: data.image || null,
        sortOrder: data.sortOrder,
      },
    });
    res.json({ category });
  })
);

router.delete(
  '/categories/:id',
  asyncHandler(async (req, res) => {
    const count = await prisma.product.count({ where: { categoryId: req.params.id } });
    if (count > 0) throw badRequest('این دسته‌بندی محصول دارد و قابل حذف نیست. ابتدا محصولات را جابه‌جا کنید.');
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  })
);

/* ------------------------------------------------------------------ orders */
router.get(
  '/orders',
  asyncHandler(async (req, res) => {
    const status = String(req.query.status || '');
    const q = String(req.query.q || '').trim();
    const where = {};
    if (status) where.status = status;
    if (q) where.OR = [{ number: { contains: q } }, { phone: { contains: q } }, { customerName: { contains: q } }];
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
      take: 200,
    });
    res.json({ orders });
  })
);

router.get(
  '/orders/:id',
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
    if (!order) throw notFound('سفارش یافت نشد.');
    res.json({ order });
  })
);

router.patch(
  '/orders/:id',
  asyncHandler(async (req, res) => {
    const schema = z.object({
      status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
      paymentStatus: z.enum(['UNPAID', 'AWAITING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
      note: z.string().optional(),
      shippingCost: z.coerce.number().min(0).optional(),
    });
    const data = parseBody(schema, req.body);
    const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!existing) throw notFound('سفارش یافت نشد.');
    const shippingCost = data.shippingCost ?? existing.shippingCost;
    const order = await prisma.order.update({
      where: { id: existing.id },
      data: {
        status: data.status ?? existing.status,
        paymentStatus: data.paymentStatus ?? existing.paymentStatus,
        note: data.note ?? existing.note,
        shippingCost,
        total: existing.subtotal + shippingCost,
      },
      include: { items: true },
    });
    res.json({ order });
  })
);

/* ------------------------------------------------------------------ customers & messages */
router.get(
  '/customers',
  asyncHandler(async (_req, res) => {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      include: { orders: { select: { total: true, status: true } } },
    });
    res.json({
      customers: customers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        createdAt: c.createdAt,
        orderCount: c.orders.length,
        totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
      })),
    });
  })
);

router.get(
  '/messages',
  asyncHandler(async (_req, res) => {
    res.json({ messages: await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }) });
  })
);

router.patch(
  '/messages/:id',
  asyncHandler(async (req, res) => {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead: Boolean(req.body?.isRead) },
    });
    res.json({ message });
  })
);

/* ------------------------------------------------------------------ settings & pages */
router.get(
  '/settings',
  asyncHandler(async (_req, res) => {
    res.json({ settings: await getSettings(), definitions: SETTING_DEFS });
  })
);

router.patch(
  '/settings',
  asyncHandler(async (req, res) => {
    await saveSettings(req.body || {});
    res.json({ settings: await getSettings() });
  })
);

router.get(
  '/pages',
  asyncHandler(async (_req, res) => {
    res.json({ pages: await prisma.page.findMany({ orderBy: { slug: 'asc' } }) });
  })
);

router.patch(
  '/pages/:id',
  asyncHandler(async (req, res) => {
    const schema = z.object({ title: z.string().trim().min(2, 'عنوان صفحه را وارد کنید.'), body: z.string() });
    const data = parseBody(schema, req.body);
    const page = await prisma.page.update({ where: { id: req.params.id }, data });
    res.json({ page });
  })
);

export default router;
