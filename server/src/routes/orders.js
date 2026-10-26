import express from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { prisma } from '../db.js';
import { asyncHandler, parseBody, badRequest, notFound, orderNumber } from '../util.js';
import { getSettings, gatewayConfigured } from '../settings.js';
import { resolveCart, effectivePrice } from './cart.js';

const router = express.Router();

const orderItemInclude = { items: true };

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const schema = z.object({
      customerName: z.string().trim().min(3, 'نام و نام خانوادگی را کامل وارد کنید.'),
      phone: z.string().trim().regex(/^0?9\d{9}$/, 'شماره تماس باید ۱۱ رقم و با ۰۹ شروع شود.'),
      email: z.string().trim().email('ایمیل معتبر نیست.').optional().or(z.literal('')),
      province: z.string().trim().min(2, 'استان را وارد کنید.'),
      city: z.string().trim().min(2, 'شهر را وارد کنید.'),
      address: z.string().trim().min(10, 'نشانی پستی را کامل وارد کنید.'),
      postalCode: z.string().trim().optional().or(z.literal('')),
      note: z.string().trim().max(1000, 'توضیحات سفارش بیش از حد طولانی است.').optional().or(z.literal('')),
      paymentMethod: z.enum(['online', 'cod']).default('cod'),
    });
    const data = parseBody(schema, req.body);
    const settings = await getSettings();

    if (data.paymentMethod === 'online' && (!settings.paymentOnlineEnabled || !gatewayConfigured()))
      throw badRequest('پرداخت آنلاین در حال حاضر فعال نیست.');
    if (data.paymentMethod === 'cod' && !settings.paymentCodEnabled)
      throw badRequest('این روش پرداخت در حال حاضر فعال نیست.');

    const cart = await resolveCart(req, res, { create: false });
    if (!cart) throw badRequest('سبد خرید شما خالی است.');
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });
    if (cartItems.length === 0) throw badRequest('سبد خرید شما خالی است.');

    // prices and stock are re-validated against the database at checkout time
    const lines = cartItems.map((item) => {
      const unitPrice = effectivePrice(item.product);
      if (!item.product.isActive) throw badRequest(`محصول «${item.product.name}» دیگر در فروشگاه موجود نیست.`);
      if (unitPrice == null) throw badRequest(`قیمت محصول «${item.product.name}» هنوز ثبت نشده است.`);
      if (!item.product.isAvailable) throw badRequest(`محصول «${item.product.name}» ناموجود است.`);
      if (item.quantity < item.product.minQty)
        throw badRequest(`حداقل مقدار سفارش «${item.product.name}» ${item.product.minQty} ${item.product.unit} است.`);
      if (item.product.stock < item.quantity)
        throw badRequest(`موجودی «${item.product.name}» کافی نیست. موجودی فعلی: ${item.product.stock} ${item.product.unit}`);
      return {
        productId: item.productId,
        name: item.product.name,
        colorName: item.colorName,
        image: null,
        unitPrice,
        quantity: item.quantity,
        unit: item.product.unit,
        lineTotal: Math.round(unitPrice * item.quantity),
      };
    });

    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    let shippingCost = settings.shippingCost;
    if (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold) shippingCost = 0;

    let number = orderNumber();
    while (await prisma.order.findUnique({ where: { number } })) number = orderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const images = await tx.productImage.findMany({
        where: { productId: { in: lines.map((l) => l.productId) } },
        orderBy: { sortOrder: 'asc' },
      });
      for (const line of lines) line.image = images.find((img) => img.productId === line.productId)?.url || null;

      const created = await tx.order.create({
        data: {
          number,
          userId: req.user?.id || null,
          customerName: data.customerName,
          phone: data.phone,
          email: data.email || null,
          province: data.province,
          city: data.city,
          address: data.address,
          postalCode: data.postalCode || null,
          note: data.note || null,
          subtotal,
          shippingCost,
          total: subtotal + shippingCost,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === 'online' ? 'AWAITING' : 'UNPAID',
          items: { create: lines },
        },
        include: orderItemInclude,
      });

      for (const line of lines) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        });
      }
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });

    res.status(201).json({ order });
  })
);

/** order tracking needs both the order number and the phone used at checkout */
router.get(
  '/track',
  asyncHandler(async (req, res) => {
    const number = String(req.query.number || '').trim();
    const phone = String(req.query.phone || '').trim();
    if (!number || !phone) throw badRequest('شماره سفارش و شماره تماس را وارد کنید.');
    const order = await prisma.order.findFirst({
      where: { number, phone },
      include: orderItemInclude,
    });
    if (!order) throw notFound('سفارشی با این شماره و شماره تماس پیدا نشد.');
    res.json({ order });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!req.user) throw notFound('سفارش مورد نظر یافت نشد.');
    const order = await prisma.order.findFirst({
      where: req.user.role === 'ADMIN' ? { id: req.params.id } : { id: req.params.id, userId: req.user.id },
      include: orderItemInclude,
    });
    if (!order) throw notFound('سفارش مورد نظر یافت نشد.');
    res.json({ order });
  })
);

export default router;
