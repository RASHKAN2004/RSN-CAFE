'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Check, Printer } from 'lucide-react';
import RequireAuth from '@/components/RequireAuth';
import Bill from '@/components/Bill';
import { useAuth, useToast } from '@/components/Providers';
import { api } from '@/lib/api';
import { STATUS_LABEL, STATUS_STYLE, PAY_LABEL, money } from '@/lib/cafe';

const STEPS = ['pending', 'preparing', 'ready', 'completed'];

function OrderView() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isStaff = user.role !== 'customer';

  const load = useCallback(async () => {
    try {
      const d = await api(`/orders/${id}`);
      setOrder(d.order);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }, [id]);

  useEffect(() => {
    load();
    const t = setInterval(load, 8000); // live status updates
    return () => clearInterval(t);
  }, [load]);

  async function act(fn, okMsg) {
    setBusy(true);
    try { await fn(); toast(okMsg); await load(); } catch (e) { toast(e.message, 'error'); } finally { setBusy(false); }
  }

  if (error && !order) return <div className="mx-auto max-w-md px-4 py-24 text-center"><p className="text-chili">{error}</p><Link href="/orders" className="btn btn-ghost mt-4">Back to orders</Link></div>;
  if (!order) return <div className="grid min-h-[50vh] place-items-center text-soft">Loading order…</div>;

  const cancelled = order.status === 'cancelled';
  const stepIdx = STEPS.indexOf(order.status);
  const needsOnlinePay = !isStaff && order.payment.status === 'pending' && order.payment.method !== 'cash' && !cancelled;
  const canCancel = !isStaff && order.status === 'pending' && order.payment.status !== 'paid';

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href={isStaff ? '/admin' : '/orders'} className="no-print text-sm font-semibold text-soft underline underline-offset-4">{isStaff ? 'Back to dashboard' : 'All my orders'}</Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-4xl font-extrabold">{order.orderNumber}</h1>
        <span className={`badge ${STATUS_STYLE[order.status]}`}>{STATUS_LABEL[order.status]}</span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="no-print space-y-6">
          {cancelled ? (
            <p className="panel border-chili p-5 font-semibold text-chili">This order was cancelled.</p>
          ) : (
            <ol className="panel space-y-0 p-5" aria-label="Order progress">
              {STEPS.map((s, i) => {
                const done = i <= stepIdx;
                return (
                  <li key={s} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className={`grid h-8 w-8 place-items-center rounded-full border-2 ${done ? 'border-ink bg-saffron' : 'border-mist bg-paper'}`}>{done && <Check size={16} />}</span>
                      {i < STEPS.length - 1 && <span className={`h-8 w-0.5 ${i < stepIdx ? 'bg-ink' : 'bg-mist'}`} />}
                    </div>
                    <p className={`pt-1 font-semibold ${done ? '' : 'text-soft'} ${i === stepIdx ? 'text-lg' : ''}`}>
                      {STATUS_LABEL[s]}
                      {i === stepIdx && s === 'ready' && <span className="block text-sm font-normal text-soft">{order.orderType === 'takeaway' ? 'Please collect at the counter.' : 'We are bringing it to your table.'}</span>}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}

          {needsOnlinePay && (
            <div className="panel border-ink p-5">
              <h2 className="text-xl font-bold">Pay {money(order.total)} now</h2>
              <p className="mt-1 text-sm text-soft">Paying by {PAY_LABEL[order.payment.method].toLowerCase()}. This is a demo gateway. No real money is charged until you connect PayHere or Stripe (see README).</p>
              <button className="btn btn-primary mt-4 w-full" disabled={busy}
                onClick={() => act(() => api(`/payments/${order._id}/online`, { method: 'POST' }), 'Payment received. SMS receipt sent.')}>
                {busy ? 'Processing…' : `Pay ${money(order.total)}`}
              </button>
            </div>
          )}
          {!isStaff && order.payment.status === 'pending' && order.payment.method === 'cash' && !cancelled && (
            <p className="panel p-5 text-sm">Please pay <strong>{money(order.total)}</strong> in cash at the counter.</p>
          )}

          <div className="flex flex-wrap gap-3">
            <button className="btn btn-dark" onClick={() => window.print()}><Printer size={18} /> Print bill</button>
            {canCancel && <button className="btn btn-danger" disabled={busy} onClick={() => confirm('Cancel this order?') && act(() => api(`/orders/${order._id}/cancel`, { method: 'PATCH' }), 'Order cancelled.')}>Cancel order</button>}
          </div>
          {order.notes && <p className="text-sm text-soft"><strong>Your note:</strong> {order.notes}</p>}
        </div>

        <Bill order={order} />
      </div>
    </div>
  );
}

export default function OrderPage() {
  return <RequireAuth><OrderView /></RequireAuth>;
}
