import { env } from '../config/env.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { sendSms } from './sms.js';

/** In-app notification for a user + optional SMS. Never throws. */
export async function notifyUser(userId, { title, message, type = 'account', order }, sms) {
  try {
    if (userId) await Notification.create({ user: userId, title, message, type, order });
    if (sms?.to) void sendSms(sms.to, sms.text || message);
  } catch (e) {
    console.error('[notify] user failed:', e.message);
  }
}

/** Notify the customer of an order (in-app if they have an account, SMS if phone known). */
export async function notifyCustomer(order, { title, message, type = 'order' }, { sms = false, smsText } = {}) {
  await notifyUser(
    order.user,
    { title, message, type, order: order._id },
    sms && order.customerPhone ? { to: order.customerPhone, text: smsText || message } : null
  );
}

/** Notify every admin/staff account (in-app) + optional owner SMS. */
export async function notifyStaff({ title, message, order }, { sms = false } = {}) {
  try {
    const staff = await User.find({ role: { $in: ['admin', 'staff'] } }).select('_id');
    if (staff.length)
      await Notification.insertMany(
        staff.map((s) => ({ user: s._id, title, message, type: 'staff', order }))
      );
    if (sms && env.sms.adminAlertPhone) void sendSms(env.sms.adminAlertPhone, `${env.cafeName}: ${message}`);
  } catch (e) {
    console.error('[notify] staff failed:', e.message);
  }
}
