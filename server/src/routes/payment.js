import express from 'express';
import { prisma } from '../db.js';
import { asyncHandler, badRequest, notFound } from '../util.js';
import { getSettings, gatewayConfigured } from '../settings.js';

const router = express.Router();

/**
 * Payment is intentionally not simulated. Until a real gateway is connected through
 * PAYMENT_GATEWAY_URL / PAYMENT_GATEWAY_KEY, no order is ever marked as paid.
 */
router.get(
  '/status',
  asyncHandler(async (_req, res) => {
    const settings = await getSettings();
    res.json({
      onlineEnabled: settings.paymentOnlineEnabled,
      gatewayConfigured: gatewayConfigured(),
    });
  })
);

router.post(
  '/start/:orderId',
  asyncHandler(async (req, res) => {
    const settings = await getSettings();
    if (!settings.paymentOnlineEnabled) throw badRequest('پرداخت آنلاین در فروشگاه فعال نیست.');
    if (!gatewayConfigured())
      throw badRequest(
        'درگاه پرداخت هنوز به فروشگاه متصل نشده است. برای اتصال، اطلاعات درگاه را در تنظیمات سرور ثبت کنید.'
      );
    const order = await prisma.order.findUnique({ where: { id: req.params.orderId } });
    if (!order) throw notFound('سفارش یافت نشد.');
    if (order.paymentStatus === 'PAID') throw badRequest('این سفارش قبلاً پرداخت شده است.');

    // A gateway request is only created when real credentials exist.
    const response = await fetch(`${process.env.PAYMENT_GATEWAY_URL}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.PAYMENT_GATEWAY_KEY}` },
      body: JSON.stringify({
        amount: order.total,
        orderId: order.id,
        description: `پرداخت سفارش ${order.number}`,
        callbackUrl: `${process.env.PUBLIC_BASE_URL || ''}/api/payment/callback?orderId=${order.id}`,
      }),
    });
    if (!response.ok) {
      await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'FAILED' } });
      throw badRequest('درگاه پرداخت پاسخ معتبری برنگرداند. لطفاً بعداً تلاش کنید.');
    }
    const payload = await response.json();
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'AWAITING', paymentRef: payload.authority || payload.token || null },
    });
    res.json({ redirectUrl: payload.redirectUrl || payload.paymentUrl });
  })
);

router.get(
  '/callback',
  asyncHandler(async (req, res) => {
    if (!gatewayConfigured()) throw badRequest('درگاه پرداخت تنظیم نشده است.');
    const order = await prisma.order.findUnique({ where: { id: String(req.query.orderId || '') } });
    if (!order) throw notFound('سفارش یافت نشد.');
    const verify = await fetch(`${process.env.PAYMENT_GATEWAY_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.PAYMENT_GATEWAY_KEY}` },
      body: JSON.stringify({
        amount: order.total,
        authority: req.query.authority || order.paymentRef,
        status: req.query.status,
      }),
    });
    const result = verify.ok ? await verify.json() : { paid: false };
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: result.paid ? 'PAID' : 'FAILED' },
    });
    res.redirect(`${process.env.PUBLIC_BASE_URL || ''}/order/${order.number}`);
  })
);

export default router;
