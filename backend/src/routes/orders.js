import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Order, nextOrderNumber } from '../models/Order.js';
import { User } from '../models/User.js';
import { protect, staffOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { buildLines, calcTotals } from '../services/pricing.js';
import { notifyCustomer, notifyStaff } from '../services/notify.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { normalizePhone } from '../utils/phone.js';
import { money } from '../utils/format.js';
import { env } from '../config/env.js';

const router = Router();
const isStaff = (u) => u.role === 'admin' || u.role === 'staff';

const line = z.object({
  menuItem: z.string().refine((v) => mongoose.isValidObjectId(v), 'Invalid item.'),
  quantity: z.coerce.number().int().min(1).max(20),
});
const base = {
  items: z.array(line).min(1, 'Your order is empty.').max(50),
  orderType: z.enum(['dine-in', 'takeaway']),
  tableNumber: z.string().trim().max(10).optional(),
  notes: z.string().trim().max(200).optional(),
  paymentMethod: z.enum(['cash', 'card', 'wallet']),
};
const needsTable = (d) => d.orderType !== 'dine-in' || !!d.tableNumber;
const tableMsg = { message: 'Table number is required for dine-in.', path: ['tableNumber'] };

const createSchema = z.object(base).refine(needsTable, tableMsg);
const counterSchema = z
  .object({
    ...base,
    customerName: z.string().trim().max(60).optional(),
    customerPhone: z.string().trim().optional(),
    markPaid: z.boolean().optional(),
  })
  .refine(needsTable, tableMsg);

const checkId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id) ? next() : next(new AppError(400, 'Invalid order ID.'));

function markPaid(order, method, transactionId) {
  order.payment.method = method;
  order.payment.status = 'paid';
  order.payment.paidAt = new Date();
  order.payment.receiptNumber = `RCPT-${order.orderNumber.replace('RSN-', '')}`;
  if (transactionId) order.payment.transactionId = transactionId;
}
export { markPaid };

// ---- Customer: place an order ----
router.post(
  '/',
  protect,
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const b = req.body;
    const lines = await buildLines(b.items);
    const totals = calcTotals(lines, b.orderType);
    const order = await Order.create({
      orderNumber: await nextOrderNumber(),
      user: req.user._id,
      customerName: req.user.name,
      customerPhone: req.user.phone,
      items: lines,
      orderType: b.orderType,
      tableNumber: b.orderType === 'dine-in' ? b.tableNumber : undefined,
      notes: b.notes,
      source: 'online',
      ...totals,
      payment: { method: b.paymentMethod, status: 'pending' },
    });

    const payHint = b.paymentMethod === 'cash' ? 'Pay at the counter.' : 'Complete your payment online.';
    await notifyCustomer(
      order,
      {
        title: `Order ${order.orderNumber} placed`,
        message: `We received your order. Total ${money(order.total)}. ${payHint}`,
        type: 'order',
      },
      {
        sms: true,
        smsText: `${env.cafeName}: Order ${order.orderNumber} received! Total ${money(order.total)}. ${payHint} We'll text you when it's ready.`,
      }
    );
    await notifyStaff(
      {
        title: `New order ${order.orderNumber}`,
        message: `${order.customerName} · ${order.orderType}${order.tableNumber ? ' · Table ' + order.tableNumber : ''} · ${money(order.total)}`,
        order: order._id,
      },
      { sms: true }
    );
    res.status(201).json({ order });
  })
);

// ---- Staff: counter (walk-in) billing ----
router.post(
  '/counter',
  protect,
  staffOnly,
  validate(counterSchema),
  asyncHandler(async (req, res) => {
    const b = req.body;
    const lines = await buildLines(b.items);
    const totals = calcTotals(lines, b.orderType);
    const customerPhone = b.customerPhone ? normalizePhone(b.customerPhone) : undefined;
    if (b.customerPhone && !customerPhone) throw new AppError(400, 'Customer phone number is invalid.');
    const account = customerPhone ? await User.findOne({ phone: customerPhone }) : null;

    const order = new Order({
      orderNumber: await nextOrderNumber(),
      user: account?._id,
      customerName: b.customerName || account?.name || 'Walk-in',
      customerPhone,
      items: lines,
      orderType: b.orderType,
      tableNumber: b.orderType === 'dine-in' ? b.tableNumber : undefined,
      notes: b.notes,
      source: 'counter',
      status: 'preparing',
      ...totals,
      payment: { method: b.paymentMethod, status: 'pending' },
    });
    if (b.markPaid) markPaid(order, b.paymentMethod);
    await order.save();

    if (customerPhone)
      await notifyCustomer(
        order,
        {
          title: `Bill ${order.orderNumber}`,
          message: `Thanks for visiting ${env.cafeName}. Total ${money(order.total)}${order.payment.status === 'paid' ? ' — paid.' : '.'}`,
        },
        { sms: true }
      );
    res.status(201).json({ order });
  })
);

