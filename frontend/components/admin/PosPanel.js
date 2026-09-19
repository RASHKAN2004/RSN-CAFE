'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useToast } from '@/components/Providers';
import { api } from '@/lib/api';
import { DEFAULT_RATES, calcTotals, money } from '@/lib/cafe';

/** Counter billing for walk-in customers. */
export default function PosPanel() {
  const toast = useToast();
  const router = useRouter();
  const [menu, setMenu] = useState([]);
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [cat, setCat] = useState('All');
  const [lines, setLines] = useState({}); // id -> {item, qty}
  const [orderType, setOrderType] = useState('takeaway');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [markPaid, setMarkPaid] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/menu', { auth: false }).then((d) => setMenu(d.items.filter((i) => i.isAvailable))).catch((e) => toast(e.message, 'error'));
    api('/cafe/info', { auth: false }).then((d) => setRates({ serviceChargeRate: d.serviceChargeRate, taxRate: d.taxRate })).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cats = useMemo(() => ['All', ...new Set(menu.map((i) => i.category))], [menu]);
  const shown = menu.filter((i) => cat === 'All' || i.category === cat);
  const list = Object.values(lines);
  const subtotal = list.reduce((s, l) => s + l.item.price * l.qty, 0);
  const t = calcTotals(subtotal, orderType, rates);

  const bump = (item, d) =>
    setLines((cur) => {
      const qty = (cur[item._id]?.qty || 0) + d;
      const next = { ...cur };
      if (qty <= 0) delete next[item._id];
      else next[item._id] = { item, qty: Math.min(qty, 20) };
      return next;
    });

  async function create() {
    setBusy(true);
    try {
      const { order } = await api('/orders/counter', {
        method: 'POST',
        body: {
          items: list.map((l) => ({ menuItem: l.item._id, quantity: l.qty })),
          orderType,
          tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
          customerName: customerName || undefined,
          customerPhone: customerPhone || undefined,
          paymentMethod,
          markPaid,
        },
      });
      toast(`Bill ${order.orderNumber} created.`);
      router.push(`/orders/${order._id}`);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className="lg:col-span-3">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap rounded-xl border-2 border-ink px-3 py-1 text-sm font-semibold ${cat === c ? 'bg-ink text-salt' : 'hover:bg-mist'}`}>{c}</button>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {shown.map((i) => (
            <button key={i._id} onClick={() => bump(i, 1)} className="panel flex items-center gap-3 p-3 text-left hover:border-ink">
              <span className="text-3xl">{i.emoji}</span>
              <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{i.name}</span><span className="text-sm text-soft">{money(i.price)}</span></span>
              {lines[i._id] && <span className="badge bg-saffron">{lines[i._id].qty}</span>}
            </button>
          ))}
        </div>
      </section>

      <section className="panel h-fit space-y-4 p-5 lg:col-span-2">
        <h2 className="text-xl font-bold">Current bill</h2>
        {!list.length && <p className="text-sm text-soft">Tap items on the left to add them.</p>}
        <ul className="space-y-2">
          {list.map(({ item, qty }) => (
            <li key={item._id} className="flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0 flex-1 truncate font-semibold">{item.name}</span>
              <span className="flex items-center gap-1 rounded-lg border-2 border-ink">
                <button className="p-1 hover:bg-mist" onClick={() => bump(item, -1)} aria-label={`Remove one ${item.name}`}><Minus size={14} /></button>
                <span className="min-w-5 text-center font-bold">{qty}</span>
                <button className="p-1 hover:bg-mist" onClick={() => bump(item, 1)} aria-label={`Add one ${item.name}`}><Plus size={14} /></button>
              </span>
              <span className="w-20 text-right">{money(item.price * qty)}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-2">
          {[['takeaway', 'Takeaway'], ['dine-in', 'Dine in']].map(([v, l]) => (
            <button key={v} type="button" onClick={() => setOrderType(v)} className={`rounded-xl border-2 py-2 font-semibold ${orderType === v ? 'border-ink bg-ink text-salt' : 'border-mist hover:border-ink'}`}>{l}</button>
          ))}
        </div>
        {orderType === 'dine-in' && <input className="input" placeholder="Table number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} maxLength={10} aria-label="Table number" />}
        <input className="input" placeholder="Customer name (optional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} maxLength={60} aria-label="Customer name" />
        <input className="input" type="tel" placeholder="Customer phone for SMS bill (optional)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} aria-label="Customer phone" />

        <div className="grid grid-cols-3 gap-2">
          {[['cash', 'Cash'], ['card', 'Card'], ['wallet', 'Wallet']].map(([v, l]) => (
            <button key={v} type="button" onClick={() => setPaymentMethod(v)} className={`rounded-xl border-2 py-2 text-sm font-semibold ${paymentMethod === v ? 'border-ink bg-saffron' : 'border-mist hover:border-ink'}`}>{l}</button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-5 w-5 accent-[#0a2a2f]" checked={markPaid} onChange={(e) => setMarkPaid(e.target.checked)} /> Customer has paid now</label>

        <dl className="space-y-1 border-t-2 border-mist pt-3 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(t.subtotal)}</dd></div>
          {t.serviceCharge > 0 && <div className="flex justify-between"><dt>Service charge</dt><dd>{money(t.serviceCharge)}</dd></div>}
          {t.tax > 0 && <div className="flex justify-between"><dt>Tax</dt><dd>{money(t.tax)}</dd></div>}
          <div className="flex justify-between pt-1 text-xl font-extrabold"><dt>Total</dt><dd>{money(t.total)}</dd></div>
        </dl>
        <button className="btn btn-primary w-full py-3" disabled={!list.length || busy || (orderType === 'dine-in' && !tableNumber)} onClick={create}>{busy ? 'Creating…' : 'Create bill'}</button>
      </section>
    </div>
  );
}
