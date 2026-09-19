'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/Providers';
import { api } from '@/lib/api';
import { beep } from '@/lib/beep';
import { PAY_LABEL, STATUS_LABEL, STATUS_STYLE, fmtDate, money } from '@/lib/cafe';

const FILTERS = {
  active: { label: 'Active', qs: 'status=pending,preparing,ready' },
  done: { label: 'Finished (7 days)', qs: 'status=completed,cancelled&range=week' },
  all: { label: 'All (7 days)', qs: 'range=week' },
};
const NEXT = { pending: ['preparing', 'Start preparing'], preparing: ['ready', 'Mark ready'], ready: ['completed', 'Complete'] };

export default function OrdersPanel() {
  const toast = useToast();
  const [filter, setFilter] = useState('active');
  const [orders, setOrders] = useState(null);
  const [busyId, setBusyId] = useState('');
  const knownIds = useRef(null);

  const load = useCallback(async () => {
    try {
      const { orders } = await api(`/orders?${FILTERS[filter].qs}`);
      if (filter === 'active') {
        const ids = new Set(orders.map((o) => o._id));
        if (knownIds.current && orders.some((o) => !knownIds.current.has(o._id) && o.source === 'online')) beep();
        knownIds.current = ids;
      }
      setOrders(orders);
    } catch (e) {
      toast(e.message, 'error');
    }
  }, [filter, toast]);

  useEffect(() => {
    knownIds.current = null;
    setOrders(null);
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [load]);

  async function run(id, fn, msg) {
    setBusyId(id);
    try { await fn(); toast(msg); await load(); } catch (e) { toast(e.message, 'error'); } finally { setBusyId(''); }
  }
  const setStatus = (o, status) => run(o._id, () => api(`/orders/${o._id}/status`, { method: 'PATCH', body: { status } }), `${o.orderNumber} → ${STATUS_LABEL[status]}`);
  const collect = (o, method) => run(o._id, () => api(`/payments/${o._id}/counter`, { method: 'POST', body: { method } }), `Payment recorded for ${o.orderNumber}`);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(FILTERS).map(([k, f]) => (
          <button key={k} onClick={() => setFilter(k)} className={`rounded-xl border-2 border-ink px-4 py-1.5 font-semibold ${filter === k ? 'bg-ink text-salt' : 'hover:bg-mist'}`}>{f.label}</button>
        ))}
      </div>

      {!orders && <p className="mt-6 text-soft">Loading orders…</p>}
      {orders && !orders.length && <p className="panel mt-6 p-8 text-center text-soft">No orders here right now. New orders appear automatically and play a chime.</p>}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {orders?.map((o) => {
          const next = NEXT[o.status];
          const unpaid = o.payment.status === 'pending' && o.status !== 'cancelled';
          const closed = o.status === 'completed' || o.status === 'cancelled';
          return (
            <article key={o._id} className="panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-extrabold">{o.orderNumber} <span className={`badge ml-1 ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span></p>
                  <p className="text-sm text-soft">{o.customerName} · {o.orderType === 'dine-in' ? `Table ${o.tableNumber || '-'}` : 'Takeaway'} · {fmtDate(o.createdAt)}{o.source === 'counter' ? ' · Counter' : ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold">{money(o.total)}</p>
                  <p className={`text-xs font-bold ${o.payment.status === 'paid' ? 'text-palm' : 'text-chili'}`}>{o.payment.status === 'paid' ? `Paid · ${PAY_LABEL[o.payment.method]}` : o.payment.status === 'refunded' ? 'Refunded' : `Unpaid · ${PAY_LABEL[o.payment.method]}`}</p>
                </div>
              </div>

              <ul className="mt-3 space-y-0.5 border-y-2 border-dashed border-mist py-3 text-sm">
                {o.items.map((i) => <li key={i.name} className="flex justify-between"><span>{i.quantity}× {i.name}</span><span className="text-soft">{money(i.price * i.quantity)}</span></li>)}
              </ul>
              {o.notes && <p className="mt-2 rounded-lg bg-saffron/25 px-3 py-2 text-sm"><strong>Note:</strong> {o.notes}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {next && <button className="btn btn-dark btn-sm" disabled={busyId === o._id} onClick={() => setStatus(o, next[0])}>{next[1]}</button>}
                {unpaid && ['cash', 'card', 'wallet'].map((m) => (
                  <button key={m} className="btn btn-primary btn-sm" disabled={busyId === o._id} onClick={() => collect(o, m)}>Paid by {PAY_LABEL[m].toLowerCase()}</button>
                ))}
                {!closed && <button className="btn btn-danger btn-sm" disabled={busyId === o._id} onClick={() => confirm(`Cancel ${o.orderNumber}?`) && setStatus(o, 'cancelled')}>Cancel</button>}
                <Link href={`/orders/${o._id}`} className="btn btn-ghost btn-sm ml-auto">Bill</Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