// ---- Customer: my orders ----
router.get(
  '/mine',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ orders });
  })
);

// ---- Staff: all orders ----
router.get(
  '/',
  protect,
  staffOnly,
  asyncHandler(async (req, res) => {
    const filter = {};
    const allowed = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (req.query.status) {
      const list = String(req.query.status).split(',').filter((s) => allowed.includes(s));
      if (list.length) filter.status = { $in: list };
    }
    if (req.query.range === 'today' || req.query.range === 'week') {
      const days = req.query.range === 'today' ? 0 : 6;
      const off = env.tzOffsetMinutes * 60000;
      const startToday = Math.floor((Date.now() + off) / 86400000) * 86400000 - off;
      filter.createdAt = { $gte: new Date(startToday - days * 86400000) };
    }
    const limit = Math.min(Number(req.query.limit) || 100, 200);
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(limit);
    res.json({ orders });
  })
);

router.get(
  '/:id',
  protect,
  checkId,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError(404, 'Order not found.');
    if (!isStaff(req.user) && String(order.user) !== req.user.id)
      throw new AppError(403, 'This order belongs to another account.');
    res.json({ order });
  })
);

// ---- Staff: update status ----
const FLOW = {
  pending: ['preparing', 'ready', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['preparing', 'completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

router.patch(
  '/:id/status',
  protect,
  staffOnly,
  checkId,
  validate(z.object({ status: z.enum(['preparing', 'ready', 'completed', 'cancelled']) })),
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError(404, 'Order not found.');
    const next = req.body.status;
    if (!FLOW[order.status].includes(next))
      throw new AppError(400, `Cannot change an order from ${order.status} to ${next}.`);
    if (next === 'completed' && order.payment.status !== 'paid')
      throw new AppError(400, 'Collect the payment before completing this order.');

    order.status = next;
    if (next === 'cancelled' && order.payment.status === 'paid') order.payment.status = 'refunded';
    await order.save();

    const n = order.orderNumber;
    if (next === 'preparing')
      await notifyCustomer(order, { title: `Order ${n}`, message: 'Your order is being prepared.' });
    if (next === 'ready')
      await notifyCustomer(
        order,
        {
          title: `Order ${n} is ready!`,
          message: order.orderType === 'takeaway' ? 'Please collect it at the counter.' : 'We are bringing it to your table.',
        },
        {
          sms: true,
          smsText: `${env.cafeName}: Your order ${n} is READY! ${order.orderType === 'takeaway' ? 'Please collect it at the counter.' : 'We are bringing it to your table.'}`,
        }
      );
    if (next === 'completed')
      await notifyCustomer(order, { title: `Order ${n} completed`, message: `Thank you for visiting ${env.cafeName}!` });
    if (next === 'cancelled')
      await notifyCustomer(
        order,
        { title: `Order ${n} cancelled`, message: 'Your order was cancelled by the cafe.' },
        { sms: true, smsText: `${env.cafeName}: Order ${n} was cancelled. Please contact us if you have questions.` }
      );
    res.json({ order });
  })
);

// ---- Customer: cancel own pending, unpaid order ----
router.patch(
  '/:id/cancel',
  protect,
  checkId,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError(404, 'Order not found.');
    if (String(order.user) !== req.user.id) throw new AppError(403, 'This order belongs to another account.');
    if (order.status !== 'pending' || order.payment.status === 'paid')
      throw new AppError(400, 'This order can no longer be cancelled online. Please contact the cafe.');
    order.status = 'cancelled';
    await order.save();
    await notifyStaff({ title: `Order ${order.orderNumber} cancelled`, message: `${order.customerName} cancelled the order.`, order: order._id });
    res.json({ order });
  })
);

export default router;
