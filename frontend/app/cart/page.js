'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useAuth, useCart, useToast } from '@/components/Providers';
import { api } from '@/lib/api';
import { DEFAULT_RATES, calcTotals, money } from '@/lib/cafe';

const PAY = [
  { v: 'cash', t: 'Cash at counter', d: 'Pay when you collect or finish' },
  { v: 'card', t: 'Card online', d: 'Pay now, skip the queue' },
  { v: 'wallet', t: 'Mobile wallet', d: 'Pay now with your wallet' },
];

export default function CartPage() {
  const { items, add, dec, remove, clear, subtotal } = useCart();
  const { user, loading } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [orderType, setOrderType] = useState('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/cafe/info', { auth: false }).then((d) => setRates({ serviceChargeRate: d.serviceChargeRate, taxRate: d.taxRate })).catch(() => {});
  }, []);

  const t = calcTotals(subtotal, orderType, rates);

  async function placeOrder(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { order } = await api('/orders', {
        method: 'POST',
        body: {
          items: items.map((i) => ({ menuItem: i.id, quantity: i.quantity })),
          orderType,
          tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
          notes: notes || undefined,
          paymentMethod,
        },
      });
      clear();
      toast(`Order ${order.orderNumber} placed. Check your phone for an SMS.`);
      router.push(`/orders/${order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!items.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl font-extrabold">Your cart is empty</h1>
        <p className="mt-3 text-soft">Pick something from the menu and it will show up here.</p>
        <Link href="/menu" className="btn btn-primary mt-6">Browse the menu</Link>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-5">
      <section className="lg:col-span-3">
        <h1 className="text-4xl font-extrabold">Your order</h1>
        <ul className="panel mt-6 divide-y-2 divide-mist">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-4 p-4">
              <span className="text-3xl" aria-hidden="true">{i.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{i.name}</p>
                <p className="text-sm text-soft">{money(i.price)} each</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border-2 border-ink">
                <button className="p-1.5 hover:bg-mist" onClick={() => dec(i.id)} aria-label={`Remove one ${i.name}`}><Minus size={16} /></button>
                <span className="min-w-5 text-center font-bold">{i.quantity}</span>
                <button className="p-1.5 hover:bg-mist" onClick={() => add({ _id: i.id, name: i.name, price: i.price, emoji: i.emoji })} aria-label={`Add one ${i.name}`}><Plus size={16} /></button>
              </div>
              <p className="w-24 text-right font-bold">{money(i.price * i.quantity)}</p>
              <button className="rounded-lg p-2 text-chili hover:bg-chili/10" onClick={() => remove(i.id)} aria-label={`Delete ${i.name}`}><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={placeOrder} className="panel h-fit space-y-5 p-5 lg:col-span-2">
        <fieldset>
          <legend className="label">How will you have it?</legend>
          <div className="grid grid-cols-2 gap-2">
            {[['dine-in', 'Dine in'], ['takeaway', 'Takeaway']].map(([v, l]) => (
              <label key={v} className={`cursor-pointer rounded-xl border-2 px-4 py-2.5 text-center font-semibold ${orderType === v ? 'border-ink bg-ink text-salt' : 'border-mist hover:border-ink'}`}>
                <input type="radio" name="orderType" value={v} checked={orderType === v} onChange={() => setOrderType(v)} className="sr-only" /> {l}
              </label>
            ))}
          </div>
        </fieldset>

        {orderType === 'dine-in' && (
          <div>
            <label className="label" htmlFor="table">Table number</label>
            <input id="table" className="input" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} maxLength={10} placeholder="e.g. 4" required />
          </div>
        )}

        <div>
          <label className="label" htmlFor="notes">Notes for the kitchen (optional)</label>
          <textarea id="notes" className="input" rows={2} maxLength={200} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Less sugar, no onion…" />
        </div>

        <fieldset>
          <legend className="label">Payment</legend>
          <div className="space-y-2">
            {PAY.map((p) => (
              <label key={p.v} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-2.5 ${paymentMethod === p.v ? 'border-ink bg-saffron/25' : 'border-mist hover:border-ink'}`}>
                <input type="radio" name="pay" value={p.v} checked={paymentMethod === p.v} onChange={() => setPaymentMethod(p.v)} className="accent-[#0a2a2f]" />
                <span><span className="block font-semibold">{p.t}</span><span className="text-sm text-soft">{p.d}</span></span>
              </label>
            ))}
          </div>
        </fieldset>

        <dl className="space-y-1.5 border-t-2 border-mist pt-4 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(t.subtotal)}</dd></div>
          {t.serviceCharge > 0 && <div className="flex justify-between"><dt>Service charge ({Math.round(rates.serviceChargeRate * 100)}%)</dt><dd>{money(t.serviceCharge)}</dd></div>}
          {t.tax > 0 && <div className="flex justify-between"><dt>Tax</dt><dd>{money(t.tax)}</dd></div>}
          <div className="flex justify-between pt-2 text-xl font-extrabold"><dt>Total</dt><dd>{money(t.total)}</dd></div>
        </dl>

        {error && <p className="rounded-xl bg-chili/10 px-4 py-3 text-sm font-semibold text-chili" role="alert">{error}</p>}

        {!loading && !user ? (
          <div className="space-y-2">
            <p className="text-sm text-soft">Log in with your phone number to place this order. Your cart will be saved.</p>
            <Link href="/login?next=/cart" className="btn btn-dark w-full">Log in to order</Link>
          </div>
        ) : (
          <button className="btn btn-primary w-full py-3 text-lg" disabled={busy || loading}>{busy ? 'Placing order…' : `Place order · ${money(t.total)}`}</button>
        )}
      </form>
    </div>
  );
}
