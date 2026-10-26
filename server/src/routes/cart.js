import express from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { prisma } from '../db.js';
import { asyncHandler, parseBody, badRequest, notFound } from '../util.js';
import { getSettings } from '../settings.js';

const router = express.Router();
const CART_COOKIE = 'az_cart';
const YEAR = 1000 * 60 * 60 * 24 * 365;

export const effectivePrice = (product) =>
  product.price != null && product.salePrice != null && product.salePrice > 0 && product.salePrice < product.price
    ? product.salePrice
    : product.price;

const cartCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: YEAR,
  path: '/',
});

/** Finds (or creates) the cart for the visitor, preferring the signed-in user's cart. */
export async function resolveCart(req, res, { create = true } = {}) {
  if (req.user) {
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart && create) {
      cart = await prisma.cart.create({ data: { token: `u_${randomUUID()}`, userId: req.user.id } });
    }
    return cart;
  }
  const token = req.cookies?.[CART_COOKIE];
  if (token) {
    const cart = await prisma.cart.findUnique({ where: { token } });
    if (cart) return cart;
  }
  if (!create) return null;
  const newToken = randomUUID();
  res.cookie(CART_COOKIE, newToken, cartCookieOptions());
  return prisma.cart.create({ data: { token: newToken } });
}

/** After login/registration: move guest cart lines into the user's cart. */
export async function mergeGuestCart(req, res, userId) {
  const token = req.cookies?.[CART_COOKIE];
  if (!token) return;
  const guestCart = await prisma.cart.findUnique({ where: { token }, include: { items: true } });
  if (!guestCart) return;
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { token: `u_${randomUUID()}`, userId } });
  }
  for (const item of guestCart.items) {
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: item.productId, colorId: item.colorId },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          colorId: item.colorId,
          colorName: item.colorName,
          quantity: item.quantity,
        },
      });
    }
  }
  await prisma.cart.delete({ where: { id: guestCart.id } });
  res.clearCookie(CART_COOKIE, { path: '/' });
}

/** Cart payload shared by the cart page, the header badge and checkout. */
export async function serializeCart(cartId) {
  const settings = await getSettings();
  const items = cartId
    ? await prisma.cartItem.findMany({
        where: { cartId },
        orderBy: { createdAt: 'asc' },
        include: { product: { include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 }, category: true } } },
      })
    : [];

  const lines = items.map((item) => {
    const unitPrice = effectivePrice(item.product);
    const available =
      item.product.isActive && item.product.isAvailable && item.product.stock >= item.quantity && unitPrice != null;
    return {
      id: item.id,
      productId: item.productId,
      slug: item.product.slug,
      name: item.product.name,
      colorId: item.colorId,
      colorName: item.colorName,
      image: item.product.images[0]?.url || null,
      unit: item.product.unit,
      quantity: item.quantity,
      minQty: item.product.minQty,
      stock: item.product.stock,
      unitPrice,
      lineTotal: unitPrice != null ? Math.round(unitPrice * item.quantity) : null,
      available,
      issue: !available
        ? unitPrice == null
          ? 'قیمت این محصول هنوز ثبت نشده است.'
          : !item.product.isAvailable || item.product.stock < item.quantity
            ? 'موجودی کافی نیست.'
            : 'این محصول در حال حاضر قابل خرید نیست.'
        : null,
    };
  });

  const subtotal = lines.reduce((sum, line) => sum + (line.lineTotal || 0), 0);
  let shippingCost = subtotal > 0 ? settings.shippingCost : 0;
  if (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold) shippingCost = 0;
  const hasBlockingIssue = lines.some((line) => !line.available);
  return {
    items: lines,
    count: lines.length,
    subtotal,
    shippingCost,
    freeShippingThreshold: settings.freeShippingThreshold,
    total: subtotal + shippingCost,
    hasBlockingIssue,
    currency: settings.currency,
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const cart = await resolveCart(req, res, { create: false });
    res.json({ cart: await serializeCart(cart?.id) });
  })
);

const addSchema = z.object({
  productId: z.string().min(1, 'شناسه محصول نامعتبر است.'),
  colorId: z.string().nullable().optional(),
  quantity: z.coerce.number().positive('تعداد سفارش باید بیشتر از صفر باشد.'),
});

router.post(
  '/items',
  asyncHandler(async (req, res) => {
    const data = parseBody(addSchema, req.body);
    const product = await prisma.product.findUnique({ where: { id: data.productId }, include: { colors: true } });
    if (!product || !product.isActive) throw notFound('این محصول در دسترس نیست.');
    if (effectivePrice(product) == null) throw badRequest('قیمت این محصول هنوز ثبت نشده است و قابل خرید نیست.');
    if (!product.isAvailable) throw badRequest('این محصول در حال حاضر ناموجود است.');
    if (data.quantity < product.minQty) throw badRequest(`حداقل مقدار سفارش ${product.minQty} ${product.unit} است.`);
    if (product.stock < data.quantity) throw badRequest('موجودی کافی برای این مقدار سفارش وجود ندارد.');
    const color = data.colorId ? product.colors.find((c) => c.id === data.colorId) : null;
    if (data.colorId && !color) throw badRequest('رنگ انتخاب‌شده برای این محصول موجود نیست.');

    const cart = await resolveCart(req, res);
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: product.id, colorId: data.colorId || null },
    });
    const quantity = (existing?.quantity || 0) + data.quantity;
    if (product.stock < quantity) throw badRequest('موجودی انبار برای این مقدار کافی نیست.');
    if (existing) {
      await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity } });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          colorId: color?.id || null,
          colorName: color?.name || null,
          quantity: data.quantity,
        },
      });
    }
    res.json({ cart: await serializeCart(cart.id) });
  })
);

const updateSchema = z.object({ quantity: z.coerce.number().positive('تعداد سفارش باید بیشتر از صفر باشد.') });

router.patch(
  '/items/:id',
  asyncHandler(async (req, res) => {
    const data = parseBody(updateSchema, req.body);
    const cart = await resolveCart(req, res, { create: false });
    if (!cart) throw notFound('سبد خرید خالی است.');
    const item = await prisma.cartItem.findFirst({
      where: { id: req.params.id, cartId: cart.id },
      include: { product: true },
    });
    if (!item) throw notFound('این محصول در سبد خرید شما نیست.');
    if (data.quantity < item.product.minQty)
      throw badRequest(`حداقل مقدار سفارش ${item.product.minQty} ${item.product.unit} است.`);
    if (item.product.stock < data.quantity) throw badRequest('موجودی کافی برای این مقدار سفارش وجود ندارد.');
    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: data.quantity } });
    res.json({ cart: await serializeCart(cart.id) });
  })
);

router.delete(
  '/items/:id',
  asyncHandler(async (req, res) => {
    const cart = await resolveCart(req, res, { create: false });
    if (!cart) throw notFound('سبد خرید خالی است.');
    await prisma.cartItem.deleteMany({ where: { id: req.params.id, cartId: cart.id } });
    res.json({ cart: await serializeCart(cart.id) });
  })
);

router.delete(
  '/',
  asyncHandler(async (req, res) => {
    const cart = await resolveCart(req, res, { create: false });
    if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.json({ cart: await serializeCart(cart?.id) });
  })
);

export default router;
