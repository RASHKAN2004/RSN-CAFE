import { Router } from 'express';
import { Order } from '../models/Order.js';
import { protect, staffOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

const router = Router();

router.get(
  '/stats',
  protect,
  staffOnly,
  asyncHandler(async (req, res) => {
    const off = env.tzOffsetMinutes * 60000;
    const startToday = new Date(Math.floor((Date.now() + off) / 86400000) * 86400000 - off);
    const start7 = new Date(startToday.getTime() - 6 * 86400000);
    const paid = { 'payment.status': 'paid' };

    const [today, active, top, week] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startToday }, status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: null,
            orders: { $sum: 1 },
            revenue: { $sum: { $cond: [{ $eq: ['$payment.status', 'paid'] }, '$total', 0] } },
          },
        },
      ]),
      Order.aggregate([
        { $match: { status: { $in: ['pending', 'preparing', 'ready'] } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { ...paid, createdAt: { $gte: start7 } } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.name',
            qty: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        { $sort: { qty: -1 } },
        { $limit: 5 },
      ]),
      Order.aggregate([
        { $match: { ...paid, createdAt: { $gte: start7 } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: env.timezone } },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
      ]),
    ]);

    const counts = Object.fromEntries(active.map((a) => [a._id, a.count]));
    res.json({
      today: { orders: today[0]?.orders || 0, revenue: today[0]?.revenue || 0 },
      active: { pending: counts.pending || 0, preparing: counts.preparing || 0, ready: counts.ready || 0 },
      topItems: top.map((t) => ({ name: t._id, qty: t.qty, revenue: t.revenue })),
      week: week.map((w) => ({ date: w._id, revenue: w.revenue, orders: w.orders })),
    });
  })
);

export default router;
