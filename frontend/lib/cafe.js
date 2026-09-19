export const CAFE = {
  name: 'RSN CAFE',
  address: 'Kalpitiya, Puttalam District, Sri Lanka',
  phone: '+94 75 051 9450',
  hours: 'Every day · 7:00 AM – 10:00 PM',
  mapQuery: 'Kalpitiya, Sri Lanka',
};

export const DEFAULT_RATES = { serviceChargeRate: 0.1, taxRate: 0 };

export const money = (n) =>
  `Rs. ${Number(n || 0).toLocaleString('en-LK', { maximumFractionDigits: 2 })}`;

const r2 = (n) => Math.round(n * 100) / 100;

/** Mirrors the server calculation (server is the source of truth). */
export function calcTotals(subtotal, orderType, rates = DEFAULT_RATES) {
  const serviceCharge = orderType === 'dine-in' ? r2(subtotal * rates.serviceChargeRate) : 0;
  const tax = r2((subtotal + serviceCharge) * rates.taxRate);
  return { subtotal: r2(subtotal), serviceCharge, tax, total: r2(subtotal + serviceCharge + tax) };
}

export const STATUS_LABEL = {
  pending: 'Order placed',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const STATUS_STYLE = {
  pending: 'bg-saffron/30 text-ink',
  preparing: 'bg-tide/15 text-tide',
  ready: 'bg-palm/15 text-palm',
  completed: 'bg-mist text-soft',
  cancelled: 'bg-chili/15 text-chili',
};

export const PAY_LABEL = { cash: 'Cash', card: 'Card', wallet: 'Mobile wallet' };

export const fmtDate = (d) =>
  new Date(d).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Colombo' });
