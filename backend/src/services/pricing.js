import { env } from '../config/env.js';
import { MenuItem } from '../models/MenuItem.js';
import { AppError } from '../utils/AppError.js';
import { round2 } from '../utils/format.js';

/** Builds order lines from DB prices (never trust prices sent by the client). */
export async function buildLines(cartItems) {
  const merged = new Map();
  for (const ci of cartItems) merged.set(ci.menuItem, (merged.get(ci.menuItem) || 0) + ci.quantity);

  const dbItems = await MenuItem.find({ _id: { $in: [...merged.keys()] } });
  const byId = new Map(dbItems.map((d) => [String(d._id), d]));

  return [...merged.entries()].map(([id, quantity]) => {
    const d = byId.get(id);
    if (!d) throw new AppError(400, 'An item in your order no longer exists. Please refresh the menu.');
    if (!d.isAvailable) throw new AppError(400, `${d.name} is sold out right now.`);
    if (quantity > 20) throw new AppError(400, `Maximum 20 of ${d.name} per order.`);
    return { menuItem: d._id, name: d.name, price: d.price, quantity };
  });
}

export function calcTotals(lines, orderType) {
  const subtotal = round2(lines.reduce((s, l) => s + l.price * l.quantity, 0));
  const serviceCharge = orderType === 'dine-in' ? round2(subtotal * env.serviceChargeRate) : 0;
  const tax = round2((subtotal + serviceCharge) * env.taxRate);
  return { subtotal, serviceCharge, tax, total: round2(subtotal + serviceCharge + tax) };
}
