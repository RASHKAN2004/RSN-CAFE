'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import { api } from '@/lib/api';
import { STATUS_LABEL, STATUS_STYLE, fmtDate, money } from '@/lib/cafe';

function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/orders/mine').then((d) => setOrders(d.orders)).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">My orders</h1>
      {error && <p className="mt-6 text-chili">{error}</p>}
      {!orders && !error && <p className="mt-6 text-soft">Loading…</p>}
      {orders && !orders.length && (
        <div className="panel mt-6 p-8 text-center">
          <p className="text-soft">You have not ordered yet.</p>
          <Link href="/menu" className="btn btn-primary mt-4">Browse the menu</Link>
        </div>
      )}
      <ul className="mt-6 space-y-3">
        {orders?.map((o) => (
          <li key={o._id}>
            <Link href={`/orders/${o._id}`} className="panel flex items-center justify-between gap-4 p-4 hover:border-ink">
              <div className="min-w-0">
                <p className="font-bold">{o.orderNumber} <span className={`badge ml-2 ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span></p>
                <p className="mt-1 truncate text-sm text-soft">{o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}</p>
                <p className="text-xs text-soft">{fmtDate(o.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold">{money(o.total)}</p>
                <p className={`text-xs font-semibold ${o.payment.status === 'paid' ? 'text-palm' : 'text-chili'}`}>{o.payment.status === 'paid' ? 'Paid' : o.payment.status === 'refunded' ? 'Refunded' : 'Unpaid'}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function OrdersPage() {
  return <RequireAuth><Orders /></RequireAuth>;
}
