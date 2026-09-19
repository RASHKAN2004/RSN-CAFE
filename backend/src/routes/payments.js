import { Router } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Order } from '../models/Order.js';
import { protect, staffOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { markPaid } from './orders.js';
import { notifyCustomer, notifyStaff } from '../services/notify.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { money } from '../utils/format.js';
import { env } from '../config/env.js';

const router = Router();
const checkId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id) ? next() : next(new AppError(400, 'Invalid order ID.'));

async function loadPayable(id) {
  const order = await Order.findById(id);
  if (!order) throw new AppError(404, 'Order not found.');
  if (order.status === 'cancelled') throw new AppError(400, 'This order was cancelled.');
  if (order.payment.status === 'paid') throw new AppError(400, 'This order is already paid.');
  return order;
}

async function announcePaid(order) {
  await notifyCustomer(
    order,
    { title: `Payment received`, message: `${money(order.total)} paid for ${order.orderNumber}. Receipt ${order.payment.receiptNumber}.`, type: 'payment' },
    { sms: true, smsText: `${env.cafeName}: Payment of ${money(order.total)} received for ${order.orderNumber}. Receipt ${order.payment.receiptNumber}. Thank you!` }
  );
}

/**
 * Customer pays online (card / wallet).
 * ⚠️ DEMO GATEWAY: this marks the order as paid without charging anything.
 * To accept real money, replace the body with a gateway flow (e.g. PayHere / Stripe):
 * create a checkout session here, and call markPaid() from the gateway's verified WEBHOOK.
 */
router.post(
  '/:id/online',
  protect,
  checkId,
  asyncHandler(async (req, res) => {
    const order = await loadPayable(req.params.id);
    if (String(order.user) !== req.user.id) throw new AppError(403, 'This order belongs to another account.');
    if (order.payment.method === 'cash') throw new AppError(400, 'This order is set to pay at the counter.');

    markPaid(order, order.payment.method, 'DEMO-' + crypto.randomBytes(5).toString('hex').toUpperCase());
    await order.save();
    await announcePaid(order);
    await notifyStaff({ title: `Payment received`, message: `${order.orderNumber} paid online · ${money(order.total)}`, order: order._id });
    res.json({ order });
  })
);

// Staff collects payment at the counter
router.post(
  '/:id/counter',
  protect,
  staffOnly,
  checkId,
  validate(z.object({ method: z.enum(['cash', 'card', 'wallet']) })),
  asyncHandler(async (req, res) => {
    const order = await loadPayable(req.params.id);
    markPaid(order, req.body.method);
    await order.save();
    await announcePaid(order);
    res.json({ order });
  })
);

export default router;
